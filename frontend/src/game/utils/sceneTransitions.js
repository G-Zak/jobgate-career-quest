import { SCENE_KEYS } from '@game/config/gameConfig';

/**
 * Scene transition utilities for smooth navigation between scenes
 */
export class SceneTransitions {
  /**
   * Fade transition between scenes
   */
  static fadeTransition(fromScene, toSceneKey, data = {}, duration = 500) {
    return new Promise((resolve) => {
      // Create fade overlay
      const fadeRect = fromScene.add.rectangle(
        fromScene.scale.width / 2,
        fromScene.scale.height / 2,
        fromScene.scale.width,
        fromScene.scale.height,
        0x000000,
        0
      );
      fadeRect.setDepth(9999);

      // Fade out current scene
      fromScene.tweens.add({
        targets: fadeRect,
        alpha: 1,
        duration: duration / 2,
        onComplete: () => {
          // Start new scene
          fromScene.scene.start(toSceneKey, data);
          resolve();
        }
      });
    });
  }

  /**
   * Slide transition between scenes
   */
  static slideTransition(fromScene, toSceneKey, data = {}, direction = 'left', duration = 800) {
    return new Promise((resolve) => {
      const width = fromScene.scale.width;
      const height = fromScene.scale.height;
      
      // Create sliding overlay
      const slideRect = fromScene.add.rectangle(
        direction === 'left' ? -width/2 : width + width/2,
        height / 2,
        width,
        height,
        0x1a252f
      );
      slideRect.setDepth(9999);

      // Slide in
      fromScene.tweens.add({
        targets: slideRect,
        x: width / 2,
        duration: duration / 2,
        ease: 'Power2.easeInOut',
        onComplete: () => {
          // Start new scene
          fromScene.scene.start(toSceneKey, data);
          resolve();
        }
      });
    });
  }

  /**
   * Scale transition (zoom effect)
   */
  static scaleTransition(fromScene, toSceneKey, data = {}, duration = 600) {
    return new Promise((resolve) => {
      // Scale down current scene
      fromScene.tweens.add({
        targets: fromScene.children.list,
        scaleX: 0,
        scaleY: 0,
        alpha: 0,
        duration: duration / 2,
        ease: 'Power2.easeIn',
        onComplete: () => {
          fromScene.scene.start(toSceneKey, data);
          resolve();
        }
      });
    });
  }
}

/**
 * Scene flow manager for handling navigation logic
 */
export class SceneFlow {
  /**
   * Get the next scene in the typical flow
   */
  static getNextScene(currentSceneKey, context = {}) {
    switch (currentSceneKey) {
      case SCENE_KEYS.PRELOAD:
        return SCENE_KEYS.MAIN;
      
      case SCENE_KEYS.MAIN:
        return SCENE_KEYS.RECRUITER;
      
      case SCENE_KEYS.RECRUITER:
        // Quiz should be handled by React, but fallback to quiz scene
        return SCENE_KEYS.QUIZ;
      
      case SCENE_KEYS.QUIZ:
        return SCENE_KEYS.MAIN;
      
      default:
        return SCENE_KEYS.MAIN;
    }
  }

  /**
   * Get the previous scene in the flow
   */
  static getPreviousScene(currentSceneKey) {
    switch (currentSceneKey) {
      case SCENE_KEYS.MAIN:
        return SCENE_KEYS.PRELOAD;
      
      case SCENE_KEYS.RECRUITER:
        return SCENE_KEYS.MAIN;
      
      case SCENE_KEYS.QUIZ:
        return SCENE_KEYS.RECRUITER;
      
      default:
        return SCENE_KEYS.MAIN;
    }
  }

  /**
   * Navigate to scene with appropriate transition
   */
  static navigateToScene(fromScene, toSceneKey, data = {}, transitionType = 'fade') {
    console.log(`🎬 Transitioning from ${fromScene.scene.key} to ${toSceneKey}`);
    
    switch (transitionType) {
      case 'slide':
        return SceneTransitions.slideTransition(fromScene, toSceneKey, data);
      
      case 'scale':
        return SceneTransitions.scaleTransition(fromScene, toSceneKey, data);
      
      case 'fade':
      default:
        return SceneTransitions.fadeTransition(fromScene, toSceneKey, data);
    }
  }
}

/**
 * Scene data manager for passing data between scenes
 */
export class SceneDataManager {
  /**
   * Prepare data for scene transition
   */
  static prepareSceneData(fromScene, additionalData = {}) {
    return {
      selectedSkill: fromScene.selectedSkill,
      previousScene: fromScene.scene.key,
      timestamp: Date.now(),
      ...additionalData
    };
  }

  /**
   * Validate scene data
   */
  static validateSceneData(data) {
    return {
      selectedSkill: data.selectedSkill || 'react',
      previousScene: data.previousScene || SCENE_KEYS.MAIN,
      timestamp: data.timestamp || Date.now(),
      ...data
    };
  }
}

export default {
  SceneTransitions,
  SceneFlow,
  SceneDataManager
};
