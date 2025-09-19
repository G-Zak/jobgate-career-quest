import { useEffect, useRef } from 'react';

/**
 * Global scroll-to-top hook that works with state-based navigation
 * This hook will automatically scroll to top whenever the component mounts
 * or when specific dependencies change
 */
export const useGlobalScrollToTop = (dependencies = [], options = {}) => {
  const {
    smooth = true,
    delay = 0,
    forceImmediate = false,
    debug = false
  } = options;

  const scrollToTop = () => {
    if (debug) {
      console.log('Global scroll to top triggered', { dependencies, smooth, delay });
    }

    const performScroll = () => {
      // Force immediate scroll first
      window.scrollTo(0, 0);
      
      // Then apply smooth scroll if requested
      if (smooth && !forceImmediate) {
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 50);
      }
    };

    if (delay > 0) {
      setTimeout(performScroll, delay);
    } else {
      performScroll();
    }
  };

  // Scroll on mount
  useEffect(() => {
    scrollToTop();
  }, []);

  // Scroll when dependencies change
  useEffect(() => {
    if (dependencies.length > 0) {
      scrollToTop();
    }
  }, dependencies);

  return scrollToTop;
};

/**
 * Hook for test components that need scroll on question changes
 */
export const useTestScrollToTop = (currentQuestion, testStep, options = {}) => {
  const {
    smooth = true,
    delay = 100,
    debug = false
  } = options;

  useEffect(() => {
    if (testStep === 'test' && currentQuestion !== undefined) {
      if (debug) {
        console.log('Test scroll triggered', { currentQuestion, testStep });
      }
      
      setTimeout(() => {
        // Force immediate scroll
        window.scrollTo(0, 0);
        
        // Then smooth scroll
        if (smooth) {
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 50);
        }
      }, delay);
    }
  }, [currentQuestion, testStep, smooth, delay, debug]);
};

/**
 * Global scroll manager that can be used anywhere
 */
export const globalScrollToTop = (options = {}) => {
  const {
    smooth = true,
    delay = 0,
    forceImmediate = false,
    debug = false
  } = options;

  if (debug) {
    console.log('Global scroll to top called', options);
  }

  const performScroll = () => {
    // Force immediate scroll first
    window.scrollTo(0, 0);
    
    // Then apply smooth scroll if requested
    if (smooth && !forceImmediate) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    }
  };

  if (delay > 0) {
    setTimeout(performScroll, delay);
  } else {
    performScroll();
  }
};

export default {
  useGlobalScrollToTop,
  useTestScrollToTop,
  globalScrollToTop
};
