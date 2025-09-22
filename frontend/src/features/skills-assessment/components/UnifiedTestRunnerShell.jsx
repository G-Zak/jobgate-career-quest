import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';

// Import test components
import VerbalReasoningTest from './VerbalReasoningTest';
import NumericalReasoningTest from './NumericalReasoningTest';
import SpatialReasoningTest from './SpatialReasoningTest';
import DiagrammaticReasoningTest from './DiagrammaticReasoningTest';
import AbstractReasoningTest from './AbstractReasoningTest';
import LogicalReasoningTest from './LogicalReasoningTest';
import LRT2Test from './LRT2Test';
import LRT3Test from './LRT3Test';
import SituationalJudgmentTest from './SituationalJudgmentTest';

const UnifiedTestRunnerShell = ({
  testId,
  testInfo,
  onTestComplete,
  onAbortTest
}) => {
  // Determine which test component to render based on testId
  const renderTestComponent = () => {
    const commonProps = {
      testId,
      onComplete: onTestComplete,
      onBack: onAbortTest,
      onBackToDashboard: onAbortTest
    };

    // Handle Situational Judgment Tests (including Master SJT)
    if (testId === 'SJT' || testId === 'MASTER-SJT' || testId === 'Master SJT' || testId.toLowerCase().includes('situational') || testId.toLowerCase().includes('sjt') || testId.toLowerCase().includes('master-sjt')) {
      return <SituationalJudgmentTest {...commonProps} />;
    }

    // Handle Verbal Reasoning Tests
    if (testId.startsWith('VRT') || testId.toLowerCase().includes('verbal') || testId === 'VERBAL_COMPREHENSIVE') {
      const language = testId.toString().includes('_FRENCH') || testId.toString().includes('french') ? 'french' : 'english';
      return <VerbalReasoningTest {...commonProps} language={language} />;
    }

    // Handle Numerical Reasoning Tests
    if (testId.startsWith('NRT') || testId.toLowerCase().includes('numerical')) {
      return <NumericalReasoningTest {...commonProps} />;
    }

    // Handle Spatial Reasoning Tests
    if (testId.startsWith('SRT') || testId.toLowerCase().includes('spatial')) {
      return <SpatialReasoningTest {...commonProps} />;
    }

    // Handle Diagrammatic Reasoning Tests
    if (testId.startsWith('DRT') || testId.toLowerCase().includes('diagrammatic')) {
      return <DiagrammaticReasoningTest {...commonProps} />;
    }

    // Handle Abstract Reasoning Tests
    if (testId.startsWith('ART') || testId.toLowerCase().includes('abstract')) {
      return <AbstractReasoningTest {...commonProps} />;
    }

    // Handle Logical Reasoning Tests
    if (testId.startsWith('LRT3')) {
      return <LRT3Test {...commonProps} />;
    }
    
    if (testId.startsWith('LRT2')) {
      return <LRT2Test {...commonProps} />;
    }
    
    if (testId.startsWith('LRT') || testId.toLowerCase().includes('logical')) {
      return <LogicalReasoningTest {...commonProps} />;
    }

    // Fallback - return a placeholder
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Test Loading...</h2>
        <p className="text-gray-600 mb-6">Preparing your assessment: {testInfo?.title || testId}</p>
        <button
          onClick={onAbortTest}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with consistent branding */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onAbortTest}
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Back to Assessment Dashboard
            </button>
            
            <div className="text-center">
              <h1 className="text-lg font-semibold text-gray-800">
                {testInfo?.title || testId}
              </h1>
              <p className="text-sm text-gray-500">
                {testInfo?.description || 'Skills Assessment'}
              </p>
            </div>

            <div className="w-32" /> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Test Content */}
      <div className="flex-1">
        {renderTestComponent()}
      </div>
    </div>
  );
};

export default UnifiedTestRunnerShell;
