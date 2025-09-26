/**
 * Validated Skills Management
 * Tracks skills that have been validated through passed tests
 */

import { getTestResults, getLatestTestResult } from './testScoring';

// API base URL
const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Maps test IDs to skill names
 * This is the reverse mapping of SKILL_TO_TEST_MAPPING
 */
const TEST_TO_SKILL_MAPPING = {
    1: 'Python',
    2: 'JavaScript',
    3: 'React',
    4: 'Django',
    5: 'SQL',
    6: 'SQLite',
    7: 'Java',
    8: 'Git',
    9: 'HTML5'
};

/**
 * Fetch validated skills from backend API
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - API response with validated skills
 */
export const fetchValidatedSkillsFromAPI = async (token) => {
    try {
        console.log('🔍 Fetching validated skills from API...');

        const response = await fetch(`${API_BASE_URL}/skills/validated/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Validated skills fetched from API:', data);
        return data;

    } catch (error) {
        console.error('❌ Error fetching validated skills from API:', error);
        return null;
    }
};

/**
 * Get all validated skills for a user (skills with passed tests)
 * @param {number} userId - The user ID
 * @param {string} token - Authentication token (optional)
 * @returns {Array} - Array of validated skill names
 */
export const getValidatedSkills = async (userId, token = null) => {
    console.log('🔍 Getting validated skills for user:', userId);

    // Try to fetch from API first if token is provided
    if (token) {
        try {
            const apiData = await fetchValidatedSkillsFromAPI(token);
            if (apiData && apiData.success) {
                console.log('✅ Using validated skills from API:', apiData.validated_skills);
                return apiData.validated_skills;
            }
        } catch (error) {
            console.warn('⚠️ API fetch failed, falling back to localStorage:', error);
        }
    }

    // Fallback to localStorage
    const testResults = getTestResults(userId);
    const validatedSkills = [];

    // Check each test result
    testResults.forEach(result => {
        const testId = result.testId;
        const skillName = TEST_TO_SKILL_MAPPING[testId];

        if (skillName && result.result && result.result.passed) {
            console.log(`✅ Skill validated: ${skillName} (Test ID: ${testId}, Score: ${result.result.percentage}%)`);
            validatedSkills.push(skillName);
        }
    });

    // Remove duplicates
    const uniqueValidatedSkills = [...new Set(validatedSkills)];

    console.log('📊 Validated skills from localStorage:', uniqueValidatedSkills);
    return uniqueValidatedSkills;
};

/**
 * Check if a specific skill is validated for a user
 * @param {string} skillName - The skill name to check
 * @param {number} userId - The user ID
 * @param {string} token - Authentication token (optional)
 * @returns {Promise<boolean>} - True if the skill is validated
 */
export const isSkillValidated = async (skillName, userId, token = null) => {
    const validatedSkills = await getValidatedSkills(userId, token);
    return validatedSkills.includes(skillName);
};

/**
 * Get validated skills with their test scores
 * @param {number} userId - The user ID
 * @returns {Object} - Object mapping skill names to their test scores
 */
export const getValidatedSkillsWithScores = (userId) => {
    console.log('🔍 Getting validated skills with scores for user:', userId);

    const testResults = getTestResults(userId);
    const validatedSkillsWithScores = {};

    // Check each test result
    testResults.forEach(result => {
        const testId = result.testId;
        const skillName = TEST_TO_SKILL_MAPPING[testId];

        if (skillName && result.result && result.result.passed) {
            console.log(`✅ Validated skill with score: ${skillName} (${result.result.percentage}%)`);
            validatedSkillsWithScores[skillName] = {
                testId: testId,
                score: result.result.score,
                percentage: result.result.percentage,
                passed: result.result.passed,
                completedAt: result.completedAt,
                timeSpent: result.timeSpent
            };
        }
    });

    console.log('📊 Validated skills with scores:', validatedSkillsWithScores);
    return validatedSkillsWithScores;
};

/**
 * Filter user skills to only include validated ones
 * @param {Array} userSkills - Array of user skills
 * @param {number} userId - The user ID
 * @param {string} token - Authentication token (optional)
 * @returns {Promise<Array>} - Array of only validated skills
 */
export const filterToValidatedSkills = async (userSkills, userId, token = null) => {
    console.log('🔍 Filtering user skills to validated ones:', {
        userSkills,
        userId
    });

    const validatedSkills = await getValidatedSkills(userId, token);

    // Normalize user skills to handle both string and object formats
    const normalizedSkills = userSkills.map(skill => {
        if (typeof skill === 'string') return skill;
        if (typeof skill === 'object' && skill.name) return skill.name;
        return String(skill);
    });

    // Filter to only include validated skills
    const validatedUserSkills = normalizedSkills.filter(skill =>
        validatedSkills.includes(skill)
    );

    console.log('📊 Filtered to validated skills:', {
        original: normalizedSkills,
        validated: validatedUserSkills,
        validatedSkills: validatedSkills
    });

    return validatedUserSkills;
};

/**
 * Get validation statistics for a user
 * @param {Array} userSkills - Array of user skills
 * @param {number} userId - The user ID
 * @param {string} token - Authentication token (optional)
 * @returns {Promise<Object>} - Validation statistics
 */
export const getValidationStats = async (userSkills, userId, token = null) => {
    const validatedSkills = await getValidatedSkills(userId, token);
    const normalizedSkills = userSkills.map(skill => {
        if (typeof skill === 'string') return skill;
        if (typeof skill === 'object' && skill.name) return skill.name;
        return String(skill);
    });

    const totalSkills = normalizedSkills.length;
    const validatedCount = normalizedSkills.filter(skill =>
        validatedSkills.includes(skill)
    ).length;

    return {
        totalSkills,
        validatedCount,
        unvalidatedCount: totalSkills - validatedCount,
        validationPercentage: totalSkills > 0 ? Math.round((validatedCount / totalSkills) * 100) : 0,
        validatedSkills,
        unvalidatedSkills: normalizedSkills.filter(skill =>
            !validatedSkills.includes(skill)
        )
    };
};

/**
 * Update user profile with validated skills
 * @param {number} userId - The user ID
 * @param {Object} userProfile - The user profile object
 * @returns {Object} - Updated user profile with validated skills
 */
export const updateProfileWithValidatedSkills = (userId, userProfile) => {
    console.log('🔍 Updating profile with validated skills:', {
        userId,
        userProfile
    });

    const validatedSkills = getValidatedSkills(userId);
    const validationStats = getValidationStats(userProfile.skills || [], userId);

    const updatedProfile = {
        ...userProfile,
        validatedSkills: validatedSkills,
        validationStats: validationStats,
        // Update skills to only include validated ones for job recommendations
        skillsForRecommendations: filterToValidatedSkills(userProfile.skills || [], userId)
    };

    console.log('📊 Updated profile with validated skills:', updatedProfile);
    return updatedProfile;
};
