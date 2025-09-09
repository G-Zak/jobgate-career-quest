import React from 'react';
import PropTypes from 'prop-types';

const SpatialImageRenderer = ({ 
  baseImageId, 
  overlayIds = [], 
  transforms = {}, 
  visualStyle = 'technical_3d',
  className = "",
  alt = "Spatial reasoning element"
}) => {
  // Generate CSS transform string from transforms object
  const getTransformStyle = () => {
    const { rotation = 0, scale = 1, scaleX = 1, scaleY = 1, flipX = false, flipY = false } = transforms;
    
    let transform = [];
    
    if (rotation !== 0) transform.push(`rotate(${rotation}deg)`);
    if (scale !== 1) transform.push(`scale(${scale})`);
    if (scaleX !== 1) transform.push(`scaleX(${scaleX})`);
    if (scaleY !== 1) transform.push(`scaleY(${scaleY})`);
    if (flipX) transform.push('scaleX(-1)');
    if (flipY) transform.push('scaleY(-1)');
    
    return transform.length ? { transform: transform.join(' ') } : {};
  };

  // Get base image path
  const getBaseImagePath = () => {
    if (!baseImageId) return null;
    
    // Handle rotation variants (e.g., "MR_L_block_01_90cw")
    let actualImageId = baseImageId;
    if (transforms.rotation === 90) {
      actualImageId = `${baseImageId}_90cw`;
    } else if (transforms.rotation === 180) {
      actualImageId = `${baseImageId}_180`;
    } else if (transforms.rotation === 270 || transforms.rotation === -90) {
      actualImageId = `${baseImageId}_90ccw`;
    }
    
    // Extract category from base_image_id (e.g., "MR_L_block_01" -> "mental_rotation")
    const categoryMap = {
      'MR': 'mental_rotation',
      'PF': 'paper_folding', 
      'CS': 'cross_sections',
      'ST': 'spatial_transformation',
      'PC': 'perspective_changes'
    };
    
    const prefix = actualImageId.split('_')[0];
    const category = categoryMap[prefix] || 'mental_rotation';
    
    return `/src/assets/images/spatial/${category}/base_images/${actualImageId}.svg`;
  };

  // Get overlay paths
  const getOverlayPaths = () => {
    return overlayIds.map(overlayId => {
      // Determine overlay category from ID and convert naming convention
      const overlayCategories = {
        'rotation_arrow': 'rotation_arrows',
        'fold_lines': 'fold_lines', 
        'cutting_plane': 'cut_planes',
        'viewpoint_indicator': 'perspective_indicators'
      };
      
      const category = Object.keys(overlayCategories).find(key => 
        overlayId.includes(key)
      ) || 'rotation_arrows';
      
      // Convert database naming to file naming
      // rotation_arrow_90cw -> overlay_rotation_90cw
      let fileName = overlayId;
      if (overlayId.startsWith('rotation_arrow_')) {
        fileName = overlayId.replace('rotation_arrow_', 'overlay_rotation_');
      }
      
      return {
        id: overlayId,
        path: `/src/assets/images/spatial/mental_rotation/overlays/${overlayCategories[category]}/${fileName}.svg`
      };
    });
  };

  const baseImagePath = getBaseImagePath();
  const overlayPaths = getOverlayPaths();

  if (!baseImagePath) {
    return (
      <div className={`spatial-placeholder bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-sm">Visual content loading...</span>
      </div>
    );
  }

  return (
    <div className={`spatial-image-container relative ${className}`}>
      {/* Base Image */}
      <div 
        className="base-image w-full h-full flex items-center justify-center"
        style={getTransformStyle()}
      >
        <img 
          src={baseImagePath}
          alt={alt}
          className="max-w-full max-h-full object-contain"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = '<div class="fallback-content bg-blue-50 border border-blue-200 rounded p-4 text-center text-blue-700 text-sm">Image: ' + baseImageId + '</div>';
          }}
        />
      </div>
      
      {/* Overlay Images */}
      {overlayPaths.map((overlay, index) => (
        <div 
          key={overlay.id} 
          className="overlay absolute inset-0 pointer-events-none"
          style={{ zIndex: 10 + index }}
        >
          <img 
            src={overlay.path}
            alt=""
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      ))}
      
      {/* Visual Style Indicator */}
      {visualStyle && (
        <div className="absolute top-1 right-1 px-2 py-1 bg-black bg-opacity-20 text-white text-xs rounded">
          {visualStyle.replace('_', ' ')}
        </div>
      )}
    </div>
  );
};

SpatialImageRenderer.propTypes = {
  baseImageId: PropTypes.string,
  overlayIds: PropTypes.arrayOf(PropTypes.string),
  transforms: PropTypes.object,
  visualStyle: PropTypes.string,
  className: PropTypes.string,
  alt: PropTypes.string
};

export default SpatialImageRenderer;
