// Technical Test Data Structure for Skills-Based Testing
// This module generates technical tests based on user's skills

export const getTechnicalTestSections = (userSkills = []) => {
 if (!userSkills || userSkills.length === 0) {
 return {
 id: 'TT',
 title: "Technical Assessment",
 description: "No skills selected",
 duration_minutes: 0,
 total_questions: 0,
 sections: [],
 message: "Please add your technical skills first to generate a personalized technical test."
 };
 }

 // Calculate duration based on number of skills (5 minutes per skill, minimum 15 minutes)
 const baseDuration = Math.max(15, userSkills.length * 5);
 const questionsPerSkill = Math.min(5, Math.max(2, Math.floor(20 / userSkills.length)));
 const totalQuestions = userSkills.length * questionsPerSkill;

 return {
 id: 'TT',
 title: "Technical Assessment",
 description: `Skills-based technical evaluation covering ${userSkills.length} technologies`,
 duration_minutes: baseDuration,
 total_questions: totalQuestions,
 user_skills: userSkills,
 sections: [
 {
 id: 1,
 title: "Technical Skills Assessment",
 description: `Evaluate your proficiency in ${userSkills.map(s => s.name).join(', ')}`,
 duration_minutes: baseDuration,
 intro_text: {
 title: "TECHNICAL SKILLS ASSESSMENT",
 instructions: [
 "This test is customized based on your selected technical skills.",
 `You will be tested on: ${userSkills.map(s => s.name).join(', ')}`,
 "",
 "Questions cover practical knowledge and problem-solving in your areas of expertise.",
 "Each question tests real-world application of concepts.",
 "",
 `You have ${baseDuration} minutes to complete ${totalQuestions} questions.`,
 "Take your time to read each question carefully.",
 "",
 "Click 'Start Test' when you are ready to begin."
 ]
 },
 questions: [] // Will be populated dynamically from API
 }
 ]
 };
};

// Function to format questions received from API
export const formatTechnicalQuestions = (apiQuestions) => {
 return apiQuestions.map((q, index) => ({
 id: index + 1,
 question: q.question,
 options: ["A", "B", "C", "D"],
 option_texts: {
 A: q.option_a,
 B: q.option_b,
 C: q.option_c,
 D: q.option_d
 },
 correct_answer: q.correct_answer.toLowerCase(),
 skill_name: q.skill_name,
 skill_category: q.category,
 difficulty_level: q.difficulty_level,
 explanation: q.explanation,
 order: index + 1,
 complexity_score: q.difficulty_level
 }));
};

// Generate test structure with user's skills
export const generateTechnicalTest = async (userId) => {
 try {
 // Fetch user's skills
 const skillsResponse = await fetch(`/api/skills/user/${userId}`);
 if (!skillsResponse.ok) throw new Error('Failed to fetch user skills');
 const skillsData = await skillsResponse.json();

 if (!skillsData.userSkills || skillsData.userSkills.length === 0) {
 return getTechnicalTestSections([]);
 }

 // Fetch technical questions for user's skills
 const questionsResponse = await fetch(`/api/skills/technical-questions/${userId}?limit=50`);
 if (!questionsResponse.ok) throw new Error('Failed to fetch questions');
 const questionsData = await questionsResponse.json();

 // Create test structure
 const testStructure = getTechnicalTestSections(skillsData.userSkills);

 if (questionsData.questions && questionsData.questions.length > 0) {
 // Format and add questions to the test
 const formattedQuestions = formatTechnicalQuestions(questionsData.questions);
 testStructure.sections[0].questions = formattedQuestions;
 testStructure.total_questions = formattedQuestions.length;

 // Update duration based on actual question count (2 minutes per question minimum)
 testStructure.duration_minutes = Math.max(
 testStructure.duration_minutes,
 formattedQuestions.length * 2
 );
 testStructure.sections[0].duration_minutes = testStructure.duration_minutes;
 }

 return testStructure;
 } catch (error) {
 console.error('Error generating technical test:', error);
 return {
 id: 'TT',
 title: "Technical Assessment",
 description: "Error loading test",
 duration_minutes: 0,
 total_questions: 0,
 sections: [],
 error: "Failed to load technical assessment. Please try again."
 };
 }
};

// Helper function to group questions by skill
export const groupQuestionsBySkill = (questions) => {
 return questions.reduce((acc, question) => {
 const skillName = question.skill_name;
 if (!acc[skillName]) {
 acc[skillName] = {
 skill_name: skillName,
 skill_category: question.skill_category,
 questions: []
 };
 }
 acc[skillName].questions.push(question);
 return acc;
 }, {});
};

// Helper function to calculate skill coverage
export const calculateSkillCoverage = (userSkills, questions) => {
 const skillsWithQuestions = new Set(questions.map(q => q.skill_name));
 const coverage = userSkills.map(skill => ({
 ...skill,
 hasQuestions: skillsWithQuestions.has(skill.name),
 questionCount: questions.filter(q => q.skill_name === skill.name).length
 }));

 return coverage;
};

// Export function for getting test with answers (for evaluation)
export const getTechnicalTestWithAnswers = async (userId) => {
 const testData = await generateTechnicalTest(userId);
 // Questions already include correct answers from API
 return testData;
};

// Default export for backward compatibility
export default {
 getTechnicalTestSections,
 generateTechnicalTest,
 formatTechnicalQuestions,
 groupQuestionsBySkill,
 calculateSkillCoverage,
 getTechnicalTestWithAnswers
};
