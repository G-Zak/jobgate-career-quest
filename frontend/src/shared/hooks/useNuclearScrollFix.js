import { useEffect, useRef } from 'react';

/**
 * Nuclear scroll fix - forces scroll to top on ANY state change
 * This is a last resort solution that will scroll to top whenever ANY dependency changes
 */
export const useNuclearScrollFix = (dependencies = [], options = {}) => {
 const {
 debug = false,
 delay = 0,
 forceImmediate = true
 } = options;

 const previousValues = useRef({});

 useEffect(() => {
 if (debug) {
 console.log('=== NUCLEAR SCROLL FIX TRIGGERED ===');
 console.log('Dependencies:', dependencies);
 console.log('Previous values:', previousValues.current);
 }

 // Force scroll to top immediately
 if (forceImmediate) {
 if (debug) {
 console.log('=== NUCLEAR SCROLL FIX EXECUTING ===');
 }

 // Method 1: Window scroll with smooth behavior
 window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

 // Method 2: Main content area scroll (most important) with smooth behavior
 const mainContent = document.querySelector('.main-content-area');
 if (mainContent) {
 if (debug) {
 console.log('Scrolling main content area to top');
 console.log('Current scroll position:', mainContent.scrollTop);
 }
 mainContent.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

 // Also try immediate scroll as backup
 setTimeout(() => {
 mainContent.scrollTop = 0;
 }, 100);
 }

 // Method 3: All scrollable containers
 const scrollableElements = document.querySelectorAll(
 '[data-scroll-container], .test-scroll-container, .content-scroll, #test-content, main, .min-h-screen, .overflow-y-auto'
 );

 scrollableElements.forEach(element => {
 if (element && element.scrollTo) {
 element.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
 }
 });

 // Method 4: Force scroll on all divs
 const allDivs = document.querySelectorAll('div');
 allDivs.forEach(div => {
 if (div.scrollTop !== undefined) {
 div.scrollTop = 0;
 }
 });
 }

 // Store current values for next comparison
 dependencies.forEach((value, index) => {
 previousValues.current[index] = value;
 });

 if (debug) {
 console.log('Scroll position after fix:', window.pageYOffset);
 console.log('Document height:', document.documentElement.scrollHeight);
 console.log('Window height:', window.innerHeight);
 }
 }, dependencies);

 return () => {
 // Force scroll to top function
 window.scrollTo(0, 0);
 document.documentElement.scrollTop = 0;
 document.body.scrollTop = 0;
 };
};

/**
 * Hook that scrolls to top on every render
 */
export const useScrollOnEveryRender = (options = {}) => {
 const { debug = false } = options;

 useEffect(() => {
 if (debug) {
 console.log('=== SCROLL ON EVERY RENDER ===');
 }

 window.scrollTo(0, 0);
 document.documentElement.scrollTop = 0;
 document.body.scrollTop = 0;
 });
};

export default {
 useNuclearScrollFix,
 useScrollOnEveryRender
};
