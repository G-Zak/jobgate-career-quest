#!/usr/bin/env node

/**
 * Frontend Scoring Migration Script
 * 
 * This script helps migrate frontend components from frontend scoring
 * to backend-only scoring architecture.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const FRONTEND_DIR = path.join(__dirname, 'src');
const BACKUP_DIR = path.join(__dirname, 'backup_before_migration');
const MIGRATION_LOG = path.join(__dirname, 'migration_log.txt');

// Files to migrate
const FILES_TO_MIGRATE = [
  'features/skills-assessment/lib/scoreUtils.js',
  'features/skills-assessment/lib/submitHelper.js',
  'features/skills-assessment/config/testConfig.js',
  'features/skills-assessment/components/VerbalReasoningTest.jsx',
  'features/skills-assessment/components/NumericalReasoningTest.jsx',
  'features/skills-assessment/components/LogicalReasoningTest.jsx',
  'features/skills-assessment/components/SpatialReasoningTest.jsx',
  'features/skills-assessment/components/TechnicalTest.jsx',
  'features/skills-assessment/components/SituationalJudgmentTest.jsx',
  'features/skills-assessment/services/randomizedTestService.js',
  'features/skills-assessment/utils/masterSJTGenerator.js'
];

// Patterns to replace
const REPLACEMENTS = [
  // Import statements
  {
    pattern: /import\s*{\s*calculateScore[^}]*}\s*from\s*['"]\.\.\/lib\/scoreUtils['"];?/g,
    replacement: '// REMOVED: calculateScore - use backend API instead'
  },
  {
    pattern: /import\s*{\s*computePercentage[^}]*}\s*from\s*['"]\.\.\/lib\/scoreUtils['"];?/g,
    replacement: '// REMOVED: computePercentage - use backend API instead'
  },
  {
    pattern: /import\s*{\s*submitTestAttempt[^}]*}\s*from\s*['"]\.\.\/lib\/submitHelper['"];?/g,
    replacement: "import { submitTestAttempt } from '../lib/backendSubmissionHelper';"
  },
  {
    pattern: /import\s*{\s*calculateFinalScore[^}]*}\s*from\s*['"]\.\.\/config\/testConfig['"];?/g,
    replacement: '// REMOVED: calculateFinalScore - use backend API instead'
  },
  {
    pattern: /import\s*{\s*getGrade[^}]*}\s*from\s*['"]\.\.\/config\/testConfig['"];?/g,
    replacement: '// REMOVED: getGrade - use backend API instead'
  },

  // Function calls
  {
    pattern: /calculateScore\([^)]*\)/g,
    replacement: '// REMOVED: calculateScore() - use backend API'
  },
  {
    pattern: /computePercentage\([^)]*\)/g,
    replacement: '// REMOVED: computePercentage() - use backend API'
  },
  {
    pattern: /calculateFinalScore\([^)]*\)/g,
    replacement: '// REMOVED: calculateFinalScore() - use backend API'
  },
  {
    pattern: /getGrade\([^)]*\)/g,
    replacement: '// REMOVED: getGrade() - use backend API'
  },

  // Add backend API imports
  {
    pattern: /import\s+React[^;]+;/,
    replacement: (match) => {
      return match + "\nimport backendApi from '../api/backendApi';\nimport { submitTestAttempt, fetchTestQuestions } from '../lib/backendSubmissionHelper';";
    }
  }
];

// Functions to remove
const FUNCTIONS_TO_REMOVE = [
  'calculateScore',
  'computePercentage', 
  'calculateFinalScore',
  'getGrade',
  'buildAttempt',
  'buildAttemptPayload'
];

class MigrationScript {
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

    for (const filePath of FILES_TO_MIGRATE) {
      const fullPath = path.join(FRONTEND_DIR, filePath);
      const backupPath = path.join(BACKUP_DIR, filePath);
      
      if (fs.existsSync(fullPath)) {
        const backupDir = path.dirname(backupPath);
        if (!fs.existsSync(backupDir)) {
          fs.mkdirSync(backupDir, { recursive: true });
        }
        fs.copyFileSync(fullPath, backupPath);
        this.logMessage(`Backed up: ${filePath}`);
      }
    }
  }

  async migrateFile(filePath) {
    const fullPath = path.join(FRONTEND_DIR, filePath);
    
    if (!fs.existsSync(fullPath)) {
      this.logMessage(`File not found: ${filePath}`);
      return false;
    }

    try {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      let replacements = 0;

      // Apply replacements
      for (const replacement of REPLACEMENTS) {
        const before = content;
        content = content.replace(replacement.pattern, replacement.replacement);
        if (content !== before) {
          modified = true;
          replacements++;
        }
      }

      // Remove deprecated functions
      for (const funcName of FUNCTIONS_TO_REMOVE) {
        const functionPattern = new RegExp(
          `(export\\s+)?function\\s+${funcName}\\s*\\([^)]*\\)\\s*\\{[^}]*\\}`,
          'gs'
        );
        const before = content;
        content = content.replace(functionPattern, `// REMOVED: ${funcName}() - use backend API instead`);
        if (content !== before) {
          modified = true;
          replacements++;
        }
      }

      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        this.logMessage(`Migrated: ${filePath} (${replacements} replacements)`);
        this.stats.filesModified++;
        this.stats.replacements += replacements;
      } else {
        this.logMessage(`No changes needed: ${filePath}`);
      }

      this.stats.filesProcessed++;
      return true;

    } catch (error) {
      this.logMessage(`Error migrating ${filePath}: ${error.message}`);
      this.stats.errors++;
      return false;
    }
  }

  async migrateAllFiles() {
    this.logMessage('Starting migration of frontend scoring logic...');
    
    for (const filePath of FILES_TO_MIGRATE) {
      await this.migrateFile(filePath);
    }
  }

  async generateMigrationReport() {
    this.logMessage('Generating migration report...');
    
    const report = `
# Frontend Scoring Migration Report

## Migration Statistics
- Files Processed: ${this.stats.filesProcessed}
- Files Modified: ${this.stats.filesModified}
- Total Replacements: ${this.stats.replacements}
- Errors: ${this.stats.errors}

## Migration Log
${this.log.join('\n')}

## Next Steps
1. Review modified files for any remaining frontend scoring logic
2. Test all components to ensure they use backend APIs
3. Remove any remaining deprecated functions
4. Update component tests to mock backend APIs
5. Verify that correct answers are not exposed in frontend

## Files Modified
${FILES_TO_MIGRATE.filter(file => {
  const fullPath = path.join(FRONTEND_DIR, file);
  return fs.existsSync(fullPath);
}).map(file => `- ${file}`).join('\n')}

## Backup Location
Original files backed up to: ${BACKUP_DIR}

Generated: ${new Date().toISOString()}
`;

    fs.writeFileSync(MIGRATION_LOG, report);
    this.logMessage(`Migration report saved to: ${MIGRATION_LOG}`);
  }

  async run() {
    try {
      this.logMessage('Starting frontend scoring migration...');
      
      // Create backup
      await this.createBackup();
      
      // Migrate files
      await this.migrateAllFiles();
      
      // Generate report
      await this.generateMigrationReport();
      
      this.logMessage('Migration completed successfully!');
      console.log('\n📊 Migration Summary:');
      console.log(`✅ Files Processed: ${this.stats.filesProcessed}`);
      console.log(`✅ Files Modified: ${this.stats.filesModified}`);
      console.log(`✅ Total Replacements: ${this.stats.replacements}`);
      console.log(`❌ Errors: ${this.stats.errors}`);
      
      if (this.stats.errors > 0) {
        console.log('\n⚠️  Some errors occurred. Check the migration log for details.');
      } else {
        console.log('\n🎉 Migration completed without errors!');
      }
      
    } catch (error) {
      this.logMessage(`Migration failed: ${error.message}`);
      console.error('Migration failed:', error);
      process.exit(1);
    }
  }
}

// Run migration if called directly
if (require.main === module) {
  const migration = new MigrationScript();
  migration.run();
}

module.exports = MigrationScript;
