/**
 * Asset Loader Utility for CareerQuest
 * Handles loading of optimized assets with WebP fallback
 */

import colors from '../config/colors.json';
import animations from '../config/animations.json';

export class AssetLoader {
  constructor(scene) {
    this.scene = scene;
    this.supportsWebP = this.checkWebPSupport();
    this.assetsLoaded = false;
    this.loadingProgress = 0;
  }

  /**
   * Check if browser supports WebP format
   */
  checkWebPSupport() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  /**
   * Get asset path with WebP fallback
   */
  getAssetPath(basePath) {
    if (this.supportsWebP) {
      return basePath.replace('/images/', '/images/webp/').replace('.png', '.webp');
    }
    return basePath.replace('/images/', '/images/optimized/');
  }

  /**
   * Load all game assets
   */
  loadAssets() {
    console.log('🎮 Loading CareerQuest assets...');
    console.log(`📱 WebP support: ${this.supportsWebP ? 'Yes' : 'No'}`);

    // Set up progress tracking
    this.scene.load.on('progress', (progress) => {
      this.loadingProgress = progress;
      this.updateLoadingProgress(progress);
    });

    this.scene.load.on('complete', () => {
      this.assetsLoaded = true;
      this.onAssetsLoaded();
    });

    // Load texture atlases
    this.loadAtlases();
    
    // Load individual assets that aren't in atlases
    this.loadBackgrounds();
    
    // Load audio assets (if any)
    this.loadAudio();

    // Start loading
    this.scene.load.start();
  }

  /**
   * Load texture atlases
   */
  loadAtlases() {
    const atlases = [
      {
        key: 'ui',
        image: this.getAssetPath('images/atlases/ui-atlas.png'),
        data: 'images/atlases/ui-atlas.json'
      },
      {
        key: 'characters', 
        image: this.getAssetPath('images/atlases/characters-atlas.png'),
        data: 'images/atlases/characters-atlas.json'
      },
      {
        key: 'effects',
        image: this.getAssetPath('images/atlases/effects-atlas.png'), 
        data: 'images/atlases/effects-atlas.json'
      }
    ];

    atlases.forEach(atlas => {
      this.scene.load.atlas(atlas.key, atlas.image, atlas.data);
      console.log(`📦 Loading atlas: ${atlas.key}`);
    });
  }

  /**
   * Load background images
   */
  loadBackgrounds() {
    const backgrounds = [
      {
        key: 'office-background',
        path: this.getAssetPath('images/backgrounds/office-background.png')
      }
    ];

    backgrounds.forEach(bg => {
      this.scene.load.image(bg.key, bg.path);
      console.log(`🖼️  Loading background: ${bg.key}`);
    });
  }

  /**
   * Load audio assets
   */
  loadAudio() {
    // Placeholder for future audio assets
    // this.scene.load.audio('click', 'sounds/click.mp3');
    // this.scene.load.audio('success', 'sounds/success.mp3');
  }

  /**
   * Update loading progress display
   */
  updateLoadingProgress(progress) {
    // This will be called by the PreloadScene
    const percentage = Math.round(progress * 100);
    console.log(`📊 Loading progress: ${percentage}%`);
    
    // Emit custom event for UI updates
    this.scene.events.emit('loadingProgress', percentage);
  }

  /**
   * Called when all assets are loaded
   */
  onAssetsLoaded() {
    console.log('✅ All assets loaded successfully!');
    
    // Create animations from config
    this.createAnimations();
    
    // Emit completion event
    this.scene.events.emit('assetsLoaded');
  }

  /**
   * Create Phaser animations from config
   */
  createAnimations() {
    console.log('🎬 Creating animations...');

    // Character animations
    if (animations.characters?.recruiter) {
      // Recruiter idle animation
      if (animations.characters.recruiter.idle) {
        this.scene.anims.create({
          key: 'recruiter-idle',
          frames: this.scene.anims.generateFrameNames('characters', {
            prefix: 'recruiter-idle-',
            start: 1,
            end: 4,
            zeroPad: 2
          }),
          frameRate: animations.characters.recruiter.idle.frameRate,
          repeat: animations.characters.recruiter.idle.repeat
        });
      }

      // Recruiter speech animation  
      if (animations.characters.recruiter.speech) {
        this.scene.anims.create({
          key: 'recruiter-speech',
          frames: this.scene.anims.generateFrameNames('characters', {
            prefix: 'recruiter-speech-',
            start: 1,
            end: 4,
            zeroPad: 2
          }),
          frameRate: animations.characters.recruiter.speech.frameRate,
          repeat: animations.characters.recruiter.speech.repeat
        });
      }
    }

    console.log('✅ Animations created');
  }

  /**
   * Create UI sprite with proper scaling
   */
  createUISprite(x, y, atlasKey, frameName) {
    const sprite = this.scene.add.sprite(x, y, atlasKey, frameName);
    
    // Apply pixel-perfect rendering
    sprite.setOrigin(0.5);
    
    // Scale for crisp pixels
    const scale = this.scene.sys.game.config.pixelArt ? 1 : 1;
    sprite.setScale(scale);
    
    return sprite;
  }

  /**
   * Create button with hover effects
   */
  createButton(x, y, frameName, callback, context) {
    const button = this.createUISprite(x, y, 'ui', frameName);
    
    // Make interactive
    button.setInteractive({ useHandCursor: true });
    
    // Add hover effects
    button.on('pointerover', () => {
      this.scene.tweens.add({
        targets: button,
        scaleX: animations.ui.buttons.hover.scale,
        scaleY: animations.ui.buttons.hover.scale,
        duration: animations.ui.buttons.hover.duration,
        ease: animations.ui.buttons.hover.ease
      });
    });

    button.on('pointerout', () => {
      this.scene.tweens.add({
        targets: button,
        scaleX: 1,
        scaleY: 1,
        duration: animations.ui.buttons.hover.duration,
        ease: animations.ui.buttons.hover.ease
      });
    });

    button.on('pointerdown', () => {
      this.scene.tweens.add({
        targets: button,
        scaleX: animations.ui.buttons.press.scale,
        scaleY: animations.ui.buttons.press.scale,
        duration: animations.ui.buttons.press.duration,
        ease: animations.ui.buttons.press.ease,
        yoyo: true
      });
    });

    button.on('pointerup', () => {
      if (callback) {
        callback.call(context);
      }
    });

    return button;
  }

  /**
   * Create badge with unlock animation
   */
  createBadge(x, y, badgeType, unlocked = false) {
    const badge = this.createUISprite(x, y, 'ui', `badge-${badgeType}`);
    
    if (!unlocked) {
      badge.setTint(0x666666); // Gray out locked badges
      badge.setAlpha(0.5);
    }
    
    badge.unlockAnimation = () => {
      badge.clearTint();
      badge.setAlpha(1);
      
      // Play unlock animation
      this.scene.tweens.add({
        targets: badge,
        scaleX: animations.ui.badges.unlock.scale,
        scaleY: animations.ui.badges.unlock.scale,
        rotation: animations.ui.badges.unlock.rotation,
        duration: animations.ui.badges.unlock.duration,
        ease: animations.ui.badges.unlock.ease
      });

      // Add shine effect
      this.scene.tweens.add({
        targets: badge,
        alpha: animations.ui.badges.shine.alpha,
        duration: animations.ui.badges.shine.duration,
        ease: animations.ui.badges.shine.ease,
        repeat: 2
      });
    };
    
    return badge;
  }

  /**
   * Create particle effect
   */
  createParticleEffect(x, y, effectType) {
    const config = animations.effects.particles[effectType];
    
    if (!config) {
      console.warn(`Particle effect '${effectType}' not found in config`);
      return null;
    }

    // Create particle manager
    const particles = this.scene.add.particles(x, y, 'effects', {
      frame: `particle-${effectType}`,
      speed: config.speed || { min: 50, max: 100 },
      scale: config.scale || { start: 1, end: 0 },
      lifespan: config.lifespan || 1000,
      quantity: config.quantity || 10
    });

    // Auto-destroy after emission
    this.scene.time.delayedCall(config.lifespan || 1000, () => {
      particles.destroy();
    });

    return particles;
  }

  /**
   * Get color from palette
   */
  getColor(colorPath) {
    const pathParts = colorPath.split('.');
    let color = colors.palette;
    
    for (const part of pathParts) {
      color = color[part];
      if (!color) break;
    }
    
    return color || '#FFFFFF';
  }

  /**
   * Preload a specific asset set
   */
  preloadAssetSet(assetSet) {
    return new Promise((resolve) => {
      let loadedCount = 0;
      const totalAssets = assetSet.length;

      const onAssetLoaded = () => {
        loadedCount++;
        if (loadedCount >= totalAssets) {
          resolve();
        }
      };

      assetSet.forEach(asset => {
        if (asset.type === 'image') {
          this.scene.load.image(asset.key, this.getAssetPath(asset.path));
        } else if (asset.type === 'atlas') {
          this.scene.load.atlas(asset.key, this.getAssetPath(asset.image), asset.data);
        }
        
        this.scene.load.once(`filecomplete-${asset.type}-${asset.key}`, onAssetLoaded);
      });

      this.scene.load.start();
    });
  }

  /**
   * Get asset loading statistics
   */
  getLoadingStats() {
    return {
      progress: this.loadingProgress,
      isComplete: this.assetsLoaded,
      supportsWebP: this.supportsWebP,
      totalAssets: this.scene.load.totalToLoad,
      loadedAssets: this.scene.load.totalComplete
    };
  }
}

export default AssetLoader;
