// Verbal Reasoning Test Categories
// This file organizes different types of verbal reasoning tests into categories

// ==========================================
// CATEGORY 1: READING COMPREHENSION
// ==========================================

// Reading Comprehension - Basic Level (VRT1)
export const readingComprehensionBasic = [
  // Pool 1: Birds and Flight Evolution
  {
    id: "reading_basic_001",
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

  // Pool 2: Ocean Currents and Climate
  {
    id: "reading_basic_002",
    passage_title: "Ocean Currents and Climate",
    passage_text: `Ocean currents play a crucial role in regulating Earth's climate by transporting warm and cold water around the globe. The Gulf Stream, for example, carries warm water from the tropical Atlantic to the North Atlantic, moderating temperatures in Western Europe. Without this current, countries like the United Kingdom would experience much colder winters. Scientists have observed that climate change is affecting ocean current patterns, with some currents slowing down or changing direction. This could have significant implications for global weather patterns and regional climates.`,
    questions: [
      {
        id: 1,
        question_text: `The Gulf Stream makes Western European winters warmer than they would otherwise be.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "True",
        explanation: `The passage states that the Gulf Stream moderates temperatures in Western Europe and without it, countries like the UK would experience much colder winters.`
      },
      {
        id: 2,
        question_text: `Climate change has no effect on ocean currents.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "False",
        explanation: `The passage explicitly states that "climate change is affecting ocean current patterns."`
      },
      {
        id: 3,
        question_text: `All ocean currents carry warm water.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "False",
        explanation: `The passage mentions that ocean currents transport both "warm and cold water" around the globe.`
      }
    ]
  },

  // Pool 3: Photosynthesis Process
  {
    id: "reading_basic_003",
    passage_title: "Photosynthesis in Plants",
    passage_text: `Photosynthesis is the process by which plants convert sunlight into chemical energy. During this process, plants absorb carbon dioxide from the air and water from the soil through their roots. Using chlorophyll in their leaves, plants capture sunlight and combine these ingredients to produce glucose and oxygen. The glucose serves as food for the plant, while oxygen is released into the atmosphere as a byproduct. This process is essential for life on Earth, as it provides oxygen for most living organisms and forms the base of most food chains.`,
    questions: [
      {
        id: 1,
        question_text: `Plants absorb water through their leaves.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "False",
        explanation: `The passage states that plants absorb water "from the soil through their roots," not through their leaves.`
      },
      {
        id: 2,
        question_text: `Oxygen is a waste product of photosynthesis.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "True",
        explanation: `The passage describes oxygen as being "released into the atmosphere as a byproduct" of photosynthesis.`
      },
      {
        id: 3,
        question_text: `Chlorophyll is found in plant roots.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "False",
        explanation: `The passage states that plants use "chlorophyll in their leaves" to capture sunlight.`
      }
    ]
  },

  // Pool 4: Sleep and Memory
  {
    id: "reading_basic_004",
    passage_title: "Sleep and Memory Formation",
    passage_text: `Sleep plays a vital role in memory consolidation, the process by which short-term memories are strengthened and converted into long-term memories. During sleep, particularly during deep sleep phases, the brain replays and processes information from the day. This process helps organize memories and integrate new information with existing knowledge. Research has shown that people who get adequate sleep after learning new information perform better on memory tests than those who are sleep-deprived. The brain literally clears out unnecessary information while strengthening important memories during sleep.`,
    questions: [
      {
        id: 1,
        question_text: `Memory consolidation only occurs during deep sleep.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "Cannot Say",
        explanation: `The passage mentions that memory consolidation occurs "particularly during deep sleep phases" but doesn't state it ONLY occurs then.`
      },
      {
        id: 2,
        question_text: `Sleep-deprived people perform worse on memory tests.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "True",
        explanation: `The passage states that people with adequate sleep "perform better on memory tests than those who are sleep-deprived."`
      },
      {
        id: 3,
        question_text: `The brain processes information from the day during sleep.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "True",
        explanation: `The passage explicitly states that "the brain replays and processes information from the day" during sleep.`
      }
    ]
  },

  // Pool 5: Renewable Energy
  {
    id: "reading_basic_005",
    passage_title: "Solar Energy Technology",
    passage_text: `Solar panels work by converting sunlight directly into electricity through photovoltaic cells. These cells are made of semiconductor materials, typically silicon, which release electrons when struck by photons from sunlight. This creates an electric current that can be used to power homes and businesses. Solar energy is considered renewable because the sun provides a virtually unlimited source of energy. However, solar panels are less efficient on cloudy days and cannot generate electricity at night, which is why many solar installations include battery storage systems to store excess energy for later use.`,
    questions: [
      {
        id: 1,
        question_text: `Solar panels work equally well in all weather conditions.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "False",
        explanation: `The passage states that "solar panels are less efficient on cloudy days and cannot generate electricity at night."`
      },
      {
        id: 2,
        question_text: `Silicon is commonly used in photovoltaic cells.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "True",
        explanation: `The passage mentions that photovoltaic cells are "made of semiconductor materials, typically silicon."`
      },
      {
        id: 3,
        question_text: `Battery storage systems are mandatory for all solar installations.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "Cannot Say",
        explanation: `The passage mentions that "many solar installations include battery storage systems" but doesn't state they are mandatory for all.`
      }
    ]
  },

  // Pool 6: Ecosystem Balance
  {
    id: "reading_basic_006",
    passage_title: "Predator-Prey Relationships",
    passage_text: `In natural ecosystems, predator-prey relationships help maintain ecological balance. When predator populations increase, they hunt more prey, which can cause prey populations to decrease. As prey becomes scarcer, predators face food shortages, leading to a decline in predator populations. This allows prey populations to recover, which eventually supports larger predator populations again. This cyclical pattern helps prevent any single species from dominating an ecosystem. Human activities, such as hunting or habitat destruction, can disrupt these natural cycles and lead to ecological imbalances.`,
    questions: [
      {
        id: 1,
        question_text: `Predator and prey populations always increase at the same time.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "False",
        explanation: `The passage describes a cyclical pattern where when one population increases, the other typically decreases.`
      },
      {
        id: 2,
        question_text: `Human activities can disrupt natural predator-prey cycles.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "True",
        explanation: `The passage explicitly states that "Human activities, such as hunting or habitat destruction, can disrupt these natural cycles."`
      },
      {
        id: 3,
        question_text: `Predator-prey relationships prevent species dominance.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "True",
        explanation: `The passage states that "This cyclical pattern helps prevent any single species from dominating an ecosystem."`
      }
    ]
  }
];

// Reading Comprehension - Intermediate Level (VRT2)
export const readingComprehensionIntermediate = [
  // Pool 1: Business Strategy
  {
    id: "reading_intermediate_001",
    passage_title: "Digital Transformation in Business",
    passage_text: `Digital transformation has become a critical priority for businesses across all industries. Companies that fail to adapt to digital technologies risk becoming obsolete in today's rapidly evolving market. Successful digital transformation requires more than just implementing new technologies; it demands a fundamental shift in organizational culture, processes, and mindset. Leadership commitment is essential, as digital transformation affects every aspect of a business, from customer interactions to internal operations. Companies must also invest in training their workforce to effectively use new digital tools and platforms. Research indicates that organizations with strong digital transformation strategies achieve higher customer satisfaction rates and improved operational efficiency compared to their less digitally mature competitors.`,
    questions: [
      {
        id: 1,
        question_text: `Digital transformation only involves implementing new technologies.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "False",
        explanation: `The passage states that successful digital transformation "requires more than just implementing new technologies; it demands a fundamental shift in organizational culture, processes, and mindset."`
      },
      {
        id: 2,
        question_text: `Leadership commitment is necessary for successful digital transformation.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "True",
        explanation: `The passage explicitly states that "Leadership commitment is essential" for digital transformation.`
      },
      {
        id: 3,
        question_text: `All companies that undergo digital transformation achieve higher customer satisfaction.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "Cannot Say",
        explanation: `The passage mentions that organizations with "strong digital transformation strategies" achieve higher satisfaction, but doesn't guarantee this for all companies undergoing transformation.`
      }
    ]
  },

  // Pool 2: Market Analysis
  {
    id: "reading_intermediate_002",
    passage_title: "Consumer Behavior Trends",
    passage_text: `Consumer behavior has undergone significant changes in recent years, particularly accelerated by the global pandemic. There has been a notable shift toward online shopping, with e-commerce sales growing by over 30% in many markets. Consumers are increasingly valuing convenience, sustainability, and personalized experiences. Brands that can effectively combine these elements are seeing stronger customer loyalty and higher profit margins. However, this shift has also increased consumer expectations regarding delivery speed, product quality, and customer service. Companies that cannot meet these elevated expectations risk losing market share to more agile competitors. Additionally, younger consumers are showing preference for brands that demonstrate social responsibility and environmental consciousness.`,
    questions: [
      {
        id: 1,
        question_text: `E-commerce sales decreased during the pandemic.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "False",
        explanation: `The passage states that there has been "a notable shift toward online shopping, with e-commerce sales growing by over 30% in many markets."`
      },
      {
        id: 2,
        question_text: `Consumer expectations have increased in recent years.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "True",
        explanation: `The passage mentions "this shift has also increased consumer expectations regarding delivery speed, product quality, and customer service."`
      },
      {
        id: 3,
        question_text: `All younger consumers prefer socially responsible brands.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "Cannot Say",
        explanation: `The passage states younger consumers are "showing preference" for such brands, but doesn't say all younger consumers have this preference.`
      }
    ]
  },

  // Pool 3: Project Management
  {
    id: "reading_intermediate_003",
    passage_title: "Agile Project Management",
    passage_text: `Agile project management has revolutionized how teams approach complex projects. Unlike traditional waterfall methodologies that follow a linear sequence, agile emphasizes iterative development, frequent feedback, and adaptability to change. Agile teams work in short cycles called sprints, typically lasting 2-4 weeks, allowing for rapid prototyping and continuous improvement. This approach enables teams to respond quickly to changing requirements and stakeholder feedback. However, agile methodology requires strong communication skills, collaborative mindset, and experienced team members who can work effectively with minimal supervision. Organizations implementing agile often report improved project delivery times and higher client satisfaction, though the transition period can be challenging for teams accustomed to traditional project management approaches.`,
    questions: [
      {
        id: 1,
        question_text: `Agile methodology follows a linear development sequence.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "False",
        explanation: `The passage states that "Unlike traditional waterfall methodologies that follow a linear sequence, agile emphasizes iterative development."`
      },
      {
        id: 2,
        question_text: `Agile sprints typically last 2-4 weeks.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "True",
        explanation: `The passage explicitly states that "Agile teams work in short cycles called sprints, typically lasting 2-4 weeks."`
      },
      {
        id: 3,
        question_text: `All organizations find agile implementation easy.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "False",
        explanation: `The passage mentions that "the transition period can be challenging for teams accustomed to traditional project management approaches."`
      }
    ]
  },

  // Pool 4: Financial Planning
  {
    id: "reading_intermediate_004",
    passage_title: "Investment Portfolio Diversification",
    passage_text: `Portfolio diversification is a fundamental principle of investment strategy designed to reduce risk while maintaining potential for returns. By spreading investments across different asset classes, industries, and geographical regions, investors can minimize the impact of poor performance in any single investment. The concept is based on the idea that different investments often perform differently under various market conditions. For example, when stocks decline, bonds might remain stable or even increase in value. However, diversification does not guarantee profits or protect against all losses, particularly in severe market downturns when most asset classes may decline simultaneously. Effective diversification requires careful analysis of correlation between different investments and regular portfolio rebalancing to maintain desired asset allocation ratios.`,
    questions: [
      {
        id: 1,
        question_text: `Diversification guarantees investment profits.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "False",
        explanation: `The passage clearly states that "diversification does not guarantee profits or protect against all losses."`
      },
      {
        id: 2,
        question_text: `Different investments often perform differently under various market conditions.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "True",
        explanation: `The passage states this concept as the basis for diversification: "different investments often perform differently under various market conditions."`
      },
      {
        id: 3,
        question_text: `Portfolio rebalancing is necessary for effective diversification.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "True",
        explanation: `The passage mentions that "Effective diversification requires...regular portfolio rebalancing to maintain desired asset allocation ratios."`
      }
    ]
  },

  // Pool 5: Marketing Strategy
  {
    id: "reading_intermediate_005",
    passage_title: "Brand Positioning Strategies",
    passage_text: `Brand positioning is the strategic process of establishing a distinct image and identity for a product or service in the minds of target customers. Successful brand positioning differentiates a company from its competitors and communicates unique value propositions that resonate with specific customer segments. This process involves analyzing market gaps, understanding customer needs and preferences, and identifying competitive advantages that can be sustainably maintained. Companies must consistently deliver on their brand promise across all customer touchpoints to build credibility and trust. However, brand repositioning can be risky and expensive, as it may confuse existing customers and require significant marketing investment. The most successful brands maintain consistent positioning while gradually evolving to meet changing market demands and customer expectations.`,
    questions: [
      {
        id: 1,
        question_text: `Brand positioning aims to differentiate companies from competitors.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "True",
        explanation: `The passage states that "Successful brand positioning differentiates a company from its competitors."`
      },
      {
        id: 2,
        question_text: `Brand repositioning is always beneficial for companies.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "False",
        explanation: `The passage mentions that "brand repositioning can be risky and expensive, as it may confuse existing customers."`
      },
      {
        id: 3,
        question_text: `Successful brands never change their positioning.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "False",
        explanation: `The passage states that "The most successful brands maintain consistent positioning while gradually evolving to meet changing market demands."`
      }
    ]
  },

  // Pool 6: Organizational Development
  {
    id: "reading_intermediate_006",
    passage_title: "Employee Engagement and Productivity",
    passage_text: `Employee engagement has become a critical factor in organizational success, with engaged employees showing significantly higher productivity, creativity, and retention rates. Engaged employees are emotionally committed to their work and organization, going beyond basic job requirements to contribute to company goals. Research indicates that companies with high employee engagement levels experience 23% higher profitability and 18% higher productivity compared to those with low engagement. Creating an engaging work environment requires strong leadership, clear communication, opportunities for professional development, and recognition programs that acknowledge employee contributions. However, engagement initiatives must be authentic and sustainable, as superficial attempts to boost engagement can actually decrease employee morale and trust. Organizations must regularly measure engagement levels and adjust their strategies based on employee feedback and changing workplace dynamics.`,
    questions: [
      {
        id: 1,
        question_text: `Engaged employees only meet basic job requirements.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "False",
        explanation: `The passage states that engaged employees "go beyond basic job requirements to contribute to company goals."`
      },
      {
        id: 2,
        question_text: `High employee engagement correlates with higher profitability.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "True",
        explanation: `The passage mentions that companies with high engagement "experience 23% higher profitability."`
      },
      {
        id: 3,
        question_text: `All engagement initiatives improve employee morale.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "False",
        explanation: `The passage warns that "superficial attempts to boost engagement can actually decrease employee morale and trust."`
      }
    ]
  }
];

// Reading Comprehension - Advanced Level (VRT3)
export const readingComprehensionAdvanced = [
  // Pool 1: Strategic Leadership
  {
    id: "reading_advanced_001",
    passage_title: "Strategic Leadership in Complex Organizations",
    passage_text: `Strategic leadership in today's complex organizational environments requires a sophisticated understanding of multiple stakeholder dynamics, market volatility, and technological disruption. Effective strategic leaders must balance short-term operational demands with long-term strategic vision, while navigating competing interests among shareholders, employees, customers, and regulatory bodies. The concept of strategic ambidexterity—the ability to simultaneously explore new opportunities while exploiting existing capabilities—has become increasingly important as organizations face unprecedented rates of change. Research in organizational behavior suggests that leaders who can manage paradoxical tensions, embrace cognitive complexity, and foster adaptive capacity within their teams are more likely to drive sustainable competitive advantage. However, the cognitive demands of strategic leadership can lead to decision fatigue and analysis paralysis, particularly when leaders lack adequate support systems or clear decision-making frameworks. Furthermore, the democratization of information and the rise of distributed leadership models challenge traditional hierarchical approaches to strategic decision-making.`,
    questions: [
      {
        id: 1,
        question_text: `Strategic ambidexterity involves focusing exclusively on new opportunities.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "False",
        explanation: `The passage defines strategic ambidexterity as "the ability to simultaneously explore new opportunities while exploiting existing capabilities," not focusing exclusively on one aspect.`
      },
      {
        id: 2,
        question_text: `Cognitive demands of strategic leadership can lead to decision fatigue.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "True",
        explanation: `The passage explicitly states that "the cognitive demands of strategic leadership can lead to decision fatigue and analysis paralysis."`
      },
      {
        id: 3,
        question_text: `Traditional hierarchical approaches are becoming more important in modern organizations.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "False",
        explanation: `The passage suggests the opposite, stating that "the democratization of information and the rise of distributed leadership models challenge traditional hierarchical approaches."`
      }
    ]
  },

  // Pool 2: Change Management
  {
    id: "reading_advanced_002",
    passage_title: "Organizational Change and Resistance Dynamics",
    passage_text: `Organizational change initiatives face a fundamental paradox: while change is essential for survival and growth, it inherently triggers psychological and social resistance mechanisms that can undermine transformation efforts. The complexity of modern organizations means that change interventions must account for interconnected systems, cultural nuances, and individual psychological responses. Successful change management requires understanding that resistance is not merely an obstacle to overcome, but often contains valuable information about systemic issues and potential implementation challenges. Advanced change practitioners recognize that sustainable transformation emerges from creating conditions for emergent adaptation rather than imposing predetermined solutions. This approach, known as complexity leadership, emphasizes the importance of fostering adaptive capacity, encouraging experimentation, and supporting emergent learning processes. However, this methodology requires significant patience and tolerance for ambiguity, which can conflict with stakeholder expectations for rapid, measurable results. The tension between systematic planning and adaptive emergence represents one of the most challenging aspects of contemporary change management practice.`,
    questions: [
      {
        id: 1,
        question_text: `Resistance to change should always be overcome quickly.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "False",
        explanation: `The passage suggests that "resistance is not merely an obstacle to overcome, but often contains valuable information about systemic issues."`
      },
      {
        id: 2,
        question_text: `Complexity leadership emphasizes predetermined solutions.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "False",
        explanation: `The passage states that complexity leadership involves "creating conditions for emergent adaptation rather than imposing predetermined solutions."`
      },
      {
        id: 3,
        question_text: `Modern change management faces tension between planning and adaptation.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "True",
        explanation: `The passage concludes by stating that "The tension between systematic planning and adaptive emergence represents one of the most challenging aspects of contemporary change management practice."`
      }
    ]
  },

  // Pool 3: Innovation Management
  {
    id: "reading_advanced_003",
    passage_title: "Innovation Ecosystems and Competitive Dynamics",
    passage_text: `Innovation ecosystems represent complex networks of interdependent actors—including corporations, startups, research institutions, and government agencies—that collaborate and compete simultaneously to create and capture value from technological advances. The paradoxical nature of these ecosystems, where cooperation and competition coexist, challenges traditional strategic frameworks that assume clear boundaries between partners and rivals. Successful ecosystem orchestration requires developing dynamic capabilities that enable organizations to sense emerging opportunities, seize valuable positions within evolving networks, and reconfigure resources across organizational boundaries. The platform economy has intensified these dynamics, as digital platforms can rapidly scale network effects and create winner-take-all markets. However, platform leadership positions are increasingly contested, with established players facing disruption from agile newcomers who can exploit technological shifts or regulatory changes. The concept of ecosystem resilience has emerged as a critical consideration, as highly interconnected systems can propagate failures rapidly across network nodes. Organizations must therefore balance the benefits of deep ecosystem integration with the risks of excessive interdependence and potential systemic vulnerabilities.`,
    questions: [
      {
        id: 1,
        question_text: `Innovation ecosystems involve only cooperation between actors.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "False",
        explanation: `The passage states that ecosystems involve actors who "collaborate and compete simultaneously" and mentions "the paradoxical nature of these ecosystems, where cooperation and competition coexist."`
      },
      {
        id: 2,
        question_text: `Platform leadership positions are becoming more secure over time.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "False",
        explanation: `The passage states that "platform leadership positions are increasingly contested, with established players facing disruption from agile newcomers."`
      },
      {
        id: 3,
        question_text: `Deep ecosystem integration carries both benefits and risks.`,
        options: ["True", "False", "Cannot Say"],
        correct_answer: "True",
        explanation: `The passage concludes that "Organizations must therefore balance the benefits of deep ecosystem integration with the risks of excessive interdependence and potential systemic vulnerabilities."`
      }
    ]
  }
];

// ==========================================
// RANDOMIZATION FUNCTIONS FOR READING COMPREHENSION
// ==========================================

// Utility function to shuffle array and select random elements
function selectRandomPassages(pool, count) {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Generate randomized reading comprehension tests
export function getRandomizedReadingComprehensionBasic(questionCount = 3) {
  const selectedPassages = selectRandomPassages(readingComprehensionBasic, questionCount);
  
  // Renumber questions sequentially
  let questionNumber = 1;
  const processedPassages = selectedPassages.map(passage => ({
    ...passage,
    questions: passage.questions.map(q => ({
      ...q,
      id: questionNumber++
    }))
  }));

  return {
    id: "VRT1",
    title: "Verbal Reasoning Test 1 - Reading Comprehension (Basic)",
    description: "Basic level reading comprehension with science and nature topics",
    timeLimit: 20,
    sections: [
      {
        id: 1,
        title: "Reading Comprehension - Basic Level",
        description: "Read each passage carefully and answer the questions based on the information provided.",
        passages: processedPassages
      }
    ]
  };
}

export function getRandomizedReadingComprehensionIntermediate(questionCount = 3) {
  const selectedPassages = selectRandomPassages(readingComprehensionIntermediate, questionCount);
  
  // Renumber questions sequentially
  let questionNumber = 1;
  const processedPassages = selectedPassages.map(passage => ({
    ...passage,
    questions: passage.questions.map(q => ({
      ...q,
      id: questionNumber++
    }))
  }));

  return {
    id: "VRT2",
    title: "Verbal Reasoning Test 2 - Reading Comprehension (Intermediate)",
    description: "Intermediate level reading comprehension with business and professional topics",
    timeLimit: 20,
    sections: [
      {
        id: 2,
        title: "Reading Comprehension - Intermediate Level",
        description: "Read each passage carefully and answer the questions based on the information provided.",
        passages: processedPassages
      }
    ]
  };
}

export function getRandomizedReadingComprehensionAdvanced(questionCount = 2) {
  const selectedPassages = selectRandomPassages(readingComprehensionAdvanced, questionCount);
  
  // Renumber questions sequentially
  let questionNumber = 1;
  const processedPassages = selectedPassages.map(passage => ({
    ...passage,
    questions: passage.questions.map(q => ({
      ...q,
      id: questionNumber++
    }))
  }));

  return {
    id: "VRT3",
    title: "Verbal Reasoning Test 3 - Reading Comprehension (Advanced)",
    description: "Advanced level reading comprehension with complex management and leadership topics",
    timeLimit: 20,
    sections: [
      {
        id: 3,
        title: "Reading Comprehension - Advanced Level",
        description: "Read each passage carefully and answer the questions based on the information provided.",
        passages: processedPassages
      }
    ]
  };
}

// ==========================================
// CONSOLIDATED READING COMPREHENSION
// ==========================================

/**
 * Consolidated Reading Comprehension Test (VRT-COMP)
 * Merges VRT1, VRT2, VRT3 into single randomized test
 * Anti-cheating: Random selection from all difficulty levels
 */
export function getRandomizedReadingComprehensionConsolidated(questionCount = 8) {
  // Combine all reading comprehension pools
  const allPassages = [
    ...readingComprehensionBasic,
    ...readingComprehensionIntermediate, 
    ...readingComprehensionAdvanced
  ];
  
  // Select random passages from combined pool
  const selectedPassages = selectRandomPassages(allPassages, questionCount);
  
  // Renumber questions sequentially with VR-COMP prefix
  let questionNumber = 1;
  const processedPassages = selectedPassages.map(passage => ({
    ...passage,
    id: `VR-COMP-${passage.id}`, // Update passage ID for tracking
    questions: passage.questions.map(q => ({
      ...q,
      id: `VR-COMP-${questionNumber++}` // Sequential numbering with prefix
    }))
  }));

  return {
    id: "VRT-COMP",
    title: "Reading Comprehension Test (Consolidated)",
    description: "Comprehensive reading comprehension covering science, business, and management topics across all difficulty levels",
    timeLimit: 25, // Increased time for mixed difficulty
    sections: [
      {
        id: 1,
        title: "Reading Comprehension - Mixed Difficulty",
        description: "Read each passage carefully and answer the questions based on the information provided. Passages cover basic to advanced topics.",
        passages: processedPassages
      }
    ]
  };
}

import { getRandomizedVRT4 } from './verbalAnalogiesVRT4.js';
import { getRandomizedVRT5 } from './verbalClassificationVRT5.js';
import { getRandomizedVRT6 } from './verbalCodingDecodingVRT6.js';
import { getRandomizedVRT7Test } from './verbalBloodRelationsLogicalPuzzlesVRT7_Enhanced.js';

// ==========================================
// CATEGORY METADATA
// ==========================================

export const verbalReasoningCategories = {
  // CONSOLIDATED READING COMPREHENSION
  readingComprehension: {
    id: "reading_comprehension",
    name: "Reading Comprehension",
    description: "Tests ability to understand, analyze, and interpret written passages across all difficulty levels",
    levels: {
      consolidated: {
        name: "Comprehensive Reading Test",
        testId: "VRT-COMP",
        description: "Mixed difficulty passages covering science, business, and management topics with anti-cheating randomization",
        questionPool: "combined", // Uses all three pools combined
        defaultQuestionCount: 8,
        timeLimit: 25,
        getRandomizedTest: getRandomizedReadingComprehensionConsolidated
      },
      // Legacy individual tests (kept for backward compatibility)
      basic: {
        name: "Basic Level",
        testId: "VRT1",
        description: "Science and nature topics with straightforward comprehension questions",
        questionPool: readingComprehensionBasic,
        defaultQuestionCount: 3,
        getRandomizedTest: getRandomizedReadingComprehensionBasic,
        deprecated: true
      },
      intermediate: {
        name: "Intermediate Level", 
        testId: "VRT2",
        description: "Business and professional topics with moderate complexity",
        questionPool: readingComprehensionIntermediate,
        defaultQuestionCount: 3,
        getRandomizedTest: getRandomizedReadingComprehensionIntermediate,
        deprecated: true
      },
      advanced: {
        name: "Advanced Level",
        testId: "VRT3", 
        description: "Complex management and leadership topics with analytical questions",
        questionPool: readingComprehensionAdvanced,
        defaultQuestionCount: 2,
        getRandomizedTest: getRandomizedReadingComprehensionAdvanced,
        deprecated: true
      }
    }
  },

  // NEW CATEGORY: VERBAL ANALOGIES
  verbalAnalogies: {
    id: "verbal_analogies",
    name: "Verbal Analogies",
    description: "Tests ability to identify relationships between words, concepts, and patterns",
    levels: {
      comprehensive: {
        name: "Comprehensive Analogies Test",
        testId: "VRT4",
        description: "Mixed difficulty analogies covering 9 different types: completing pairs, simple analogies, choosing pairs, double analogies, similar words, detecting analogies, three-word sequences, number patterns, and alphabet patterns",
        questionPool: "dynamic", // Uses JSONL dataset
        defaultQuestionCount: 30,
        timeLimit: 25,
        getRandomizedTest: getRandomizedVRT4
      }
    }
  }
  ,
  // NEW CATEGORY: CLASSIFICATION (Odd-One-Out)
  classification: {
    id: 'classification',
    name: 'Classification',
    description: 'Identify the item that does not belong based on shared properties or patterns',
    levels: {
      comprehensive: {
        name: 'Comprehensive Classification Test',
        testId: 'VRT5',
        description: 'Odd-one-out across words, pairs, numerals, and letter groups',
        questionPool: 'dynamic',
        defaultQuestionCount: 25,
        timeLimit: 25,
        getRandomizedTest: getRandomizedVRT5
      }
    }
  },

  // NEW CATEGORY: CODING AND DECODING  
  codingDecoding: {
    id: 'coding_decoding',
    name: 'Coding and Decoding',
    description: 'Crack codes, decode patterns, and identify logical encoding systems',
    levels: {
      comprehensive: {
        name: 'Comprehensive Coding & Decoding Test',
        testId: 'VRT6',
        description: 'Letter coding, number coding, substitution patterns, and mixed encoding systems from diverse cultural backgrounds',
        questionPool: 'dynamic',
        defaultQuestionCount: 25,
        timeLimit: 30,
        getRandomizedTest: getRandomizedVRT6
      }
    }
  },

  // NEW CATEGORY: BLOOD RELATIONS & LOGICAL PUZZLES
  bloodRelationsLogicalPuzzles: {
    id: 'blood_relations_logical_puzzles',
    name: 'Blood Relations & Logical Puzzles',
    description: 'Solve family relationship problems and logical reasoning puzzles',
    levels: {
      comprehensive: {
        name: 'Comprehensive Blood Relations & Logical Puzzles Test',
        testId: 'VRT7',
        description: 'Advanced verbal reasoning with family relationships and logical puzzle solving across varying difficulty levels',
        questionPool: 'jsonl',
        defaultQuestionCount: 25,
        timeLimit: 35,
        getRandomizedTest: getRandomizedVRT7Test
      }
    }
  }
  
  // Future categories will be added here:
  // classification: { ... },
  // letterCoding: { ... },
  // etc.
};

// ==========================================
// BACKWARD COMPATIBILITY FUNCTIONS
// ==========================================

// These functions maintain compatibility with existing component code
export const getRandomizedVRT1 = getRandomizedReadingComprehensionBasic;
export const getRandomizedVRT2 = getRandomizedReadingComprehensionIntermediate;
export const getRandomizedVRT3 = getRandomizedReadingComprehensionAdvanced;
export const getRandomizedVRT7 = getRandomizedVRT7Test;
