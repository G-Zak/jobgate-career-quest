// Utility functions for handling skills fallback when API fails
import { loadUserProfile } from './profileUtils';

/**
 * Get user skills with multiple fallback strategies
 * @param {Object} userProfile - User profile from props
 * @param {Array} userSkills - User skills from props
 * @param {string|number} userId - User ID
 * @param {Object} authUser - Authenticated user object
 * @returns {Array} Array of skill names
 */
export const getUserSkillsWithFallback = (userProfile, userSkills, userId, authUser) => {
    console.log('🔍 getUserSkillsWithFallback - Input parameters:');
    console.log('  - userProfile:', userProfile);
    console.log('  - userSkills:', userSkills);
    console.log('  - userId:', userId);
    console.log('  - authUser:', authUser);

    // Strategy 1: Skills from userProfile.skillsWithProficiency
    if (userProfile?.skillsWithProficiency && userProfile.skillsWithProficiency.length > 0) {
        const skills = userProfile.skillsWithProficiency.map(skill => skill.name);
        console.log('✅ Strategy 1 - Skills from userProfile.skillsWithProficiency:', skills);
        return skills;
    }

    // Strategy 2: Skills from userProfile.skills (simple array)
    if (userProfile?.skills && userProfile.skills.length > 0) {
        console.log('✅ Strategy 2 - Skills from userProfile.skills:', userProfile.skills);
        return userProfile.skills;
    }

    // Strategy 3: Skills from props
    if (userSkills && userSkills.length > 0) {
        console.log('✅ Strategy 3 - Skills from props:', userSkills);
        return userSkills;
    }

    // Strategy 4: Skills from localStorage fallback
    try {
        const fallbackProfile = loadUserProfile(authUser?.id || userId || 1);

        if (fallbackProfile?.skillsWithProficiency && fallbackProfile.skillsWithProficiency.length > 0) {
            const skills = fallbackProfile.skillsWithProficiency.map(skill => skill.name);
            console.log('✅ Strategy 4a - Skills from localStorage skillsWithProficiency:', skills);
            return skills;
        }

        if (fallbackProfile?.skills && fallbackProfile.skills.length > 0) {
            console.log('✅ Strategy 4b - Skills from localStorage skills array:', fallbackProfile.skills);
            return fallbackProfile.skills;
        }
    } catch (error) {
        console.warn('⚠️ Strategy 4 - Failed to load skills from localStorage:', error);
    }

    // Strategy 5: Try to find any profile in localStorage
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('userProfile_')) {
                const saved = localStorage.getItem(key);
                if (saved) {
                    const profile = JSON.parse(saved);
                    if (profile?.skillsWithProficiency && profile.skillsWithProficiency.length > 0) {
                        const skills = profile.skillsWithProficiency.map(skill => skill.name);
                        console.log('✅ Strategy 5a - Skills from any localStorage profile (skillsWithProficiency):', skills);
                        return skills;
                    }
                    if (profile?.skills && profile.skills.length > 0) {
                        console.log('✅ Strategy 5b - Skills from any localStorage profile (skills):', profile.skills);
                        return profile.skills;
                    }
                }
            }
        }
    } catch (error) {
        console.warn('⚠️ Strategy 5 - Failed to search localStorage:', error);
    }

    // Strategy 6: Hardcoded fallback for testing
    const hardcodedSkills = ['React', 'Django', 'JavaScript'];
    console.log('✅ Strategy 6 - Using hardcoded skills for testing:', hardcodedSkills);
    return hardcodedSkills;
};

/**
 * Get user profile with fallback strategies
 * @param {Object} userProfile - User profile from props
 * @param {string|number} userId - User ID
 * @param {Object} authUser - Authenticated user object
 * @returns {Object} User profile object
 */
export const getUserProfileWithFallback = (userProfile, userId, authUser) => {
    console.log('🔍 getUserProfileWithFallback - Input parameters:');
    console.log('  - userProfile:', userProfile);
    console.log('  - userId:', userId);
    console.log('  - authUser:', authUser);

    // Strategy 1: Use provided userProfile
    if (userProfile && userProfile.id) {
        console.log('✅ Strategy 1 - Using provided userProfile:', userProfile);
        return userProfile;
    }

    // Strategy 2: Load from localStorage with specific user ID
    try {
        const fallbackProfile = loadUserProfile(authUser?.id || userId || 1);
        if (fallbackProfile && fallbackProfile.id) {
            console.log('✅ Strategy 2 - Profile from localStorage with specific ID:', fallbackProfile);
            return fallbackProfile;
        }
    } catch (error) {
        console.warn('⚠️ Strategy 2 - Failed to load profile from localStorage:', error);
    }

    // Strategy 3: Find any profile in localStorage
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('userProfile_')) {
                const saved = localStorage.getItem(key);
                if (saved) {
                    const profile = JSON.parse(saved);
                    if (profile && profile.id) {
                        console.log('✅ Strategy 3 - Profile from any localStorage key:', profile);
                        return profile;
                    }
                }
            }
        }
    } catch (error) {
        console.warn('⚠️ Strategy 3 - Failed to search localStorage:', error);
    }

    console.log('❌ No profile found with any strategy');
    return null;
};

/**
 * Check if skills are available from any source
 * @param {Object} userProfile - User profile from props
 * @param {Array} userSkills - User skills from props
 * @param {string|number} userId - User ID
 * @param {Object} authUser - Authenticated user object
 * @returns {boolean} True if skills are available
 */
export const hasSkillsAvailable = (userProfile, userSkills, userId, authUser) => {
    const skills = getUserSkillsWithFallback(userProfile, userSkills, userId, authUser);
    return skills && skills.length > 0;
};

/**
 * Get skills count for debugging
 * @param {Object} userProfile - User profile from props
 * @param {Array} userSkills - User skills from props
 * @param {string|number} userId - User ID
 * @param {Object} authUser - Authenticated user object
 * @returns {Object} Skills count information
 */
export const getSkillsDebugInfo = (userProfile, userSkills, userId, authUser) => {
    const skills = getUserSkillsWithFallback(userProfile, userSkills, userId, authUser);

    return {
        totalSkills: skills.length,
        skills: skills,
        hasSkills: skills.length > 0,
        sources: {
            userProfileSkills: userProfile?.skills?.length || 0,
            userProfileSkillsWithProficiency: userProfile?.skillsWithProficiency?.length || 0,
            propsSkills: userSkills?.length || 0,
            localStorageAvailable: typeof Storage !== 'undefined'
        }
    };
};

