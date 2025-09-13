// Data for the Numerical Reasoning Test - Morocco Localized
// This file provides the questions, answers, and configuration for the test

// Utility: shuffle an array (non-destructive)
const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Select random questions with difficulty distribution
const selectRandomQuestions = (questions, count) => {
  const shuffled = shuffleArray(questions);
  const selected = [];
  const difficultyCounts = { easy: 0, medium: 0, hard: 0 };

  for (const q of shuffled) {
    const difficulty = q.complexity_score <= 2 ? 'easy' : q.complexity_score === 3 ? 'medium' : 'hard';
    if (difficultyCounts[difficulty] < Math.ceil(count * (difficulty === 'easy' ? 0.3 : difficulty === 'medium' ? 0.5 : 0.2))) {
      selected.push(q);
      difficultyCounts[difficulty]++;
      if (selected.length === count) break;
    }
  }

  return selected;
};

// Build a deterministic pool of 60 Moroccan-localized numerical questions
const buildNumericalQuestionPool = () => {
  const pool = [];
  let id = 1;

  const add = ({ category, complexity_score, question, options, correct, explanation, extras = {} }) => {
    pool.push({
      question_id: id++,
      category,
      complexity_score,
      question,
      options: options.map((t, i) => ({ option_id: String.fromCharCode(65 + i), text: t })),
      correct_answer: correct,
      explanation,
      ...extras
    });
  };

  // Moroccan-localized questions with MAD currency, km, and Moroccan context
  add({ 
    category: 'Distance & Speed', 
    complexity_score: 2, 
    question: 'Ahmed drives from Casablanca to Rabat at 90 km/h. If the distance is 100 km, how long does the trip take?', 
    options: ['1 hour 6 minutes', '1 hour 11 minutes', '1 hour 15 minutes', '1 hour 20 minutes'], 
    correct: 'B', 
    explanation: 'Time = Distance/Speed = 100/90 = 1.11 hours = 1 hour 6.6 minutes ≈ 1 hour 11 minutes.' 
  });

  add({ 
    category: 'Percentages', 
    complexity_score: 2, 
    question: 'What is 15% of 200 MAD?', 
    options: ['25 MAD', '30 MAD', '35 MAD', '40 MAD'], 
    correct: 'B', 
    explanation: '15% of 200 = 0.15 × 200 = 30 MAD.' 
  });

  add({ 
    category: 'Percentages', 
    complexity_score: 2, 
    question: 'Fatima bought a dress for 800 MAD during a 25% discount sale. What was the original price?', 
    options: ['1000 MAD', '1066 MAD', '1100 MAD', '1200 MAD'], 
    correct: 'B', 
    explanation: 'If 800 MAD is 75% of original price, then original = 800 ÷ 0.75 = 1066.67 MAD.' 
  });

  add({ 
    category: 'Ratio and Proportion', 
    complexity_score: 3, 
    question: 'In a Moroccan company, the ratio of employees in Casablanca to Marrakech is 3:2. If there are 180 employees in Casablanca, how many are in Marrakech?', 
    options: ['120', '135', '150', '160'], 
    correct: 'A', 
    explanation: 'Ratio 3:2 means if Casablanca has 3 parts = 180, then 1 part = 60. Marrakech = 2 × 60 = 120.' 
  });

  // Financial questions with Moroccan context
  add({ 
    category: 'Financial Calculations', 
    complexity_score: 3, 
    question: 'Omar deposits 10,000 MAD in a Moroccan bank at 4% annual simple interest. How much will he have after 3 years?', 
    options: ['11,200 MAD', '11,500 MAD', '11,800 MAD', '12,000 MAD'], 
    correct: 'A', 
    explanation: 'Simple interest = 10,000 × 0.04 × 3 = 1,200 MAD. Total = 10,000 + 1,200 = 11,200 MAD.' 
  });

  add({ 
    category: 'Business Calculations', 
    complexity_score: 4, 
    question: 'A Marrakech restaurant has monthly expenses of 45,000 MAD and revenue of 60,000 MAD. What is the profit margin?', 
    options: ['20%', '25%', '30%', '33%'], 
    correct: 'B', 
    explanation: 'Profit = 60,000 - 45,000 = 15,000 MAD. Profit margin = (15,000 ÷ 60,000) × 100 = 25%.' 
  });

  add({ 
    category: 'Data Interpretation', 
    complexity_score: 3, 
    question: 'Rabat office sales: Q1: 120,000 MAD, Q2: 150,000 MAD, Q3: 130,000 MAD. What is the average quarterly sales?', 
    options: ['130,000 MAD', '133,333 MAD', '135,000 MAD', '140,000 MAD'], 
    correct: 'B', 
    explanation: 'Average = (120,000 + 150,000 + 130,000) ÷ 3 = 400,000 ÷ 3 = 133,333 MAD.' 
  });

  add({ 
    category: 'Distance & Travel', 
    complexity_score: 3, 
    question: 'Youssef travels from Tangier to Fez (300 km) at 80 km/h, then from Fez to Meknes (60 km) at 60 km/h. What is his total travel time?', 
    options: ['4.5 hours', '4.75 hours', '5 hours', '5.25 hours'], 
    correct: 'B', 
    explanation: 'Time1 = 300/80 = 3.75 hours. Time2 = 60/60 = 1 hour. Total = 3.75 + 1 = 4.75 hours.' 
  });

  add({ 
    category: 'Percentages', 
    complexity_score: 2, 
    question: 'Laila spends 30% of her 8,000 MAD salary on rent. How much does she spend on rent?', 
    options: ['2,200 MAD', '2,400 MAD', '2,600 MAD', '2,800 MAD'], 
    correct: 'B', 
    explanation: '30% of 8,000 = 0.30 × 8,000 = 2,400 MAD.' 
  });

  add({ 
    category: 'Area Calculations', 
    complexity_score: 4, 
    question: 'A rectangular farm near Agadir is 500m long and 300m wide. What is its area in hectares?', 
    options: ['12 hectares', '15 hectares', '18 hectares', '20 hectares'], 
    correct: 'B', 
    explanation: 'Area = 500 × 300 = 150,000 m². Converting to hectares: 150,000 ÷ 10,000 = 15 hectares.' 
  });

  // Generate more questions programmatically with Moroccan context
  const moroccanCities = ['Casablanca', 'Rabat', 'Marrakech', 'Fez', 'Tangier', 'Agadir', 'Meknes', 'Oujda'];
  const moroccanNames = ['Ahmed', 'Fatima', 'Omar', 'Aicha', 'Youssef', 'Khadija', 'Hassan', 'Amina', 'Rachid', 'Nadia'];
  
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const randomName = () => moroccanNames[rand(0, moroccanNames.length - 1)];
  const randomCity = () => moroccanCities[rand(0, moroccanCities.length - 1)];

  // Generate distance/speed questions
  while (pool.length < 20) {
    const speed = [60, 70, 80, 90, 100, 110, 120][rand(0, 6)];
    const distance = [80, 100, 120, 150, 200, 250, 300][rand(0, 6)];
    const time = distance / speed;
    add({
      category: 'Distance & Speed',
      complexity_score: rand(2, 4),
      question: `${randomName()} travels from ${randomCity()} to ${randomCity()} (${distance} km) at ${speed} km/h. How long does the journey take?`,
      options: [
        `${(time - 0.5).toFixed(1)} hours`,
        `${time.toFixed(1)} hours`,
        `${(time + 0.5).toFixed(1)} hours`,
        `${(time + 1).toFixed(1)} hours`
      ],
      correct: 'B',
      explanation: `Time = Distance ÷ Speed = ${distance} ÷ ${speed} = ${time.toFixed(1)} hours.`
    });
  }

  // Generate financial questions with MAD
  while (pool.length < 35) {
    const principal = [5000, 8000, 10000, 15000, 20000, 25000][rand(0, 5)];
    const rate = [3, 4, 5, 6, 7, 8][rand(0, 5)];
    const years = [2, 3, 4, 5][rand(0, 3)];
    const amount = principal * (1 + (rate / 100) * years);
    add({
      category: 'Financial Calculations',
      complexity_score: rand(3, 4),
      question: `${randomName()} invests ${principal.toLocaleString()} MAD at ${rate}% simple annual interest. What will the investment be worth after ${years} years?`,
      options: [
        `${Math.round(amount - 1000).toLocaleString()} MAD`,
        `${Math.round(amount).toLocaleString()} MAD`,
        `${Math.round(amount + 1000).toLocaleString()} MAD`,
        `${Math.round(amount + 2000).toLocaleString()} MAD`
      ],
      correct: 'B',
      explanation: `Simple interest: ${principal.toLocaleString()} × (1 + ${rate}% × ${years}) = ${Math.round(amount).toLocaleString()} MAD.`
    });
  }

  // Generate percentage questions with Moroccan context
  while (pool.length < 50) {
    const salary = [6000, 7000, 8000, 9000, 10000, 12000, 15000][rand(0, 6)];
    const percentage = [20, 25, 30, 35, 40][rand(0, 4)];
    const amount = (salary * percentage) / 100;
    const expenses = ['rent', 'transportation', 'food', 'savings'][rand(0, 3)];
    add({
      category: 'Percentages',
      complexity_score: rand(2, 3),
      question: `${randomName()} earns ${salary.toLocaleString()} MAD monthly and spends ${percentage}% on ${expenses}. How much is spent on ${expenses}?`,
      options: [
        `${Math.round(amount - 200).toLocaleString()} MAD`,
        `${Math.round(amount).toLocaleString()} MAD`,
        `${Math.round(amount + 200).toLocaleString()} MAD`,
        `${Math.round(amount + 400).toLocaleString()} MAD`
      ],
      correct: 'B',
      explanation: `${percentage}% of ${salary.toLocaleString()} = ${Math.round(amount).toLocaleString()} MAD.`
    });
  }

  // Generate business data interpretation questions
  while (pool.length < 60) {
    if (pool.length % 2 === 0) {
      const q1 = rand(80000, 200000);
      const q2 = rand(90000, 220000);
      const q3 = rand(85000, 210000);
      const avg = Math.round((q1 + q2 + q3) / 3);
      add({
        category: 'Data Interpretation',
        complexity_score: rand(3, 5),
        question: `${randomCity()} branch sales: Q1: ${q1.toLocaleString()} MAD, Q2: ${q2.toLocaleString()} MAD, Q3: ${q3.toLocaleString()} MAD. What is the average quarterly sales?`,
        options: [
          `${Math.round(avg - 5000).toLocaleString()} MAD`,
          `${avg.toLocaleString()} MAD`,
          `${Math.round(avg + 5000).toLocaleString()} MAD`,
          `${Math.round(avg + 10000).toLocaleString()} MAD`
        ],
        correct: 'B',
        explanation: `Average = (${q1.toLocaleString()} + ${q2.toLocaleString()} + ${q3.toLocaleString()}) ÷ 3 = ${avg.toLocaleString()} MAD.`
      });
    } else {
      const price = [500, 800, 1200, 1500, 2000][rand(0, 4)];
      const discount = [10, 15, 20, 25, 30][rand(0, 4)];
      const discountAmount = (price * discount) / 100;
      const finalPrice = price - discountAmount;
      add({
        category: 'Business Calculations',
        complexity_score: rand(2, 4),
        question: `A shop in ${randomCity()} offers a ${discount}% discount on a product priced at ${price} MAD. What is the discounted price?`,
        options: [
          `${Math.round(finalPrice - 50)} MAD`,
          `${Math.round(finalPrice)} MAD`,
          `${Math.round(finalPrice + 50)} MAD`,
          `${Math.round(finalPrice + 100)} MAD`
        ],
        correct: 'B',
        explanation: `Discount = ${price} × ${discount}% = ${discountAmount} MAD. Final price = ${price} - ${discountAmount} = ${Math.round(finalPrice)} MAD.`
      });
    }
  }

  // Sanity: ensure each correct_answer exists among options
  pool.forEach(item => {
    if (!item.options.find(o => o.option_id === item.correct_answer)) {
      item.correct_answer = 'A';
    }
  });

  return pool;
};

export const getNumericalTestData = () => {
  const pool = buildNumericalQuestionPool();
  const selectedQuestions = selectRandomQuestions(pool, 20);
  return {
    title: 'Numerical Reasoning Test',
    description: 'Assess your ability to interpret and analyze numerical data',
    duration_minutes: 20,
    total_questions: 20,
    sections: [
      {
        id: 1,
        title: 'Numerical Reasoning Assessment',
        description: 'This test evaluates your ability to interpret data, analyze numerical information, and solve mathematical problems.',
        intro_text: {
          title: 'Numerical Reasoning Test',
          instructions: [
            'You will be presented with 20 numerical reasoning questions that test your ability to interpret data and perform calculations.',
            'Each question includes numerical information presented as tables, charts, or text.',
            'Analyze the data carefully before selecting your answer.',
            'You have 20 minutes to complete all questions.',
            'Use a calculator if necessary for complex calculations.',
            'Once you select an answer and move to the next question, you cannot go back.',
            'Read all information carefully before making your selection.'
          ]
        },
        intro_image: '/assets/images/numerical/intro.png',
        questions: selectedQuestions
      }
    ]
  };
};

export const getNumericalTestWithAnswers = () => getNumericalTestData();
