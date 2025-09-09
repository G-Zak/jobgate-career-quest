// Verbal Reasoning Question Pools for Randomized Tests
// This system prevents cheating by randomly selecting questions from large pools

// ==========================================
// READING COMPREHENSION POOLS
// ==========================================

export const readingComprehensionPools = {
  // Pool 1: Science & Nature Topics
  scienceNature: [
    {
      id: "sci_001",
      passage_title: "Birds and Flight Evolution",
      passage_text: `Although it was discovered in the 19th century that birds were closely related to dinosaurs, the current scientific consensus is that birds were, and always have been dinosaurs themselves. Fossil evidence demonstrates similarities between birds and other feathered dinosaurs, including hollow bones, nest building and similar brooding behaviours. Although the dinosaurian lineage of birds is largely undisputed, the evolution of powered flight in birds is still debated. Two theories of flight in birds are the "ground-up" theory, and the "trees-down" theory. Ground-up theorists suggest birds evolved powered flight from ground dwelling dinosaurs, and trees-down theorists suggest birds evolved from tree dwelling, gliding dinosaurs. Further research is required to conclusively verify the process in which birds evolved powered flight.`,
      questions: [
        {
          id: 1,
          question_text: `The "ground-up" and "trees-down" theories are the only theories explaining flight in birds.`,
          options: ["True", "False", "Cannot Say"],
          correct_answer: "Cannot Say",
          explanation: `Although the "ground-up" and "trees-down" theories are stated to be theories of flight in birds, they are not stated to be the only two theories explaining flight in birds.`
        },
        {
          id: 2,
          question_text: `Birds evolved from dinosaurs.`,
          options: ["True", "False", "Cannot Say"],
          correct_answer: "True",
          explanation: `The passage states that "the current scientific consensus is that birds were, and always have been dinosaurs themselves."`
        },
        {
          id: 3,
          question_text: `The evolution of powered flight in birds is fully understood.`,
          options: ["True", "False", "Cannot Say"],
          correct_answer: "False",
          explanation: `The passage states that "the evolution of powered flight in birds is still debated" and "Further research is required to conclusively verify the process."`
        }
      ]
    },
    {
      id: "sci_002",
      passage_title: "Ocean Currents and Climate",
      passage_text: `Ocean currents play a crucial role in regulating Earth's climate by transporting warm and cold water around the globe. The Gulf Stream, for example, carries warm water from the tropical Atlantic to the North Atlantic, moderating temperatures in Western Europe. Without this current, countries like the United Kingdom would experience much colder winters. Scientists have observed that climate change is affecting ocean current patterns, with some currents slowing down or changing direction. This could have significant implications for global weather patterns and regional climates. Computer models predict that if current trends continue, some areas could experience dramatic temperature changes within the next century.`,
      questions: [
        {
          id: 1,
          question_text: `The Gulf Stream makes Western European winters warmer than they would otherwise be.`,
          options: ["True", "False", "Cannot Say"],
          correct_answer: "True",
          explanation: `The passage states that the Gulf Stream "carries warm water from the tropical Atlantic to the North Atlantic, moderating temperatures in Western Europe."`
        },
        {
          id: 2,
          question_text: `Climate change has stopped the Gulf Stream completely.`,
          options: ["True", "False", "Cannot Say"],
          correct_answer: "Cannot Say",
          explanation: `The passage mentions that climate change is affecting ocean currents and some are slowing down, but doesn't specifically state the Gulf Stream has stopped.`
        },
        {
          id: 3,
          question_text: `All ocean currents transport warm water.`,
          options: ["True", "False", "Cannot Say"],
          correct_answer: "False",
          explanation: `The passage states that ocean currents transport "warm and cold water around the globe," indicating they carry both warm and cold water.`
        }
      ]
    },
    {
      id: "sci_003",
      passage_title: "Photosynthesis in Plants",
      passage_text: `Photosynthesis is the process by which plants convert sunlight, carbon dioxide, and water into glucose and oxygen. This process occurs primarily in the leaves, specifically in specialized cells called chloroplasts that contain chlorophyll. Chlorophyll absorbs light energy, particularly red and blue wavelengths, while reflecting green light, which is why plants appear green. The process can be divided into two main stages: the light-dependent reactions and the Calvin cycle. During light-dependent reactions, water molecules are split to release oxygen as a byproduct. The Calvin cycle uses the energy captured during the light reactions to convert carbon dioxide into glucose. This process is essential for life on Earth as it produces the oxygen we breathe and forms the base of most food chains.`,
      questions: [
        {
          id: 1,
          question_text: `Plants appear green because chlorophyll absorbs green light.`,
          options: ["True", "False", "Cannot Say"],
          correct_answer: "False",
          explanation: `The passage states that chlorophyll reflects green light, not absorbs it, which is why plants appear green.`
        },
        {
          id: 2,
          question_text: `Photosynthesis produces both glucose and oxygen.`,
          options: ["True", "False", "Cannot Say"],
          correct_answer: "True",
          explanation: `The passage clearly states that photosynthesis converts materials "into glucose and oxygen."`
        },
        {
          id: 3,
          question_text: `The Calvin cycle occurs before the light-dependent reactions.`,
          options: ["True", "False", "Cannot Say"],
          correct_answer: "False",
          explanation: `The passage indicates that the Calvin cycle "uses the energy captured during the light reactions," suggesting light reactions come first.`
        }
      ]
    }
  ],

  // Pool 2: Business & Economics Topics
  businessEconomics: [
    {
      id: "bus_001",
      passage_title: "Remote Work and Productivity",
      passage_text: `The shift to remote work during the global pandemic has fundamentally changed how businesses operate. Initial concerns about productivity loss have been largely unfounded, with many companies reporting maintained or even increased productivity levels among remote workers. However, the impact varies significantly across different industries and job types. Creative roles and collaborative projects have faced more challenges in remote settings, while individual contributor roles in technology and finance have often thrived. Companies are now investing heavily in digital infrastructure and virtual collaboration tools. The long-term effects on company culture and employee development remain to be seen, as many organizations struggle to maintain team cohesion and provide mentorship opportunities in virtual environments.`,
      questions: [
        {
          id: 1,
          question_text: `All companies experienced increased productivity with remote work.`,
          options: ["True", "False", "Cannot Say"],
          correct_answer: "False",
          explanation: `The passage states that "many companies" reported maintained or increased productivity, not all companies.`
        },
        {
          id: 2,
          question_text: `Technology roles have generally adapted well to remote work.`,
          options: ["True", "False", "Cannot Say"],
          correct_answer: "True",
          explanation: `The passage specifically mentions that "individual contributor roles in technology and finance have often thrived" in remote settings.`
        },
        {
          id: 3,
          question_text: `Companies have reduced spending on digital infrastructure due to remote work.`,
          options: ["True", "False", "Cannot Say"],
          correct_answer: "False",
          explanation: `The passage states that "Companies are now investing heavily in digital infrastructure and virtual collaboration tools."`
        }
      ]
    }
  ],

  // Pool 3: History & Culture Topics
  historyCulture: [
    {
      id: "hist_001",
      passage_title: "Ancient Trade Routes",
      passage_text: `The Silk Road was not a single route but a network of trade paths connecting East and West for over 1,400 years. These routes facilitated not only the exchange of goods like silk, spices, and precious metals but also the spread of ideas, technologies, and religions. Buddhist monks traveled these paths to spread their teachings, while Islamic scholars shared mathematical and scientific knowledge. The routes declined in importance with the rise of maritime trade in the 15th century, as sea routes proved faster and more cost-effective for bulk goods. However, the cultural impact of the Silk Road continues to influence the regions it connected, with many cities along the routes still serving as important cultural and commercial centers today.`,
      questions: [
        {
          id: 1,
          question_text: `The Silk Road was a single, well-defined trade route.`,
          options: ["True", "False", "Cannot Say"],
          correct_answer: "False",
          explanation: `The passage clearly states that "The Silk Road was not a single route but a network of trade paths."`
        },
        {
          id: 2,
          question_text: `Maritime trade routes replaced the Silk Road because they were faster.`,
          options: ["True", "False", "Cannot Say"],
          correct_answer: "True",
          explanation: `The passage states that sea routes "proved faster and more cost-effective for bulk goods."`
        },
        {
          id: 3,
          question_text: `The Silk Road operated for exactly 1,400 years.`,
          options: ["True", "False", "Cannot Say"],
          correct_answer: "Cannot Say",
          explanation: `The passage says "over 1,400 years," which means more than 1,400 years, not exactly 1,400 years.`
        }
      ]
    }
  ]
};

// ==========================================
// VERBAL ANALOGIES POOLS
// ==========================================

export const verbalAnalogyPools = {
  // Pool 1: Basic Relationships
  basicRelationships: [
    {
      id: "ana_001",
      question_text: "CAR is to ROAD as BOAT is to:",
      options: ["Harbor", "Water", "Captain", "Anchor"],
      correct_answer: "Water",
      explanation: "A car travels on a road, just as a boat travels on water.",
      relationship_type: "function/environment"
    },
    {
      id: "ana_002",
      question_text: "TEACHER is to STUDENT as DOCTOR is to:",
      options: ["Hospital", "Medicine", "Patient", "Nurse"],
      correct_answer: "Patient",
      explanation: "A teacher works with students, just as a doctor works with patients.",
      relationship_type: "professional/client"
    },
    {
      id: "ana_003",
      question_text: "BOOK is to LIBRARY as PAINTING is to:",
      options: ["Artist", "Canvas", "Museum", "Frame"],
      correct_answer: "Museum",
      explanation: "Books are stored and displayed in libraries, just as paintings are stored and displayed in museums.",
      relationship_type: "object/location"
    },
    {
      id: "ana_004",
      question_text: "HAPPY is to SAD as HOT is to:",
      options: ["Warm", "Cold", "Temperature", "Fire"],
      correct_answer: "Cold",
      explanation: "Happy and sad are opposite emotions, just as hot and cold are opposite temperatures.",
      relationship_type: "antonym"
    },
    {
      id: "ana_005",
      question_text: "FINGER is to HAND as LEAF is to:",
      options: ["Tree", "Green", "Branch", "Root"],
      correct_answer: "Branch",
      explanation: "A finger is part of a hand, just as a leaf is part of a branch.",
      relationship_type: "part/whole"
    }
  ],

  // Pool 2: Advanced Relationships
  advancedRelationships: [
    {
      id: "ana_adv_001",
      question_text: "SYMPHONY is to COMPOSER as NOVEL is to:",
      options: ["Reader", "Author", "Publisher", "Library"],
      correct_answer: "Author",
      explanation: "A composer creates a symphony, just as an author creates a novel.",
      relationship_type: "creator/creation"
    },
    {
      id: "ana_adv_002",
      question_text: "DROUGHT is to FAMINE as EXERCISE is to:",
      options: ["Gym", "Health", "Muscle", "Fatigue"],
      correct_answer: "Health",
      explanation: "Drought can lead to famine (negative consequence), just as exercise can lead to health (positive consequence).",
      relationship_type: "cause/effect"
    },
    {
      id: "ana_adv_003",
      question_text: "MICROSCOPE is to BACTERIA as TELESCOPE is to:",
      options: ["Astronomer", "Stars", "Laboratory", "Space"],
      correct_answer: "Stars",
      explanation: "A microscope is used to observe bacteria (very small things), just as a telescope is used to observe stars (very distant things).",
      relationship_type: "tool/object_observed"
    }
  ]
};

// ==========================================
// QUESTION SELECTION ALGORITHMS
// ==========================================

/**
 * Randomly selects questions from multiple pools to create a test
 * @param {Object} pools - Object containing question pools
 * @param {number} totalQuestions - Total number of questions needed
 * @param {Object} distribution - How to distribute questions across pools
 * @returns {Array} Array of selected questions
 */
export const selectRandomQuestions = (pools, totalQuestions, distribution = {}) => {
  const selectedQuestions = [];
  const usedQuestionIds = new Set();

  // Default distribution if not provided
  const defaultDistribution = {
    scienceNature: 0.4,
    businessEconomics: 0.3,
    historyCulture: 0.3
  };

  const finalDistribution = { ...defaultDistribution, ...distribution };

  // Calculate questions per pool
  Object.entries(finalDistribution).forEach(([poolName, percentage]) => {
    const questionsFromPool = Math.floor(totalQuestions * percentage);
    const pool = pools[poolName];

    if (pool && pool.length > 0) {
      // Shuffle pool and select questions
      const shuffledPool = [...pool].sort(() => Math.random() - 0.5);
      const selectedFromPool = shuffledPool.slice(0, Math.min(questionsFromPool, pool.length));
      
      selectedFromPool.forEach(passage => {
        if (!usedQuestionIds.has(passage.id)) {
          selectedQuestions.push(passage);
          usedQuestionIds.add(passage.id);
        }
      });
    }
  });

  // Fill remaining slots if needed
  const remainingSlots = totalQuestions - selectedQuestions.length;
  if (remainingSlots > 0) {
    const allPools = Object.values(pools).flat();
    const availableQuestions = allPools.filter(q => !usedQuestionIds.has(q.id));
    const shuffledAvailable = availableQuestions.sort(() => Math.random() - 0.5);
    
    selectedQuestions.push(...shuffledAvailable.slice(0, remainingSlots));
  }

  return selectedQuestions.slice(0, totalQuestions);
};

/**
 * Generates a randomized verbal reasoning test
 * @param {string} testType - 'reading_comprehension' or 'verbal_analogies'
 * @param {number} questionCount - Number of questions to include
 * @param {string} difficulty - 'basic', 'intermediate', 'advanced'
 * @returns {Object} Complete test object
 */
export const generateRandomizedTest = (testType = 'reading_comprehension', questionCount = 20, difficulty = 'intermediate') => {
  let selectedQuestions = [];
  
  if (testType === 'reading_comprehension') {
    const distribution = difficulty === 'basic' 
      ? { scienceNature: 0.6, businessEconomics: 0.2, historyCulture: 0.2 }
      : difficulty === 'advanced'
      ? { scienceNature: 0.3, businessEconomics: 0.4, historyCulture: 0.3 }
      : { scienceNature: 0.4, businessEconomics: 0.3, historyCulture: 0.3 }; // intermediate
    
    selectedQuestions = selectRandomQuestions(readingComprehensionPools, questionCount, distribution);
  } else if (testType === 'verbal_analogies') {
    const analogyPool = difficulty === 'basic' 
      ? verbalAnalogyPools.basicRelationships
      : [...verbalAnalogyPools.basicRelationships, ...verbalAnalogyPools.advancedRelationships];
    
    const shuffled = [...analogyPool].sort(() => Math.random() - 0.5);
    selectedQuestions = shuffled.slice(0, Math.min(questionCount, shuffled.length));
  }

  return {
    id: `randomized_${testType}_${Date.now()}`,
    title: `Randomized ${testType.replace('_', ' ').toUpperCase()} Test`,
    description: `Dynamically generated test with ${questionCount} questions`,
    duration_minutes: Math.ceil(questionCount * 1.5), // 1.5 minutes per question
    difficulty,
    question_type: testType,
    total_questions: questionCount,
    questions: selectedQuestions,
    generated_at: new Date().toISOString(),
    intro_text: {
      title: `RANDOMIZED ${testType.replace('_', ' ').toUpperCase()} TEST`,
      instructions: [
        "Instructions",
        "",
        `This test contains ${questionCount} randomly selected questions.`,
        "",
        "Each question is unique and selected from a large pool to ensure test integrity.",
        "",
        "Answer all questions to the best of your ability based on the information provided.",
        "",
        "Click Next to begin the test."
      ]
    }
  };
};

// ==========================================
// TEST DIFFICULTY SCALING
// ==========================================

export const difficultyLevels = {
  basic: {
    readingComprehension: {
      passageLength: 'short', // 100-200 words
      vocabularyLevel: 'basic',
      conceptComplexity: 'simple',
      questionTypes: ['direct_fact', 'simple_inference']
    },
    verbalAnalogies: {
      relationshipTypes: ['synonym', 'antonym', 'part_whole', 'function'],
      vocabularyLevel: 'basic'
    }
  },
  intermediate: {
    readingComprehension: {
      passageLength: 'medium', // 200-300 words
      vocabularyLevel: 'intermediate',
      conceptComplexity: 'moderate',
      questionTypes: ['direct_fact', 'inference', 'main_idea', 'tone']
    },
    verbalAnalogies: {
      relationshipTypes: ['all_basic', 'cause_effect', 'creator_creation'],
      vocabularyLevel: 'intermediate'
    }
  },
  advanced: {
    readingComprehension: {
      passageLength: 'long', // 300+ words
      vocabularyLevel: 'advanced',
      conceptComplexity: 'complex',
      questionTypes: ['complex_inference', 'critical_reasoning', 'assumption_identification']
    },
    verbalAnalogies: {
      relationshipTypes: ['abstract_relationships', 'multiple_step_reasoning'],
      vocabularyLevel: 'advanced'
    }
  }
};
