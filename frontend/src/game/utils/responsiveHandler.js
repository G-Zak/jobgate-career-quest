import { GAME_CONFIG } from '@game/config/gameConfig';

/**
 * Responsive game handler for different screen sizes
 */
export class ResponsiveGameHandler {
  constructor(game) {
    this.game = game;
    this.setupResizeHandler();
  }

  setupResizeHandler() {
    // Listen for window resize
    window.addEventListener('resize', () => {
      this.handleResize();
    });

    // Listen for orientation change (mobile)
    window.addEventListener('orientationchange', () => {
      // Small delay to allow orientation change to complete
      setTimeout(() => {
        this.handleResize();
      }, 100);
    });
  }

  handleResize() {
    if (!this.game) return;

    // Get new dimensions
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Update game scale
    this.game.scale.resize(width, height);

    // Notify all active scenes
    this.game.scene.scenes.forEach(scene => {
      if (scene.scene.isActive() && scene.resize) {
        scene.resize();
      }
    });

    console.log(`🔄 Game resized to: ${width}x${height}`);
  }

  /**
   * Get optimal scale for current device
   */
  getOptimalScale() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Calculate scale based on reference size
    const scaleX = width / GAME_CONFIG.CANVAS_WIDTH;
    const scaleY = height / GAME_CONFIG.CANVAS_HEIGHT;
    
    // Use minimum scale to ensure everything fits
    return Math.min(scaleX, scaleY, 1); // Don't scale up beyond 1
  }

  /**
   * Check if device is mobile
   */
  isMobileDevice() {
    return window.innerWidth < GAME_CONFIG.BREAKPOINTS.MOBILE;
  }

  /**
   * Check if device is tablet
   */
  isTabletDevice() {
    const width = window.innerWidth;
    return width >= GAME_CONFIG.BREAKPOINTS.MOBILE && width < GAME_CONFIG.BREAKPOINTS.TABLET;
  }

  /**
   * Get device type
   */
  getDeviceType() {
    const width = window.innerWidth;
    
    if (width < GAME_CONFIG.BREAKPOINTS.MOBILE) {
      return 'mobile';
    } else if (width < GAME_CONFIG.BREAKPOINTS.TABLET) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }
}

/**
 * Utility functions for responsive design
 */
export const ResponsiveUtils = {
  /**
   * Get responsive font size
   */
  getFontSize(baseSize, deviceType) {
    const scales = {
      mobile: 0.8,
      tablet: 0.9,
      desktop: 1.0
    };
    
    return Math.round(baseSize * (scales[deviceType] || 1));
  },

  /**
   * Get responsive button size
   */
  getButtonSize(baseWidth, baseHeight, deviceType) {
    const scales = {
      mobile: 0.8,
      tablet: 0.9,
      desktop: 1.0
    };
    
    const scale = scales[deviceType] || 1;
    return {
      width: Math.round(baseWidth * scale),
      height: Math.round(baseHeight * scale)
    };
  },

  /**
   * Get responsive spacing
   */
  getSpacing(baseSpacing, deviceType) {
    const scales = {
      mobile: 0.7,
      tablet: 0.85,
      desktop: 1.0
    };
    
    return Math.round(baseSpacing * (scales[deviceType] || 1));
  },

  /**
   * Calculate position for responsive layout
   */
  getResponsivePosition(x, y, sceneWidth, sceneHeight, anchorType = 'center') {
    switch (anchorType) {
      case 'center':
        return {
          x: sceneWidth / 2,
          y: sceneHeight / 2
        };
      
      case 'top-left':
        return { x: 50, y: 50 };
      
      case 'top-right':
        return { x: sceneWidth - 50, y: 50 };
      
      case 'bottom-left':
        return { x: 50, y: sceneHeight - 50 };
      
      case 'bottom-right':
        return { x: sceneWidth - 50, y: sceneHeight - 50 };
      
      case 'top-center':
        return { x: sceneWidth / 2, y: 50 };
      
      case 'bottom-center':
        return { x: sceneWidth / 2, y: sceneHeight - 50 };
      
      default:
        return { x, y };
    }
  }
};

export default ResponsiveGameHandler;
