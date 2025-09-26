/**
 * Test Score Integration Utilities
 * Maps skills to test scores and integrates them into job recommendations
 */

import { getTestResults, getLatestTestResult } from './testScoring';
import { getAllTechnicalTests } from '../data/mockTechnicalTests';

/**
 * Maps skill names to their corresponding test IDs
 * This mapping connects user skills to the technical tests they can take
 */
const SKILL_TO_TEST_MAPPING = {
    'Python': 1,
    'JavaScript': 2,
    'React': 3,
    'Django': 4,
    'SQL': 5,
    'SQLite': 6,
    'Java': 7,
    'Git': 8,
    'HTML5': 9
};

/**
 * Get test score for a specific skill
 * @param {string} skillName - The name of the skill
 * @param {number} userId - The user ID
 * @returns {Object|null} - Test score object or null if no test found
 */
export const getSkillTestScore = (skillName, userId) => {
    const testId = SKILL_TO_TEST_MAPPING[skillName];
    if (!testId) {
        console.log(`🔍 No test found for skill: ${skillName}`);
        return null;
    }

    const latestResult = getLatestTestResult(userId, testId);
    if (!latestResult) {
        console.log(`🔍 No test result found for skill: ${skillName} (testId: ${testId})`);
        return null;
    }

    console.log(`✅ Found test score for ${skillName}:`, latestResult.result);
    return latestResult.result;
};

/**
 * Get all skill test scores for a user
 * @param {Array} userSkills - Array of user skills
 * @param {number} userId - The user ID
 * @returns {Object} - Object mapping skill names to their test scores
 */
export const getAllSkillTestScores = (userSkills, userId) => {
    const skillScores = {};

    if (!userSkills || !Array.isArray(userSkills)) {
        console.log('🔍 No user skills provided');
        return skillScores;
    }

    // Normalize user skills to handle both string and object formats
    const normalizedSkills = userSkills.map(skill => {
        if (typeof skill === 'string') return skill;
        if (typeof skill === 'object' && skill.name) return skill.name;
        return String(skill);
    });

    console.log('🔍 Getting test scores for skills:', normalizedSkills);

    normalizedSkills.forEach(skillName => {
        const testScore = getSkillTestScore(skillName, userId);
        if (testScore) {
            skillScores[skillName] = testScore;
        }
    });

    console.log('📊 All skill test scores:', skillScores);
    return skillScores;
};

/**
 * Calculate skill proficiency based on test score
 * @param {Object} testScore - Test score object
 * @returns {number} - Proficiency level (0-1)
 */
export const calculateSkillProficiency = (testScore) => {
    if (!testScore || typeof testScore.percentage !== 'number') {
        return 0;
    }

    // Convert percentage to proficiency (0-1 scale)
    // 70%+ = 1.0, 50-69% = 0.7, 30-49% = 0.4, <30% = 0.1
    const percentage = testScore.percentage;

    if (percentage >= 70) return 1.0;
    if (percentage >= 50) return 0.7;
    if (percentage >= 30) return 0.4;
    return 0.1;
};

/**
 * Get enhanced skill match score with test results
 * @param {string} skillName - The skill name
 * @param {Array} userSkills - User's skills array
 * @param {Object} skillTestScores - All skill test scores
 * @returns {Object} - Enhanced match information
 */
export const getEnhancedSkillMatch = (skillName, userSkills, skillTestScores) => {
    console.log('🔍 getEnhancedSkillMatch called:', {
        skillName,
        userSkills,
        skillTestScores: Object.keys(skillTestScores)
    });

    // Check if user has this skill (with flexible matching)
    const hasSkill = userSkills.some(userSkill => {
        const normalizedUserSkill = typeof userSkill === 'string' ? userSkill : userSkill.name;
        const userSkillLower = normalizedUserSkill.toLowerCase().trim();
        const jobSkillLower = skillName.toLowerCase().trim();

        const matches = userSkillLower === jobSkillLower ||
            userSkillLower.includes(jobSkillLower) ||
            jobSkillLower.includes(userSkillLower);

        console.log('🔍 Skill comparison:', {
            userSkill: normalizedUserSkill,
            jobSkill: skillName,
            userSkillLower,
            jobSkillLower,
            matches
        });

        return matches;
    });

    if (!hasSkill) {
        console.log('❌ No skill match found for:', skillName);
        return {
            hasSkill: false,
            testScore: null,
            proficiency: 0,
            enhancedScore: 0
        };
    }

    // Get test score for this skill
    const testScore = skillTestScores[skillName];
    const proficiency = testScore ? calculateSkillProficiency(testScore) : 0;

    // Calculate enhanced score (base skill match + test proficiency bonus)
    const baseScore = 1.0; // User has the skill
    const testBonus = proficiency * 0.5; // Up to 50% bonus from test performance
    const enhancedScore = Math.min(baseScore + testBonus, 1.5); // Cap at 1.5x

    const result = {
        hasSkill: true,
        testScore: testScore,
        proficiency: proficiency,
        enhancedScore: enhancedScore
    };

    console.log('✅ Enhanced skill match result:', result);
    return result;
};

/**
 * Calculate job match score with test integration
 * @param {Object} job - Job object
 * @param {Array} userSkills - User's skills
 * @param {number} userId - User ID
 * @returns {Object} - Enhanced job match information
 */
export const calculateEnhancedJobMatch = (job, userSkills, userId) => {
    console.log('🔍 calculateEnhancedJobMatch called with:', {
        jobTitle: job.title,
        userSkills,
        userId,
        jobRequiredSkills: job.required_skills,
        jobPreferredSkills: job.preferred_skills
    });

    // Get all skill test scores
    const skillTestScores = getAllSkillTestScores(userSkills, userId);

    // Extract job skills
    const requiredSkills = job.required_skills?.map(skill => {
        if (typeof skill === 'string') return skill;
        if (typeof skill === 'object' && skill.name) return skill.name;
        return String(skill);
    }) || [];

    const preferredSkills = job.preferred_skills?.map(skill => {
        if (typeof skill === 'string') return skill;
        if (typeof skill === 'object' && skill.name) return skill.name;
        return String(skill);
    }) || [];

    console.log('🔍 Extracted skills:', {
        requiredSkills,
        preferredSkills,
        skillTestScores
    });

    // Calculate enhanced matches
    const requiredMatches = requiredSkills.map(skillName => {
        const match = getEnhancedSkillMatch(skillName, userSkills, skillTestScores);
        return { ...match, skillName };
    });

    const preferredMatches = preferredSkills.map(skillName => {
        const match = getEnhancedSkillMatch(skillName, userSkills, skillTestScores);
        return { ...match, skillName };
    });

    console.log('🔍 Enhanced matches:', {
        requiredMatches,
        preferredMatches
    });

    // Calculate scores
    const requiredScore = requiredSkills.length > 0
        ? requiredMatches.reduce((sum, match) => sum + match.enhancedScore, 0) / requiredSkills.length
        : 0;

    const preferredScore = preferredSkills.length > 0
        ? preferredMatches.reduce((sum, match) => sum + match.enhancedScore, 0) / preferredSkills.length
        : 0;

    // Weight the scores (70% required, 30% preferred)
    const totalScore = (requiredScore * 0.7) + (preferredScore * 0.3);

    // Convert to percentage
    const matchPercentage = Math.round(totalScore * 100);

    console.log('🔍 Final scores:', {
        requiredScore,
        preferredScore,
        totalScore,
        matchPercentage
    });

    return {
        requiredMatches,
        preferredMatches,
        requiredScore,
        preferredScore,
        totalScore,
        matchPercentage,
        skillTestScores,
        hasTestScores: Object.keys(skillTestScores).length > 0
    };
};
