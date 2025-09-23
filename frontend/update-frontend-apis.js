#!/usr/bin/env node

/**
 * Frontend API Update Script
 * 
 * This script updates frontend components to use backend APIs only
 */

const fs = require('fs');
const path = require('path');

// Configuration
const FRONTEND_DIR = path.join(__dirname, 'src');
const COMPONENTS_DIR = path.join(FRONTEND_DIR, 'features', 'skills-assessment', 'components');
const BACKUP_DIR = path.join(__dirname, 'backup_before_api_update');

// Components to update
const COMPONENTS_TO_UPDATE = [
  'LogicalReasoningTest.jsx',
  'SpatialReasoningTest.jsx',
  'TechnicalTest.jsx',
  'SituationalJudgmentTest.jsx',
  'AbstractReasoningTest.jsx',
  'DiagrammaticReasoningTest.jsx'
];

// Import replacements
const IMPORT_REPLACEMENTS = [
  {
    pattern: /import\s*{\s*submitTestAttempt[^}]*}\s*from\s*['"]\.\.\/lib\/submitHelper['"];?/g,
    replacement: "import { submitTestAttempt, fetchTestQuestions } from '../lib/backendSubmissionHelper';"
  },
  {
    pattern: /import\s*{\s*calculateScore[^}]*}\s*from\s*['"]\.\.\/lib\/scoreUtils['"];?/g,
    replacement: "// REMOVED: calculateScore - use backend API instead"
  },
  {
    pattern: /import\s*{\s*computePercentage[^}]*}\s*from\s*['"]\.\.\/lib\/scoreUtils['"];?/g,
    replacement: "// REMOVED: computePercentage - use backend API instead"
  },
  {
    pattern: /import\s*{\s*calculateFinalScore[^}]*}\s*from\s*['"]\.\.\/config\/testConfig['"];?/g,
    replacement: "// REMOVED: calculateFinalScore - use backend API instead"
  },
  {
    pattern: /import\s*{\s*getGrade[^}]*}\s*from\s*['"]\.\.\/config\/testConfig['"];?/g,
    replacement: "// REMOVED: getGrade - use backend API instead"
  },
  {
    pattern: /import\s*backendApi[^;]*;?/g,
    replacement: "import backendApi from '../api/backendApi';"
  }
];

// Function replacements
const FUNCTION_REPLACEMENTS = [
  {
    pattern: /const\s+calculateScore\s*=\s*\([^)]*\)\s*=>\s*\{[^}]*\}/gs,
    replacement: '// REMOVED: calculateScore() - use backend API instead'
  },
  {
    pattern: /const\s+calculateCurrentScore\s*=\s*\([^)]*\)\s*=>\s*\{[^}]*\}/gs,
    replacement: '// REMOVED: calculateCurrentScore() - use backend API instead'
  },
  {
    pattern: /const\s+computeScore\s*=\s*\([^)]*\)\s*=>\s*\{[^}]*\}/gs,
    replacement: '// REMOVED: computeScore() - use backend API instead'
  }
];

// Submission pattern replacements
const SUBMISSION_REPLACEMENTS = [
  {
    pattern: /const\s+handleSubmitTest\s*=\s*async\s*\([^)]*\)\s*=>\s*\{[\s\S]*?\};/gs,
    replacement: `const handleSubmitTest = async () => {
    try {
      setSubmitting(true);
      setError(null);

      // Validate answers before submission
      if (Object.keys(answers).length === 0) {
        setError('Please answer at least one question before submitting.');
        return;
      }

      // Submit to backend for scoring
      const result = await submitTestAttempt({
        testId,
        answers,
        startedAt: testStartTime,
        finishedAt: Date.now(),
        reason: 'user',
        metadata: {
          testType: 'test_type_here', // Update per component
          totalQuestions: questions.length,
          currentQuestion: currentQuestion || 1
        },
        onSuccess: (data) => {
          console.log('Test submitted successfully:', data);
          setResults(data.score);
          setTestStep('results');
          scrollToTop();
        },
        onError: (error) => {
          console.error('Test submission failed:', error);
          setError(\`Submission failed: \${error.message}\`);
        }
      });

    } catch (error) {
      console.error('Error submitting test:', error);
      setError('Failed to submit test. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };`
  }
];

class FrontendApiUpdater {
  constructor() {
    this.log = [];
    this.stats = {
      filesProcessed: 0,
      filesModified: 0,
      replacements: 0,
      errors: 0
    };
  }

  logMessage(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    console.log(logEntry);
    this.log.push(logEntry);
  }

  async createBackup() {
    this.logMessage('Creating backup of original files...');
    
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    for (const component of COMPONENTS_TO_UPDATE) {
      const fullPath = path.join(COMPONENTS_DIR, component);
      const backupPath = path.join(BACKUP_DIR, component);
      
      if (fs.existsSync(fullPath)) {
        fs.copyFileSync(fullPath, backupPath);
        this.logMessage(`Backed up: ${component}`);
      }
    }
  }

  async updateComponent(componentName) {
    const fullPath = path.join(COMPONENTS_DIR, componentName);
    
    if (!fs.existsSync(fullPath)) {
      this.logMessage(`File not found: ${componentName}`);
      return false;
    }

    try {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      let replacements = 0;

      // Apply import replacements
      for (const replacement of IMPORT_REPLACEMENTS) {
        const before = content;
        content = content.replace(replacement.pattern, replacement.replacement);
        if (content !== before) {
          modified = true;
          replacements++;
        }
      }

      // Apply function replacements
      for (const replacement of FUNCTION_REPLACEMENTS) {
        const before = content;
        content = content.replace(replacement.pattern, replacement.replacement);
        if (content !== before) {
          modified = true;
          replacements++;
        }
      }

      // Apply submission replacements
      for (const replacement of SUBMISSION_REPLACEMENTS) {
        const before = content;
        const updatedReplacement = replacement.replacement.replace(
          'test_type_here', 
          componentName.replace('Test.jsx', '').toLowerCase().replace(/([A-Z])/g, '_$1').toLowerCase()
        );
        content = content.replace(replacement.pattern, updatedReplacement);
        if (content !== before) {
          modified = true;
          replacements++;
        }
      }

      // Add backend API imports if not present
      if (!content.includes('import backendApi from')) {
        const importMatch = content.match(/import\s+React[^;]+;/);
        if (importMatch) {
          const newImport = importMatch[0] + "\nimport backendApi from '../api/backendApi';";
          content = content.replace(importMatch[0], newImport);
          modified = true;
          replacements++;
        }
      }

      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        this.logMessage(`Updated: ${componentName} (${replacements} replacements)`);
        this.stats.filesModified++;
        this.stats.replacements += replacements;
      } else {
        this.logMessage(`No changes needed: ${componentName}`);
      }

      this.stats.filesProcessed++;
      return true;

    } catch (error) {
      this.logMessage(`Error updating ${componentName}: ${error.message}`);
      this.stats.errors++;
      return false;
    }
  }

  async updateAllComponents() {
    this.logMessage('Starting frontend API updates...');
    
    for (const component of COMPONENTS_TO_UPDATE) {
      await this.updateComponent(component);
    }
  }

  async generateUpdateReport() {
    this.logMessage('Generating update report...');
    
    const report = `
# Frontend API Update Report

## Update Statistics
- Files Processed: ${this.stats.filesProcessed}
- Files Modified: ${this.stats.filesModified}
- Total Replacements: ${this.stats.replacements}
- Errors: ${this.stats.errors}

## Update Log
${this.log.join('\n')}

## Components Updated
${COMPONENTS_TO_UPDATE.map(component => `- ${component}`).join('\n')}

## Changes Made
- Replaced frontend scoring functions with backend API calls
- Updated import statements to use backendSubmissionHelper
- Removed calculateScore, computePercentage, calculateFinalScore, getGrade functions
- Updated handleSubmitTest functions to use backend APIs
- Added backend API imports where needed

## Next Steps
1. Test all updated components
2. Verify backend API connectivity
3. Check for any remaining frontend scoring logic
4. Update component tests to mock backend APIs

## Backup Location
Original files backed up to: ${BACKUP_DIR}

Generated: ${new Date().toISOString()}
`;

    const reportPath = path.join(__dirname, 'frontend_api_update_report.txt');
    fs.writeFileSync(reportPath, report);
    this.logMessage(`Update report saved to: ${reportPath}`);
  }

  async run() {
    try {
      this.logMessage('Starting frontend API updates...');
      
      // Create backup
      await this.createBackup();
      
      // Update components
      await this.updateAllComponents();
      
      // Generate report
      await this.generateUpdateReport();
      
      this.logMessage('Frontend API updates completed!');
      console.log('\n📊 Update Summary:');
      console.log(`✅ Files Processed: ${this.stats.filesProcessed}`);
      console.log(`✅ Files Modified: ${this.stats.filesModified}`);
      console.log(`✅ Total Replacements: ${this.stats.replacements}`);
      console.log(`❌ Errors: ${this.stats.errors}`);
      
      if (this.stats.errors > 0) {
        console.log('\n⚠️  Some errors occurred. Check the update log for details.');
      } else {
        console.log('\n🎉 All components updated successfully!');
      }
      
    } catch (error) {
      this.logMessage(`Update failed: ${error.message}`);
      console.error('Update failed:', error);
      process.exit(1);
    }
  }
}

// Run update if called directly
if (require.main === module) {
  const updater = new FrontendApiUpdater();
  updater.run();
}

module.exports = FrontendApiUpdater;
