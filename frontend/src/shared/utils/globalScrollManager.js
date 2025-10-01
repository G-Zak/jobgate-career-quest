/**
 * Global Scroll Manager
 * Provides a centralized way to handle scroll-to-top functionality across the entire application
 */

class GlobalScrollManager {
 constructor() {
 this.scrollListeners = new Set();
 this.isScrolling = false;
 this.scrollTimeout = null;
 this.debug = false;
 }

 /**
 * Enable debug logging
 */
 enableDebug() {
 this.debug = true;
 }

 /**
 * Disable debug logging
 */
 disableDebug() {
 this.debug = false;
 }

 /**
 * Log debug messages
 */
 log(message, data = {}) {
 if (this.debug) {
 console.log(`[GlobalScrollManager] ${message}`, data);
 }
 }

 /**
 * Force scroll to top with multiple fallback methods
 */
 scrollToTop(options = {}) {
 const {
 smooth = true,
 delay = 0,
 forceImmediate = false,
 attempts = 3
 } = options;

 this.log('Scroll to top requested', { smooth, delay, forceImmediate, attempts });

 const performScroll = (attempt = 0) => {
 try {
 // Method 1: Force immediate scroll
 window.scrollTo(0, 0);
 document.documentElement.scrollTop = 0;
 document.body.scrollTop = 0;

 // Method 2: Smooth scroll if requested
 if (smooth && !forceImmediate) {
 setTimeout(() => {
 window.scrollTo({ top: 0, behavior: 'smooth' });
 }, 50);
 }

 // Method 3: Try to scroll any scrollable containers
 const scrollableElements = document.querySelectorAll(
 '[data-scroll-container], .test-scroll-container, .content-scroll, #test-content'
 );

 scrollableElements.forEach(element => {
 if (element && element.scrollTo) {
 element.scrollTo(0, 0);
 }
 });

 this.log('Scroll completed', { attempt: attempt + 1 });

 } catch (error) {
 this.log('Scroll error', { error: error.message, attempt: attempt + 1 });

 // Retry if we haven't reached max attempts
 if (attempt < attempts - 1) {
 setTimeout(() => performScroll(attempt + 1), 100);
 }
 }
 };

 if (delay > 0) {
 setTimeout(() => performScroll(), delay);
 } else {
 performScroll();
 }
 }

 /**
 * Scroll to top with animation
 */
 scrollToTopAnimated(options = {}) {
 const {
 duration = 300,
 delay = 0
 } = options;

 this.log('Animated scroll to top', { duration, delay });

 const performAnimatedScroll = () => {
 const start = window.pageYOffset;
 const startTime = performance.now();

 const animateScroll = (currentTime) => {
 const timeElapsed = currentTime - startTime;
 const progress = Math.min(timeElapsed / duration, 1);

 // Easing function (ease-out)
 const easeOut = 1 - Math.pow(1 - progress, 3);
 const currentPosition = start * (1 - easeOut);

 window.scrollTo(0, currentPosition);

 if (progress < 1) {
 requestAnimationFrame(animateScroll);
 } else {
 this.log('Animated scroll completed');
 }
 };

 requestAnimationFrame(animateScroll);
 };

 if (delay > 0) {
 setTimeout(performAnimatedScroll, delay);
 } else {
 performAnimatedScroll();
 }
 }

 /**
 * Add a scroll listener
 */
 addScrollListener(callback) {
 this.scrollListeners.add(callback);
 }

 /**
 * Remove a scroll listener
 */
 removeScrollListener(callback) {
 this.scrollListeners.delete(callback);
 }

 /**
 * Notify all listeners
 */
 notifyListeners() {
 this.scrollListeners.forEach(callback => {
 try {
 callback();
 } catch (error) {
 this.log('Listener error', { error: error.message });
 }
 });
 }

 /**
 * Initialize global scroll behavior
 */
 initialize() {
 this.log('Initializing global scroll manager');

 // Set up global scroll behavior
 document.documentElement.style.scrollBehavior = 'smooth';

 // Add scroll event listener to detect when scrolling stops
 let scrollTimeout;
 window.addEventListener('scroll', () => {
 clearTimeout(scrollTimeout);
 scrollTimeout = setTimeout(() => {
 this.isScrolling = false;
 }, 150);
 });

 // Override window.scrollTo to use our implementation
 const originalScrollTo = window.scrollTo;
 window.scrollTo = (x, y, options) => {
 this.log('Window.scrollTo intercepted', { x, y, options });
 originalScrollTo.call(window, x, y, options);
 };
 }

 /**
 * Cleanup
 */
 destroy() {
 this.scrollListeners.clear();
 this.log('Global scroll manager destroyed');
 }
}

// Create singleton instance
const globalScrollManager = new GlobalScrollManager();

// Initialize on load
if (typeof window !== 'undefined') {
 globalScrollManager.initialize();
}

export default globalScrollManager;

// Export convenience functions
export const scrollToTop = (options = {}) => globalScrollManager.scrollToTop(options);
export const scrollToTopAnimated = (options = {}) => globalScrollManager.scrollToTopAnimated(options);
export const enableScrollDebug = () => globalScrollManager.enableDebug();
export const disableScrollDebug = () => globalScrollManager.disableDebug();
