// Simple Question Pool System for VRT1, VRT2, VRT3
// Each test randomly selects from a large pool of questions

// ==========================================
// LARGE QUESTION POOLS BY DIFFICULTY
// ==========================================

// VRT1 Pool - Basic Level (Science & Nature focused)
export const vrt1QuestionPool = [
  // Pool 1: Birds and Flight Evolution (original)
  {
    id: "vrt1_001",
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
        explanation: `The passage states that "the evolution of powered flight in birds is still debated" and "Further research is required."`
      }
    ]
  },

  // Pool 2: Ocean Currents
  {
    id: "vrt1_002",
    passage_title: "Ocean Currents and Climate",
    passage_text: `Ocean currents play a crucial role in regulating Earth's climate by transporting warm and cold water around the globe. The Gulf Stream, for example, carries warm water from the tropical Atlantic to the North Atlantic, moderating temperatures in Western Europe. Without this current, countries like the United Kingdom would experience much colder winters. Scientists have observed that climate change is affecting ocean current patterns, with some currents slowing down or changing direction. This could have significant implications for global weather patterns and regional climates.`,
    questions: [
      {
        id: 1,
        question_text: `The Gulf Stream makes Western European winters warmer than they would otherwise be.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "True",
        explanation: `The passage states the Gulf Stream "carries warm water... moderating temperatures in Western Europe."`
      },
      {
        id: 2,
        question_text: `Climate change has stopped all ocean currents.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "False",
        explanation: `The passage says some currents are "slowing down or changing direction," not that all have stopped.`
      },
      {
        id: 3,
        question_text: `The United Kingdom would have colder winters without the Gulf Stream.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "True",
        explanation: `The passage explicitly states this: "Without this current, countries like the United Kingdom would experience much colder winters."`
      }
    ]
  },

  // Pool 3: Plant Photosynthesis
  {
    id: "vrt1_003", 
    passage_title: "Photosynthesis in Plants",
    passage_text: `Photosynthesis is the process by which plants convert sunlight, carbon dioxide, and water into glucose and oxygen. This process occurs primarily in the leaves, specifically in specialized cells called chloroplasts that contain chlorophyll. Chlorophyll absorbs light energy, particularly red and blue wavelengths, while reflecting green light, which is why plants appear green. The Calvin cycle uses the energy captured during light reactions to convert carbon dioxide into glucose. This process is essential for life on Earth as it produces the oxygen we breathe.`,
    questions: [
      {
        id: 1,
        question_text: `Plants appear green because chlorophyll absorbs green light.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "False",
        explanation: `The passage states chlorophyll "reflects green light," not absorbs it.`
      },
      {
        id: 2,
        question_text: `Photosynthesis produces both glucose and oxygen.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "True",
        explanation: `The passage clearly states photosynthesis converts materials "into glucose and oxygen."`
      },
      {
        id: 3,
        question_text: `Photosynthesis only occurs in plant roots.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "False",
        explanation: `The passage states photosynthesis "occurs primarily in the leaves."`
      }
    ]
  },

  // Pool 4: Animal Migration
  {
    id: "vrt1_004",
    passage_title: "Animal Migration Patterns",
    passage_text: `Many animals migrate vast distances each year in response to seasonal changes, food availability, and breeding requirements. Arctic terns hold the record for the longest migration, traveling roughly 44,000 miles annually from Arctic to Antarctic and back. Migration requires extraordinary navigation skills, with animals using various cues including magnetic fields, star patterns, and geographical landmarks. Climate change is increasingly affecting traditional migration routes, forcing some species to adapt their patterns or face population decline.`,
    questions: [
      {
        id: 1,
        question_text: `Arctic terns migrate the furthest distance of any animal.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "True",
        explanation: `The passage states "Arctic terns hold the record for the longest migration."`
      },
      {
        id: 2,
        question_text: `All animals migrate for the same reasons.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "False",
        explanation: `The passage lists multiple reasons: "seasonal changes, food availability, and breeding requirements."`
      },
      {
        id: 3,
        question_text: `Climate change has no effect on animal migration.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "False",
        explanation: `The passage states "Climate change is increasingly affecting traditional migration routes."`
      }
    ]
  },

  // Pool 5: Honeybee Communication
  {
    id: "vrt1_005",
    passage_title: "Honeybee Communication",
    passage_text: `Honeybees have developed a sophisticated communication system to share information about food sources with their hive mates. When a worker bee discovers a rich source of nectar, it returns to the hive and performs a "waggle dance" to communicate the location to other bees. The dance includes information about direction, distance, and quality of the food source. The angle of the dance relative to vertical indicates the direction relative to the sun, while the duration of the waggle run indicates the distance to the food source.`,
    questions: [
      {
        id: 1,
        question_text: `Honeybees use dancing to communicate about food sources.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "True",
        explanation: `The passage describes how bees perform a "waggle dance" to communicate location information.`
      },
      {
        id: 2,
        question_text: `The waggle dance only indicates the direction to food.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "False",
        explanation: `The passage states the dance includes "direction, distance, and quality of the food source."`
      },
      {
        id: 3,
        question_text: `All bees in the hive perform the waggle dance.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "Cannot Say",
        explanation: `The passage only mentions that "worker bees" perform the dance when they discover food.`
      }
    ]
  },

  // Pool 6: Volcanic Activity
  {
    id: "vrt1_006",
    passage_title: "Volcanic Activity and Formation",
    passage_text: `Volcanoes form when magma from the Earth's mantle reaches the surface through cracks in the crust. There are three main types of volcanoes: shield volcanoes, which have gentle slopes and produce fluid lava; stratovolcanoes, which are steep-sided and produce explosive eruptions; and cinder cones, which are small and short-lived. Volcanic eruptions can have both destructive and beneficial effects. While they can destroy property and endanger lives, volcanic soil is extremely fertile and supports agriculture in many regions.`,
    questions: [
      {
        id: 1,
        question_text: `There are exactly three types of volcanoes.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "Cannot Say",
        explanation: `The passage mentions "three main types" but doesn't state these are the only types.`
      },
      {
        id: 2,
        question_text: `Volcanic eruptions are always destructive.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "False",
        explanation: `The passage mentions both "destructive and beneficial effects," including fertile soil.`
      },
      {
        id: 3,
        question_text: `Shield volcanoes have gentle slopes.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "True",
        explanation: `The passage directly states that shield volcanoes "have gentle slopes."`
      }
    ]
  }
];

// VRT2 Pool - Intermediate Level (Mixed topics with business focus)
export const vrt2QuestionPool = [
  // Pool 1: Work-related Stress (original)
  {
    id: "vrt2_001",
    passage_title: "Work-related Stress and Productivity",
    passage_text: `Work-related stress has become a significant concern in modern workplaces, affecting both employee wellbeing and organizational productivity. Studies show that moderate levels of stress can actually enhance performance by increasing focus and motivation. However, chronic stress leads to burnout, decreased creativity, and higher absenteeism rates. Companies are increasingly implementing stress management programs, flexible working arrangements, and mental health support to address this issue. The key is finding the right balance between challenging employees and overwhelming them.`,
    questions: [
      {
        id: 1,
        question_text: `All work-related stress is harmful to productivity.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "False",
        explanation: `The passage states "moderate levels of stress can actually enhance performance."`
      },
      {
        id: 2,
        question_text: `Companies are implementing programs to manage employee stress.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "True",
        explanation: `The passage mentions companies "implementing stress management programs, flexible working arrangements, and mental health support."`
      },
      {
        id: 3,
        question_text: `Chronic stress always leads to employee resignation.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "Cannot Say",
        explanation: `The passage mentions burnout and absenteeism but doesn't specifically mention resignation.`
      }
    ]
  },

  // Pool 2: Digital Marketing Trends
  {
    id: "vrt2_002",
    passage_title: "Digital Marketing Evolution",
    passage_text: `The digital marketing landscape has transformed dramatically over the past decade. Social media platforms have become primary channels for brand engagement, with influencer marketing emerging as a powerful tool for reaching younger demographics. However, consumers are becoming increasingly skeptical of traditional advertising methods and prefer authentic, personalized content. Companies must now focus on building genuine relationships with customers through valuable content and transparent communication rather than purely promotional messaging.`,
    questions: [
      {
        id: 1,
        question_text: `Social media is now a primary channel for brand engagement.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "True",
        explanation: `The passage explicitly states "Social media platforms have become primary channels for brand engagement."`
      },
      {
        id: 2,
        question_text: `All consumers prefer traditional advertising methods.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "False",
        explanation: `The passage states consumers "are becoming increasingly skeptical of traditional advertising methods."`
      },
      {
        id: 3,
        question_text: `Influencer marketing only works for older demographics.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "False",
        explanation: `The passage mentions influencer marketing is "powerful for reaching younger demographics."`
      }
    ]
  },

  // Pool 3: Remote Work Culture
  {
    id: "vrt2_003",
    passage_title: "Remote Work and Team Dynamics",
    passage_text: `The shift to remote work has fundamentally changed how teams collaborate and maintain company culture. While remote work offers flexibility and can increase productivity for many individuals, it also presents challenges in team cohesion and informal knowledge sharing. Companies successful in remote work environments invest heavily in digital collaboration tools and create structured opportunities for team interaction. The key is maintaining the human element while leveraging technology to enable effective virtual collaboration.`,
    questions: [
      {
        id: 1,
        question_text: `Remote work always increases productivity.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "Cannot Say",
        explanation: `The passage says remote work "can increase productivity for many individuals" but not that it always does.`
      },
      {
        id: 2,
        question_text: `Successful remote companies invest in digital collaboration tools.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "True",
        explanation: `The passage states successful companies "invest heavily in digital collaboration tools."`
      },
      {
        id: 3,
        question_text: `Remote work has no impact on team cohesion.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "False",
        explanation: `The passage mentions remote work "presents challenges in team cohesion."`
      }
    ]
  },

  // Pool 4: Sustainable Business Practices  
  {
    id: "vrt2_004",
    passage_title: "Corporate Sustainability Initiatives",
    passage_text: `Businesses are increasingly adopting sustainable practices not only to meet regulatory requirements but also to appeal to environmentally conscious consumers. Sustainable initiatives range from reducing carbon footprints and waste management to ethical sourcing and renewable energy adoption. While implementing these practices often requires significant upfront investment, many companies report long-term cost savings and improved brand reputation. Consumer surveys indicate that sustainability is becoming a key factor in purchasing decisions, particularly among younger generations.`,
    questions: [
      {
        id: 1,
        question_text: `Companies adopt sustainable practices only to meet regulations.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "False",
        explanation: `The passage states companies adopt practices "not only to meet regulatory requirements but also to appeal to environmentally conscious consumers."`
      },
      {
        id: 2,
        question_text: `Sustainable practices require upfront investment.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "True",
        explanation: `The passage mentions "implementing these practices often requires significant upfront investment."`
      },
      {
        id: 3,
        question_text: `All age groups consider sustainability equally important in purchasing.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "False",
        explanation: `The passage specifically mentions sustainability is important "particularly among younger generations."`
      }
    ]
  },

  // Pool 5: Artificial Intelligence in Business
  {
    id: "vrt2_005",
    passage_title: "AI Integration in Modern Business",
    passage_text: `Artificial intelligence is transforming business operations across industries, from customer service chatbots to predictive analytics for supply chain management. Companies implementing AI solutions report improved efficiency and cost reduction, but also face challenges related to employee training and data security. The success of AI implementation largely depends on having clear objectives, quality data, and employee buy-in. Organizations that view AI as a tool to augment human capabilities rather than replace workers tend to achieve better outcomes.`,
    questions: [
      {
        id: 1,
        question_text: `AI implementation always reduces costs for businesses.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "Cannot Say",
        explanation: `The passage says companies "report" cost reduction but doesn't state this is universal.`
      },
      {
        id: 2,
        question_text: `Successful AI implementation requires clear objectives.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "True",
        explanation: `The passage states success "largely depends on having clear objectives, quality data, and employee buy-in."`
      },
      {
        id: 3,
        question_text: `AI should replace all human workers.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "False",
        explanation: `The passage suggests organizations that view AI "as a tool to augment human capabilities rather than replace workers" achieve better outcomes.`
      }
    ]
  },

  // Pool 6: E-commerce Growth
  {
    id: "vrt2_006",
    passage_title: "E-commerce Market Expansion",
    passage_text: `The e-commerce sector has experienced unprecedented growth, accelerated by changing consumer behaviors and technological advancements. Mobile commerce, in particular, has become dominant, with consumers increasingly making purchases through smartphones and tablets. However, this growth has intensified competition, forcing businesses to focus on user experience, fast delivery, and personalized customer service. Traditional brick-and-mortar retailers are adapting by developing omnichannel strategies that integrate online and offline experiences.`,
    questions: [
      {
        id: 1,
        question_text: `Mobile commerce has become the dominant form of e-commerce.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "True",
        explanation: `The passage states "Mobile commerce, in particular, has become dominant."`
      },
      {
        id: 2,
        question_text: `E-commerce growth has reduced competition among businesses.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "False",
        explanation: `The passage states growth "has intensified competition."`
      },
      {
        id: 3,
        question_text: `All traditional retailers have closed their physical stores.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "False",
        explanation: `The passage mentions traditional retailers are "developing omnichannel strategies that integrate online and offline experiences."`
      }
    ]
  }
];

// VRT3 Pool - Advanced Level (Business and professional focus)
export const vrt3QuestionPool = [
  // Pool 1: Team Management (original)
  {
    id: "vrt3_001",
    passage_title: "Effective Team Management in Modern Organizations",
    passage_text: `Effective team management in today's dynamic business environment requires a delicate balance of leadership skills, emotional intelligence, and strategic thinking. Successful team leaders must adapt their management style to individual team members' needs while maintaining clear objectives and accountability standards. Research indicates that teams with high psychological safety—where members feel comfortable taking risks and making mistakes—consistently outperform those operating in fear-based environments. The most effective leaders foster open communication, encourage diverse perspectives, and create an environment where innovation can flourish.`,
    questions: [
      {
        id: 1,
        question_text: `Effective team management requires adapting leadership style to individual needs.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "True",
        explanation: `The passage states leaders "must adapt their management style to individual team members' needs."`
      },
      {
        id: 2,
        question_text: `Teams with high psychological safety always achieve perfect results.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "Cannot Say",
        explanation: `The passage says these teams "consistently outperform" others but doesn't mention perfect results.`
      },
      {
        id: 3,
        question_text: `Fear-based environments lead to better team performance.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "False",
        explanation: `The passage indicates teams with psychological safety "outperform those operating in fear-based environments."`
      }
    ]
  },

  // Pool 2: Strategic Planning
  {
    id: "vrt3_002",
    passage_title: "Strategic Planning in Uncertain Markets",
    passage_text: `Strategic planning in today's volatile business environment requires organizations to balance long-term vision with short-term agility. Companies that excel in uncertain markets develop scenario-based planning frameworks that allow them to pivot quickly when conditions change. This approach involves creating multiple strategic pathways and maintaining the flexibility to switch between them as market conditions evolve. The most successful organizations also invest in continuous market intelligence and maintain strong stakeholder relationships that provide early warning signals of potential disruptions.`,
    questions: [
      {
        id: 1,
        question_text: `Strategic planning should focus only on long-term objectives.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "False",
        explanation: `The passage emphasizes the need to "balance long-term vision with short-term agility."`
      },
      {
        id: 2,
        question_text: `Successful companies use scenario-based planning frameworks.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "True",
        explanation: `The passage states companies that excel "develop scenario-based planning frameworks."`
      },
      {
        id: 3,
        question_text: `Market intelligence is unnecessary for strategic planning.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "False",
        explanation: `The passage mentions successful organizations "invest in continuous market intelligence."`
      }
    ]
  },

  // Pool 3: Innovation Management
  {
    id: "vrt3_003",
    passage_title: "Managing Innovation in Large Corporations",
    passage_text: `Large corporations face unique challenges when fostering innovation due to established processes, risk-averse cultures, and bureaucratic structures. However, companies that successfully innovate often create separate innovation units or partnerships with startups to maintain entrepreneurial agility. They also implement internal venture capital programs and establish clear metrics for measuring innovation success. The key is creating an organizational culture that tolerates failure as a learning opportunity while maintaining operational excellence in core business functions.`,
    questions: [
      {
        id: 1,
        question_text: `Large corporations always struggle with innovation due to their size.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "Cannot Say",
        explanation: `The passage mentions challenges but also describes how some companies "successfully innovate."`
      },
      {
        id: 2,
        question_text: `Successful innovative companies often partner with startups.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "True",
        explanation: `The passage mentions companies "create separate innovation units or partnerships with startups."`
      },
      {
        id: 3,
        question_text: `Innovation requires abandoning operational excellence.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "False",
        explanation: `The passage mentions maintaining "operational excellence in core business functions" alongside innovation.`
      }
    ]
  }
];

// ==========================================
// RANDOMIZATION FUNCTIONS
// ==========================================

/**
 * Randomly select passages for a VRT test
 * @param {Array} questionPool - The pool to select from
 * @param {number} count - Number of passages to select (default 5)
 * @returns {Array} Selected passages
 */
export const selectRandomPassages = (questionPool, count = 5) => {
  // Create a copy of the pool and shuffle it
  const shuffledPool = [...questionPool].sort(() => Math.random() - 0.5);
  
  // Select the first 'count' passages
  const selectedPassages = shuffledPool.slice(0, Math.min(count, shuffledPool.length));
  
  // Renumber the passages to be sequential (1, 2, 3, etc.)
  return selectedPassages.map((passage, index) => ({
    ...passage,
    id: index + 1, // Sequential numbering for display
    originalId: passage.id // Keep original ID for tracking
  }));
};

/**
 * Generate randomized VRT1 test
 */
export const getRandomizedVRT1 = () => {
  const selectedPassages = selectRandomPassages(vrt1QuestionPool, 5);
  
  return {
    id: 1,
    title: "Verbal Reasoning Test 1",
    description: "Reading comprehension with True/False/Cannot Say questions",
    duration_minutes: 20,
    intro_image: "/src/assets/images/verbal/instructions/section_1_intro.png",
    intro_text: {
      title: "VERBAL REASONING TEST 1",
      instructions: [
        "Instructions",
        "",
        "This verbal reasoning test comprises 20 questions and you will have 20 minutes in which to correctly answer as many as you can.",
        "",
        "In each question you will be presented with a short comprehension passage followed by three or four questions. You will need to determine which answer is correct based on the information provided in the passages only.",
        "",
        "You will have to work quickly and accurately to perform well in this test. If you don't know the answer to a question, leave it and come back to it if you have time.",
        "",
        "You can submit your test at any time. If the time limit is up before you click submit the test will automatically be submitted with the answers you have selected. It is recommended to keep working until the time limit is up.",
        "",
        "Try to find a time and place where you will not be interrupted during the test. The test will start on the next page."
      ]
    },
    question_type: "verbal_reasoning",
    total_questions: selectedPassages.reduce((total, passage) => total + passage.questions.length, 0),
    questions: selectedPassages,
    _meta: {
      randomized: true,
      selectedFrom: vrt1QuestionPool.length,
      generatedAt: new Date().toISOString()
    }
  };
};

/**
 * Generate randomized VRT2 test
 */
export const getRandomizedVRT2 = () => {
  const selectedPassages = selectRandomPassages(vrt2QuestionPool, 6);
  
  return {
    id: 2,
    title: "Verbal Reasoning Test 2", 
    description: "Reading comprehension with varied business and professional topics",
    duration_minutes: 20,
    intro_image: "/src/assets/images/verbal/instructions/section_2_intro.png",
    intro_text: {
      title: "VERBAL REASONING TEST 2",
      instructions: [
        "Instructions",
        "",
        "This verbal reasoning test comprises questions based on business and professional scenarios. You will have 20 minutes to complete the test.",
        "",
        "Read each passage carefully and answer the questions based solely on the information provided. Each question has three possible answers: True, False, or Cannot Say.",
        "",
        "Work efficiently and make sure to answer all questions. You cannot return to previous questions once you move forward.",
        "",
        "The test will start on the next page."
      ]
    },
    question_type: "verbal_reasoning",
    total_questions: selectedPassages.reduce((total, passage) => total + passage.questions.length, 0),
    questions: selectedPassages,
    _meta: {
      randomized: true,
      selectedFrom: vrt2QuestionPool.length,
      generatedAt: new Date().toISOString()
    }
  };
};

/**
 * Generate randomized VRT3 test  
 */
export const getRandomizedVRT3 = () => {
  const selectedPassages = selectRandomPassages(vrt3QuestionPool, 7);
  
  return {
    id: 3,
    title: "Verbal Reasoning Test 3",
    description: "Advanced reading comprehension with business and management focus", 
    duration_minutes: 20,
    intro_image: "/src/assets/images/verbal/instructions/section_3_intro.png",
    intro_text: {
      title: "VERBAL REASONING TEST 3",
      instructions: [
        "Instructions",
        "",
        "This advanced verbal reasoning test focuses on business and management scenarios. You will have 20 minutes to complete the test.",
        "",
        "The passages are more complex and require careful analysis. Answer each question based only on the information provided in the passage.",
        "",
        "This test evaluates your ability to understand complex business concepts and make logical inferences.",
        "",
        "Take your time to read each passage thoroughly before answering the questions.",
        "",
        "The test will start on the next page."
      ]
    },
    question_type: "verbal_reasoning",
    total_questions: selectedPassages.reduce((total, passage) => total + passage.questions.length, 0),
    questions: selectedPassages,
    _meta: {
      randomized: true,
      selectedFrom: vrt3QuestionPool.length,
      generatedAt: new Date().toISOString()
    }
  };
};
