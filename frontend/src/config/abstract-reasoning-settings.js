/**
 * Abstract Reasoning Test Settings
 * Configuration for handling abstract reasoning test images
 */

export const ABSTRACT_REASONING_SETTINGS = {
  // Base path for abstract reasoning images
  IMAGE_BASE_PATH: '/assets/images/abstract_reasoning/',
  
  // Function to resolve image paths from database
  resolveImagePath: (imagePath) => {
    // The database stores paths like 'images/abstract_reasoning/filename.png'
    // We need to convert this to the correct path in our frontend assets
    if (!imagePath) return '';
    
    // Extract the filename from the path
    const filename = imagePath.split('/').pop();
    
    // Return the full path to the asset in our frontend
    return `${ABSTRACT_REASONING_SETTINGS.IMAGE_BASE_PATH}${filename}`;
  },
  
  // Default fallback image if an image can't be loaded
  FALLBACK_IMAGE: '/assets/images/fallback-pattern.svg',
  
  // Test settings
  TEST_TIME_LIMIT_MINUTES: 30,
  QUESTIONS_PER_TEST: 20,
};
