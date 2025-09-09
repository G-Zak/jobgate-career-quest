import React from 'react';

// Mental Rotation Image Renderer Component
const MentalRotationRenderer = ({ 
  baseImageId, 
  rotation = 0, 
  overlays = [], 
  transforms = {},
  className = "",
  size = 200 
}) => {
  
  // Map base image IDs to their SVG imports
  const getBaseImagePath = (imageId) => {
    return `/src/assets/images/spatial/mental_rotation/base_images/${imageId}.svg`;
  };
  
  // Map overlay IDs to their SVG paths
  const getOverlayPath = (overlayId) => {
    return `/src/assets/images/spatial/mental_rotation/overlays/rotation_arrows/${overlayId}.svg`;
  };
  
  // Apply CSS transforms based on rotation and transforms prop
  const getTransformStyle = () => {
    const mainRotation = transforms.main?.rotation || rotation;
    return {
      transform: `rotate(${mainRotation}deg)`,
      transformOrigin: 'center',
      transition: 'transform 0.3s ease-in-out'
    };
  };
  
  return (
    <div 
      className={`mental-rotation-container ${className}`}
      style={{ 
        width: size, 
        height: size,
        position: 'relative',
        display: 'inline-block'
      }}
    >
      {/* Base Image */}
      <div 
        className="base-image"
        style={getTransformStyle()}
      >
        <img 
          src={getBaseImagePath(baseImageId)}
          alt={`Mental rotation shape: ${baseImageId}`}
          style={{ 
            width: '100%', 
            height: '100%',
            objectFit: 'contain'
          }}
        />
      </div>
      
      {/* Overlay Images */}
      {overlays.map((overlayId, index) => (
        <div
          key={index}
          className="overlay-image"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none'
          }}
        >
          <img 
            src={getOverlayPath(overlayId)}
            alt={`Rotation indicator: ${overlayId}`}
            style={{ 
              width: '100%', 
              height: '100%',
              objectFit: 'contain'
            }}
          />
        </div>
      ))}
    </div>
  );
};

// Mental Rotation Question Component
const MentalRotationQuestion = ({ question }) => {
  const {
    id,
    question_text,
    options,
    base_image_id,
    overlay_ids,
    transforms,
    correct_answer
  } = question;
  
  return (
    <div className="mental-rotation-question">
      <div className="question-header">
        <h3>Question {id}</h3>
        <p className="question-text">{question_text}</p>
      </div>
      
      <div className="question-content">
        {/* Main question image */}
        <div className="question-image">
          <MentalRotationRenderer
            baseImageId={base_image_id}
            overlays={overlay_ids || []}
            transforms={transforms || {}}
            size={300}
            className="question-shape"
          />
        </div>
        
        {/* Answer options */}
        <div className="answer-options">
          {Object.entries(options).map(([letter, description]) => (
            <div 
              key={letter} 
              className={`option ${letter === correct_answer ? 'correct' : ''}`}
            >
              <div className="option-letter">{letter}</div>
              <div className="option-description">{description}</div>
              {/* You could also show visual representations of each option here */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Demo component showing how to use the renderer
const MentalRotationDemo = () => {
  // Sample question data (matches our database structure)
  const sampleQuestion = {
    id: 302,
    question_text: "Which option shows the same L-shaped object rotated 90° clockwise around the vertical axis?",
    options: {
      A: "Long arm points down, short arm points right",
      B: "Long arm points left, short arm points down", 
      C: "Long arm points up, short arm points left",
      D: "Same as original orientation"
    },
    base_image_id: "MR_L_block_01",
    overlay_ids: ["overlay_rotation_90cw"],
    transforms: { main: { rotation: 0 } },
    correct_answer: "A"
  };
  
  return (
    <div className="demo-container">
      <h2>Mental Rotation SVG Demo</h2>
      
      {/* Show different rotations of the same base image */}
      <div className="rotation-demo">
        <h3>L-Block at Different Rotations</h3>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div>
            <MentalRotationRenderer
              baseImageId="MR_L_block_01"
              rotation={0}
              size={150}
            />
            <p>0° (Original)</p>
          </div>
          <div>
            <MentalRotationRenderer
              baseImageId="MR_L_block_01"
              rotation={90}
              size={150}
            />
            <p>90° Clockwise</p>
          </div>
          <div>
            <MentalRotationRenderer
              baseImageId="MR_L_block_01"
              rotation={180}
              size={150}
            />
            <p>180°</p>
          </div>
          <div>
            <MentalRotationRenderer
              baseImageId="MR_L_block_01"
              rotation={270}
              size={150}
            />
            <p>270° Clockwise</p>
          </div>
        </div>
      </div>
      
      {/* Show sample question */}
      <div className="question-demo">
        <MentalRotationQuestion question={sampleQuestion} />
      </div>
    </div>
  );
};

export { MentalRotationRenderer, MentalRotationQuestion, MentalRotationDemo };
export default MentalRotationRenderer;
