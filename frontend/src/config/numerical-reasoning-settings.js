/**
 * Numerical Reasoning Test Settings
 * Configuration for handling numerical reasoning test images and content
 */

export const NUMERICAL_REASONING_SETTINGS = {
  // Base path for numerical reasoning images
  IMAGE_BASE_PATH: '/assets/images/numerical_reasoning/',
  
  // Function to resolve image paths from database
  resolveImagePath: (imagePath) => {
    // The database stores paths like 'images/numerical_reasoning/filename.png'
    // We need to convert this to the correct path in our frontend assets
    if (!imagePath) return '';
    
    // Extract the filename from the path
    const filename = imagePath.split('/').pop();
    
    // Return the full path to the asset in our frontend
    return `${NUMERICAL_REASONING_SETTINGS.IMAGE_BASE_PATH}${filename}`;
  },
  
  // Default fallback image if an image can't be loaded
  FALLBACK_IMAGE: '/assets/images/fallback-graph.svg',
  
  // Test settings
  TEST_TIME_LIMIT_MINUTES: 45,
  QUESTIONS_PER_TEST: 25,
  
  // Format for displaying numbers
  formatNumber: (value) => {
    // Format numbers with thousands separator and 2 decimal places when needed
    if (typeof value !== 'number') return value;
    
    // Check if it's a whole number
    if (Number.isInteger(value)) {
      return value.toLocaleString();
    }
    
    // For decimal numbers, limit to 2 decimal places
    return value.toLocaleString(undefined, { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  }
};
