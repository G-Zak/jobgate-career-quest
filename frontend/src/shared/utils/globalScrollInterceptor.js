/**
 * Global Scroll Interceptor
 * This will intercept ALL scroll events and force scroll to top when needed
 */

class GlobalScrollInterceptor {
 constructor() {
 this.isEnabled = true;
 this.debug = false;
 this.lastScrollTime = 0;
 this.scrollTimeout = null;
 this.forceScrollElements = new Set();
 this.init();
 }

 init() {
 if (typeof window === 'undefined') return;

 // Override window.scrollTo globally
 this.originalScrollTo = window.scrollTo;
 window.scrollTo = (...args) => {
 this.log('Window.scrollTo intercepted', args);
 this.originalScrollTo.apply(window, args);
 this.forceScrollToTop();
 };

 // Override Element.prototype.scrollTo
 if (Element.prototype.scrollTo) {
 this.originalElementScrollTo = Element.prototype.scrollTo;
 const self = this;
 Element.prototype.scrollTo = function(...args) {
 self.log('Element.scrollTo intercepted', args);
 self.originalElementScrollTo.apply(this, args);
 self.forceScrollToTop();
 };
 }

 // Add scroll event listener
 window.addEventListener('scroll', this.handleScroll.bind(this), { passive: false });

 // Add mutation observer to detect DOM changes
 this.observer = new MutationObserver(this.handleMutation.bind(this));
 this.observer.observe(document.body, {
 childList: true,
 subtree: true,
 attributes: true,
 attributeFilter: ['class', 'style']
 });

 this.log('Global scroll interceptor initialized');
 }

 handleScroll(event) {
 if (!this.isEnabled) return;

 this.lastScrollTime = Date.now();

 // Clear existing timeout
 if (this.scrollTimeout) {
 clearTimeout(this.scrollTimeout);
 }

 // Set new timeout to force scroll after scrolling stops
 this.scrollTimeout = setTimeout(() => {
 this.forceScrollToTop();
 }, 100);
 }

 handleMutation(mutations) {
 if (!this.isEnabled) return;

 mutations.forEach(mutation => {
 // Check if any test-related elements were added
 if (mutation.type === 'childList') {
 const addedNodes = Array.from(mutation.addedNodes);
 const hasTestElements = addedNodes.some(node =>
 node.nodeType === 1 && (
 node.classList?.contains('min-h-screen') ||
 node.id?.includes('test') ||
 node.className?.includes('test')
 )
 );

 if (hasTestElements) {
 this.log('Test elements detected, forcing scroll to top');
 setTimeout(() => this.forceScrollToTop(), 50);
 }
 }
 });
 }

 forceScrollToTop() {
 if (!this.isEnabled) return;

 this.log('Forcing scroll to top');

 // Method 1: Window scroll
 this.originalScrollTo.call(window, 0, 0);

 // Method 2: Document scroll
 document.documentElement.scrollTop = 0;
 document.body.scrollTop = 0;

 // Method 3: Scroll all possible containers
 const containers = document.querySelectorAll(
 '.min-h-screen, [data-test-container], .test-container, #test-content, main, .main-content'
 );

 containers.forEach(container => {
 if (container.scrollTo) {
 container.scrollTo(0, 0);
 }
 if (container.scrollTop !== undefined) {
 container.scrollTop = 0;
 }
 });

 // Method 4: Force scroll on all elements
 const allElements = document.querySelectorAll('*');
 allElements.forEach(el => {
 if (el.scrollTo && el.scrollTop !== undefined) {
 el.scrollTop = 0;
 }
 });
 }

 enable() {
 this.isEnabled = true;
 this.log('Scroll interceptor enabled');
 }

 disable() {
 this.isEnabled = false;
 this.log('Scroll interceptor disabled');
 }

 enableDebug() {
 this.debug = true;
 }

 disableDebug() {
 this.debug = false;
 }

 log(message, data = {}) {
 if (this.debug) {
 console.log(`[GlobalScrollInterceptor] ${message}`, data);
 }
 }

 destroy() {
 if (this.observer) {
 this.observer.disconnect();
 }
 if (this.scrollTimeout) {
 clearTimeout(this.scrollTimeout);
 }
 window.removeEventListener('scroll', this.handleScroll.bind(this));

 // Restore original methods
 if (this.originalScrollTo) {
 window.scrollTo = this.originalScrollTo;
 }
 if (this.originalElementScrollTo) {
 Element.prototype.scrollTo = this.originalElementScrollTo;
 }

 this.log('Global scroll interceptor destroyed');
 }
}

// Create singleton instance
const globalScrollInterceptor = new GlobalScrollInterceptor();

// Export for use in components
export default globalScrollInterceptor;

// Export convenience functions
export const enableGlobalScrollInterceptor = () => globalScrollInterceptor.enable();
export const disableGlobalScrollInterceptor = () => globalScrollInterceptor.disable();
export const enableScrollDebug = () => globalScrollInterceptor.enableDebug();
export const disableScrollDebug = () => globalScrollInterceptor.disableDebug();
