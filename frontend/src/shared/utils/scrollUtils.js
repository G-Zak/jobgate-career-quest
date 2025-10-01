import { useEffect } from 'react';

/**
 * Universal scroll-to-top utility for consistent scroll behavior across the application
 */

// Core scroll function with multiple attempts and fallbacks
export const scrollToTop = (options = {}) => {
 const {
 smooth = false,
 attempts = 3,
 delay = 50,
 container = null,
 forceImmediate = false
 } = options;

 const performScroll = (attempt = 0) => {
 setTimeout(() => {
 // Scroll main window
 if (smooth && !forceImmediate) {
 window.scrollTo({ top: 0, behavior: 'smooth' });
 } else {
 window.scrollTo(0, 0);
 }

 // Scroll specific container if provided
 if (container) {
 let targetContainer = null;

 if (typeof container === 'string') {
 targetContainer = document.getElementById(container) || document.querySelector(container);
 } else if (container.current) {
 targetContainer = container.current;
 } else if (container instanceof Element) {
 targetContainer = container;
 }

 if (targetContainer) {
 if (smooth && !forceImmediate) {
 targetContainer.scrollTo({ top: 0, behavior: 'smooth' });
 } else {
 targetContainer.scrollTo(0, 0);
 }
 console.log(`Scrolled container to top: ${container}`);
 } else if (attempt < attempts - 1) {
 // Retry if container not found
 performScroll(attempt + 1);
 return;
 }
 }

 // Scroll common test containers
 const commonContainers = [
 'test-scroll-container',
 'verbal-test-scroll',
 'spatial-test-scroll',
 '.test-scroll-container',
 '.content-scroll',
 '[data-scroll-container]'
 ];

 commonContainers.forEach(selector => {
 const element = selector.startsWith('.') || selector.startsWith('[')
 ? document.querySelector(selector)
 : document.getElementById(selector);

 if (element) {
 if (smooth && !forceImmediate) {
 element.scrollTo({ top: 0, behavior: 'smooth' });
 } else {
 element.scrollTo(0, 0);
 }
 }
 });

 console.log('Universal scroll to top executed', { attempt: attempt + 1, smooth, container });
 }, (attempt + 1) * delay);
 };

 performScroll();
};

// React hook for automatic scroll-to-top on component mount
export const useScrollToTop = (dependencies = [], options = {}) => {
 useEffect(() => {
 scrollToTop(options);
 }, dependencies);
};

// React hook for scroll-to-top on route/section changes
export const useScrollOnChange = (dependency, options = {}) => {
 useEffect(() => {
 if (dependency) {
 scrollToTop(options);
 }
 }, [dependency]);
};

// Enhanced hook for test components with specific containers
export const useTestScrollToTop = (testStep, container = null, options = {}) => {
 useEffect(() => {
 const enhancedOptions = {
 attempts: 5,
 delay: 100,
 container: container,
 forceImmediate: testStep === 'test', // Force immediate for test start
 ...options
 };

 scrollToTop(enhancedOptions);
 }, [testStep]);
};

// Hook for question navigation within tests
export const useQuestionScrollToTop = (currentQuestion, testStep, container = null) => {
 useEffect(() => {
 if (testStep === 'test' && currentQuestion > 1) {
 setTimeout(() => {
 scrollToTop({
 container: container,
 smooth: true,
 attempts: 2,
 delay: 50
 });
 }, 100);
 }
 }, [currentQuestion, testStep]);
};

// Utility to ensure scroll containers have proper scroll behavior
export const applyScrollBehavior = () => {
 // Apply smooth scroll behavior to html element
 document.documentElement.style.scrollBehavior = 'smooth';

 // Find and configure scroll containers
 const scrollContainers = document.querySelectorAll(
 '.test-scroll-container, [data-scroll-container], .content-scroll, #test-content'
 );

 scrollContainers.forEach(container => {
 container.style.scrollBehavior = 'smooth';
 // Ensure containers are scrollable
 if (container.scrollHeight > container.clientHeight) {
 container.style.overflowY = 'auto';
 }
 });
};

// Initialize scroll behavior on app load
export const initializeScrollBehavior = () => {
 applyScrollBehavior();

 // Re-apply when DOM changes
 const observer = new MutationObserver(() => {
 applyScrollBehavior();
 });

 observer.observe(document.body, {
 childList: true,
 subtree: true
 });

 return () => observer.disconnect();
};

export default {
 scrollToTop,
 useScrollToTop,
 useScrollOnChange,
 useTestScrollToTop,
 useQuestionScrollToTop,
 applyScrollBehavior,
 initializeScrollBehavior
};
