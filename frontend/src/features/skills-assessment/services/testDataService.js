// Service to fetch test data from backend while maintaining frontend compatibility
import backendApi from '../api/backendApi';

class TestDataService {
  // Map frontend test IDs to backend test IDs
  static getBackendTestId(frontendTestId) {
    const testIdMapping = {
      'VRT1': 1,   // Reading Comprehension Test
      'VRT2': 2,   // Verbal Reasoning Test 2 - Analogies
      'VRT3': 3,   // Verbal Reasoning Test 3 - Classification
      'VRT4': 4,   // Verbal Reasoning Test 4 - Coding & Decoding
      'VRT5': 5,   // Verbal Reasoning Test 5 - Blood Relations
      'SJT1': 30,  // Situational Judgment Test
      'NRT1': 21,  // Numerical Reasoning Test - Basic Arithmetic
      'ART1': 10,  // Abstract Reasoning Test
      'SRT1': 11,  // Spatial Reasoning Test
      'DRT1': 12,  // Diagrammatic Reasoning Test
      'LRT1': 13,  // Logical Reasoning Test
      'LRT2': 14,  // Logical Reasoning Test 2
      'LRT3': 15,  // Logical Reasoning Test 3
      'TCT1': 16,  // Technical Test
    };
    
    return testIdMapping[frontendTestId] || frontendTestId;
  }

  // Fetch test questions from backend and format for frontend compatibility
  static async fetchTestQuestions(frontendTestId) {
    try {
      const backendTestId = this.getBackendTestId(frontendTestId);
      const response = await backendApi.getTestQuestions(backendTestId);
      
      // Transform backend data to frontend format
      return this.transformBackendDataToFrontend(response, frontendTestId);
    } catch (error) {
      console.error('Error fetching test questions:', error);
      throw error;
    }
  }

  // Transform backend API response to frontend-compatible format
  static transformBackendDataToFrontend(backendData, testType) {
    const questions = backendData.questions || [];
    
    // Transform each question to frontend format
    const transformedQuestions = questions.map((question, index) => {
      return {
        id: question.id,
        question_id: question.id, // Map id to question_id for frontend compatibility
        question_text: question.question_text,
        passage_text: question.passage || question.context || question.passage_text,
        scenario: question.context || question.scenario,
        options: (question.options || []).map((option, optionIndex) => {
          // Transform string options to objects with option_id
          if (typeof option === 'string') {
            return {
              option_id: option,
              text: option,
              value: option
            };
          }
          // If already an object, return as-is
          return option;
        }),
        correct_answer: question.correct_answer,
        answer: question.correct_answer, // For compatibility
        difficulty: question.difficulty_level || 'medium',
        order: question.order || index + 1,
        main_image: question.main_image,
        explanation: question.explanation
      };
    });

    // Create sections first to get the correct question count
    const sections = this.createSections(transformedQuestions, testType);
    
    // Calculate total questions from sections (not from all backend questions)
    const totalQuestionsFromSections = sections.reduce((total, section) => {
      if (section.passages) {
        return total + section.passages.reduce((passageTotal, passage) => 
          passageTotal + (passage?.questions?.length || 0), 0);
      }
      return total + (section?.questions?.length || 0);
    }, 0);
    
    // Return in frontend-compatible format
    return {
      id: backendData.test_id || testType,
      title: backendData.test_title || this.getTestTitle(testType),
      timeLimit: backendData.duration_minutes || this.getDefaultTimeLimit(testType),
      duration_minutes: backendData.duration_minutes || this.getDefaultTimeLimit(testType),
      total_questions: totalQuestionsFromSections,
      questions: transformedQuestions,
      sections: sections
    };
  }

  // Create sections for tests that need them (like Verbal Reasoning)
  static createSections(questions, testType) {
    if (testType.startsWith('VRT')) {
      // For VRT1, create reading comprehension structure
      if (testType === 'VRT1') {
        // Group questions into passages (assuming 3 questions per passage)
        const questionsPerPassage = 3;
        const passages = [];
        
        // Sample reading comprehension passages with titles
        const samplePassages = [
          {
            title: "Innovation Ecosystems and Competitive Dynamics",
            text: "Innovation ecosystems represent complex networks of interdependent actors—including corporations, startups, research institutions, and government agencies—that collaborate and compete simultaneously to create and capture value from technological advances. These ecosystems are characterized by their paradoxical nature: while individual actors may compete for market share and resources, they also depend on each other for knowledge, talent, and complementary technologies. The success of any single organization within an ecosystem often hinges on the health and vitality of the entire network."
          },
          {
            title: "The Platform Economy and Network Effects",
            text: "The platform economy has emerged as a dominant force in modern business, fundamentally altering how value is created and distributed across industries. Platforms serve as intermediaries that connect different user groups—producers and consumers, service providers and clients, content creators and audiences—through digital infrastructure. Unlike traditional linear value chains, platforms create value through network effects, where the value of the platform increases as more users join and interact with each other."
          },
          {
            title: "Ecosystem Resilience and Systemic Vulnerabilities",
            text: "Ecosystem resilience has become a critical concern for organizations operating in highly interconnected systems. The COVID-19 pandemic demonstrated how disruptions in one part of a global supply chain could cascade through entire industries, affecting everything from manufacturing to healthcare. Organizations must therefore balance the benefits of deep ecosystem integration with the risks of excessive interdependence and potential systemic vulnerabilities."
          }
        ];
        
        for (let i = 0; i < questions.length; i += questionsPerPassage) {
          const passageQuestions = questions.slice(i, i + questionsPerPassage);
          const passageIndex = Math.floor(i / questionsPerPassage);
          const passageData = samplePassages[passageIndex % samplePassages.length];
          passages.push({
            id: passageIndex + 1,
            passage_title: passageData.title,
            passage_text: passageData.text,
            questions: passageQuestions.map((q, qIndex) => ({
              ...q,
              question_text: this.createReadingComprehensionQuestion(q, passageIndex, qIndex)
            }))
          });
        }
        
        return [{
          id: 1,
          title: 'Reading Comprehension',
          description: 'Read the passage and answer the questions',
          passages: passages,
          duration_minutes: 7,
          total_questions: passages.reduce((total, passage) => total + (passage?.questions?.length || 0), 0)
        }];
      } else {
        // For other VRT tests, create simple sections
        const questionsPerSection = Math.ceil(questions.length / 3);
        return [
          {
            id: 1,
            title: 'Verbal Analogies', 
            description: 'Complete the analogy',
            questions: questions.slice(0, questionsPerSection),
            duration_minutes: 7
          },
          {
            id: 2,
            title: 'Verbal Classification',
            description: 'Find the odd one out',
            questions: questions.slice(questionsPerSection, questionsPerSection * 2),
            duration_minutes: 7
          },
          {
            id: 3,
            title: 'Coding & Decoding',
            description: 'Decode the pattern',
            questions: questions.slice(questionsPerSection * 2),
            duration_minutes: 6
          }
        ];
      }
    }
    
    // For other tests, return single section
    return [{
      id: 1,
      title: this.getTestTitle(testType),
      description: this.getTestDescription(testType),
      questions: questions,
      duration_minutes: this.getDefaultTimeLimit(testType)
    }];
  }

  // Get test title based on test type
  static getTestTitle(testType) {
    const titles = {
      'VRT1': 'Verbal Reasoning Test - Reading Comprehension',
      'VRT2': 'Verbal Reasoning Test - Analogies',
      'VRT3': 'Verbal Reasoning Test - Classification',
      'VRT4': 'Verbal Reasoning Test - Coding & Decoding',
      'VRT5': 'Verbal Reasoning Test - Blood Relations',
      'VRT6': 'Verbal Reasoning Test - Logical Puzzles',
      'VRT7': 'Verbal Reasoning Test - Mixed',
      'SJT1': 'Situational Judgment Test',
      'NRT1': 'Numerical Reasoning Test',
      'ART1': 'Abstract Reasoning Test',
      'SRT1': 'Spatial Reasoning Test',
      'DRT1': 'Diagrammatic Reasoning Test',
      'LRT1': 'Logical Reasoning Test',
      'LRT2': 'Logical Reasoning Test 2',
      'LRT3': 'Logical Reasoning Test 3',
      'TCT1': 'Technical Test'
    };
    return titles[testType] || 'Skills Assessment Test';
  }

  // Get test description based on test type
  static getTestDescription(testType) {
    const descriptions = {
      'VRT1': 'Test your reading comprehension and verbal reasoning skills',
      'VRT2': 'Complete analogies to test your verbal reasoning',
      'VRT3': 'Find the odd one out in verbal classification',
      'VRT4': 'Decode patterns in verbal coding and decoding',
      'VRT5': 'Solve blood relations and family tree problems',
      'VRT6': 'Solve logical puzzles and reasoning problems',
      'VRT7': 'Mixed verbal reasoning challenges',
      'SJT1': 'Assess your judgment in workplace situations',
      'NRT1': 'Test your numerical reasoning and calculation skills',
      'ART1': 'Identify patterns in abstract shapes and figures',
      'SRT1': 'Test your spatial visualization and reasoning',
      'DRT1': 'Analyze diagrams and visual patterns',
      'LRT1': 'Solve logical reasoning problems',
      'LRT2': 'Advanced logical reasoning challenges',
      'LRT3': 'Complex logical reasoning problems',
      'TCT1': 'Test your technical knowledge and skills'
    };
    return descriptions[testType] || 'Complete this skills assessment test';
  }

  // Get default time limit based on test type
  static getDefaultTimeLimit(testType) {
    const timeLimits = {
      'VRT1': 20, 'VRT2': 20, 'VRT3': 20, 'VRT4': 20, 'VRT5': 20, 'VRT6': 20, 'VRT7': 20,
      'SJT1': 25,
      'NRT1': 30,
      'ART1': 15,
      'SRT1': 20,
      'DRT1': 25,
      'LRT1': 20, 'LRT2': 20, 'LRT3': 20,
      'TCT1': 30
    };
    return timeLimits[testType] || 20;
  }

  // Create reading comprehension questions from analogy questions
  static createReadingComprehensionQuestion(originalQuestion, passageIndex, questionIndex) {
    const questionTemplates = [
      "Based on the passage, which of the following statements is most accurate?",
      "According to the passage, what is the primary characteristic of the concept discussed?",
      "The passage suggests that the main challenge facing organizations is:",
      "Which of the following best summarizes the author's main point?",
      "Based on the information in the passage, which factor is most important for success?",
      "The passage indicates that the key difference between traditional and modern approaches is:",
      "According to the passage, the primary benefit of the discussed system is:",
      "Which of the following statements would the author most likely agree with?",
      "The passage implies that the greatest risk associated with this approach is:",
      "Based on the passage, the most significant advantage of this strategy is:"
    ];
    
    return questionTemplates[questionIndex % questionTemplates.length];
  }

  // Submit test answers to backend
  static async submitTestAnswers(frontendTestId, answers, timeTaken) {
    try {
      const backendTestId = this.getBackendTestId(frontendTestId);
      const response = await backendApi.submitTestAnswers(backendTestId, answers, timeTaken);
      return response;
    } catch (error) {
      console.error('Error submitting test answers:', error);
      throw error;
    }
  }
}

export default TestDataService;
