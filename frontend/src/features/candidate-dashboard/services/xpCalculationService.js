/**
 * Comprehensive XP (Experience Points) Calculation Service
 * Calculates user XP based on all activities and achievements
 */

class XPCalculationService {
 constructor() {
 // XP Point Values for different activities
 this.XP_VALUES = {
 // Test-related activities
 TEST_COMPLETION: {
 base: 100,
 difficulty_multipliers: {
 'easy': 1.0,
 'medium': 1.5,
 'hard': 2.0,
 'expert': 2.5
 },
 score_bonus: {
 90: 50, // 90%+ gets 50 bonus XP
 80: 30, // 80%+ gets 30 bonus XP
 70: 15, // 70%+ gets 15 bonus XP
 60: 5 // 60%+ gets 5 bonus XP
 }
 },

 // Skills assessment activities
 SKILLS_ASSESSMENT: {
 base: 75,
 completion_bonus: 25,
 perfect_score_bonus: 100
 },

 // Profile and engagement activities
 PROFILE_COMPLETION: {
 basic_info: 50,
 skills_added: 25,
 bio_completed: 30,
 cv_uploaded: 75,
 profile_picture: 20,
 career_goals: 40
 },

 // Engagement and consistency
 ENGAGEMENT: {
 daily_login: 10,
 weekly_streak: 50,
 monthly_streak: 200,
 first_test_of_day: 15,
 consecutive_days: 25
 },

 // Achievement bonuses
 ACHIEVEMENTS: {
 first_perfect_score: 200,
 test_master: 300,
 speed_master: 150,
 improvement_streak: 100,
 versatile_learner: 250
 },

 // Coding challenges
 CODING_CHALLENGES: {
 base: 150,
 difficulty_multipliers: {
 'beginner': 1.0,
 'intermediate': 1.5,
 'advanced': 2.0,
 'expert': 3.0
 },
 optimization_bonus: 50
 },

 // Job application activities
 JOB_ACTIVITIES: {
 application_submitted: 25,
 profile_viewed: 5,
 interview_scheduled: 100
 }
 };

 // Level thresholds (cumulative XP required)
 this.LEVEL_THRESHOLDS = [
 0, // Level 1: 0 XP
 500, // Level 2: 500 XP
 1200, // Level 3: 1200 XP
 2500, // Level 4: 2500 XP
 4500, // Level 5: 4500 XP
 7500, // Level 6: 7500 XP
 12000, // Level 7: 12000 XP
 18000, // Level 8: 18000 XP
 26000, // Level 9: 26000 XP
 36000, // Level 10: 36000 XP
 50000 // Level 11+: 50000+ XP
 ];
 }

 /**
 * Calculate XP from test completion
 */
 calculateTestXP(testData) {
 const { test_type, difficulty, score, time_spent, questions_count } = testData;

 let xp = this.XP_VALUES.TEST_COMPLETION.base;

 // Apply difficulty multiplier
 const difficultyMultiplier = this.XP_VALUES.TEST_COMPLETION.difficulty_multipliers[difficulty] || 1.0;
 xp *= difficultyMultiplier;

 // Apply score bonus
 const scoreBonus = this.getScoreBonus(score);
 xp += scoreBonus;

 // Length bonus (more questions = more XP)
 if (questions_count > 10) {
 xp += Math.floor((questions_count - 10) * 5);
 }

 return Math.round(xp);
 }

 /**
 * Calculate XP from skills assessment
 */
 calculateSkillsAssessmentXP(assessmentData) {
 const { completed, score, skills_count } = assessmentData;

 let xp = this.XP_VALUES.SKILLS_ASSESSMENT.base;

 if (completed) {
 xp += this.XP_VALUES.SKILLS_ASSESSMENT.completion_bonus;
 }

 if (score >= 100) {
 xp += this.XP_VALUES.SKILLS_ASSESSMENT.perfect_score_bonus;
 }

 // Bonus for multiple skills assessed
 xp += (skills_count - 1) * 10;

 return Math.round(xp);
 }

 /**
 * Calculate XP from profile completion
 */
 calculateProfileCompletionXP(profileData) {
 let xp = 0;
 const values = this.XP_VALUES.PROFILE_COMPLETION;

 if (profileData.basic_info_complete) xp += values.basic_info;
 if (profileData.skills_count > 0) xp += values.skills_added * Math.min(profileData.skills_count, 5);
 if (profileData.bio_completed) xp += values.bio_completed;
 if (profileData.cv_uploaded) xp += values.cv_uploaded;
 if (profileData.profile_picture) xp += values.profile_picture;
 if (profileData.career_goals) xp += values.career_goals;

 return Math.round(xp);
 }

 /**
 * Calculate XP from engagement activities
 */
 calculateEngagementXP(engagementData) {
 let xp = 0;
 const values = this.XP_VALUES.ENGAGEMENT;

 // Daily login streak
 if (engagementData.login_streak_days > 0) {
 xp += values.daily_login * Math.min(engagementData.login_streak_days, 30);
 }

 // Weekly streak bonus
 if (engagementData.weekly_streak > 0) {
 xp += values.weekly_streak * engagementData.weekly_streak;
 }

 // Monthly streak bonus
 if (engagementData.monthly_streak > 0) {
 xp += values.monthly_streak * engagementData.monthly_streak;
 }

 // First test of day bonus
 xp += values.first_test_of_day * engagementData.first_test_days;

 return Math.round(xp);
 }

 /**
 * Calculate XP from achievements
 */
 calculateAchievementXP(achievements) {
 let xp = 0;
 const values = this.XP_VALUES.ACHIEVEMENTS;

 achievements.forEach(achievement => {
 if (achievement.earned) {
 switch (achievement.id) {
 case 1: // Perfect Score
 xp += values.first_perfect_score;
 break;
 case 2: // Test Master
 xp += values.test_master;
 break;
 case 4: // Speed Master
 xp += values.speed_master;
 break;
 case 3: // Improvement
 xp += values.improvement_streak;
 break;
 case 5: // Versatile Learner
 xp += values.versatile_learner;
 break;
 }
 }
 });

 return Math.round(xp);
 }

 /**
 * Calculate XP from coding challenges
 */
 calculateCodingChallengeXP(challengeData) {
 const { difficulty, completed, optimized, time_efficiency } = challengeData;

 let xp = this.XP_VALUES.CODING_CHALLENGES.base;

 // Apply difficulty multiplier
 const difficultyMultiplier = this.XP_VALUES.CODING_CHALLENGES.difficulty_multipliers[difficulty] || 1.0;
 xp *= difficultyMultiplier;

 // Optimization bonus
 if (optimized) {
 xp += this.XP_VALUES.CODING_CHALLENGES.optimization_bonus;
 }

 // Time efficiency bonus
 if (time_efficiency > 0.8) {
 xp += 25;
 }

 return Math.round(xp);
 }

 /**
 * Get score bonus based on percentage
 */
 getScoreBonus(score) {
 const bonuses = this.XP_VALUES.TEST_COMPLETION.score_bonus;

 if (score >= 90) return bonuses[90];
 if (score >= 80) return bonuses[80];
 if (score >= 70) return bonuses[70];
 if (score >= 60) return bonuses[60];

 return 0;
 }

 /**
 * Calculate total XP from all activities
 */
 calculateTotalXP(userData) {
 let totalXP = 0;

 // Test completion XP
 if (userData.tests) {
 userData.tests.forEach(test => {
 totalXP += this.calculateTestXP(test);
 });
 }

 // Skills assessment XP
 if (userData.skills_assessments) {
 userData.skills_assessments.forEach(assessment => {
 totalXP += this.calculateSkillsAssessmentXP(assessment);
 });
 }

 // Profile completion XP
 if (userData.profile) {
 totalXP += this.calculateProfileCompletionXP(userData.profile);
 }

 // Engagement XP
 if (userData.engagement) {
 totalXP += this.calculateEngagementXP(userData.engagement);
 }

 // Achievement XP
 if (userData.achievements) {
 totalXP += this.calculateAchievementXP(userData.achievements);
 }

 // Coding challenge XP
 if (userData.coding_challenges) {
 userData.coding_challenges.forEach(challenge => {
 totalXP += this.calculateCodingChallengeXP(challenge);
 });
 }

 return Math.round(totalXP);
 }

 /**
 * Calculate user level based on total XP
 */
 calculateLevel(totalXP) {
 for (let i = this.LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
 if (totalXP >= this.LEVEL_THRESHOLDS[i]) {
 return i + 1;
 }
 }
 return 1;
 }

 /**
 * Get XP required for next level
 */
 getNextLevelXP(currentLevel) {
 if (currentLevel >= this.LEVEL_THRESHOLDS.length) {
 return this.LEVEL_THRESHOLDS[this.LEVEL_THRESHOLDS.length - 1] + 15000;
 }
 return this.LEVEL_THRESHOLDS[currentLevel];
 }

 /**
 * Calculate progress to next level
 */
 calculateLevelProgress(totalXP) {
 const currentLevel = this.calculateLevel(totalXP);
 const currentLevelXP = this.LEVEL_THRESHOLDS[currentLevel - 1] || 0;
 const nextLevelXP = this.getNextLevelXP(currentLevel);

 const progressXP = totalXP - currentLevelXP;
 const requiredXP = nextLevelXP - currentLevelXP;

 return {
 currentLevel,
 totalXP,
 currentLevelXP,
 nextLevelXP,
 progressXP,
 requiredXP,
 progressPercentage: Math.min(100, Math.round((progressXP / requiredXP) * 100))
 };
 }

 /**
 * Get level title based on level number
 */
 getLevelTitle(level) {
 const titles = {
 1: 'Career Explorer',
 2: 'Skill Seeker',
 3: 'Knowledge Builder',
 4: 'Test Conqueror',
 5: 'Skill Master',
 6: 'Performance Pro',
 7: 'Excellence Achiever',
 8: 'Career Champion',
 9: 'Industry Expert',
 10: 'Elite Performer',
 11: 'Legendary Professional'
 };

 return titles[level] || 'Master Professional';
 }
}

export default new XPCalculationService();
