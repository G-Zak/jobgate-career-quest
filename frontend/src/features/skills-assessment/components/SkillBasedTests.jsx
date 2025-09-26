import React, { useState, useEffect } from 'react';
import { FaPlay, FaClock, FaQuestionCircle, FaArrowLeft, FaCheckCircle, FaTrophy } from 'react-icons/fa';

const SkillBasedTests = ({ userId, testId, skillId, onBackToDashboard }) => {
  const [userSkills, setUserSkills] = useState([]);
  const [availableTests, setAvailableTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Charger les compétences de l'utilisateur et les tests disponibles
  useEffect(() => {
    loadUserSkillsAndTests();
  }, []);

  // Démarrer automatiquement un test si testId est fourni
  useEffect(() => {
    if (testId && availableTests.length > 0 && !selectedTest) {
      const testToStart = availableTests.find(test => test.id === testId);
      if (testToStart) {
        console.log('Démarrage automatique du test:', testToStart.title);
        startTest(testToStart);
      }
    }
  }, [testId, availableTests, selectedTest]);

  const loadUserSkillsAndTests = async () => {
    try {
      // Charger les compétences de l'utilisateur depuis son profil
      const candidateResponse = await fetch(`http://localhost:8000/api/candidates/${userId}/`);
      if (!candidateResponse.ok) {
        console.log('⚠️ No user profile found, using fallback data');
        setUserSkills([
          { id: 1, name: 'Python', category: 'programming' },
          { id: 2, name: 'JavaScript', category: 'programming' },
          { id: 3, name: 'React', category: 'frontend' }
        ]);
        setAvailableTests([]);
        setLoading(false);
        return;
      }

      const candidate = await candidateResponse.json();
      const userSkillsData = candidate.skills || [];
      setUserSkills(userSkillsData);
      console.log('✅ User skills loaded:', userSkillsData);

      // Charger les tests depuis notre API des compétences (qui fonctionne)
      const testsResponse = await fetch('http://localhost:8000/api/skills/tests/');
      if (!testsResponse.ok) {
        throw new Error(`API returned ${testsResponse.status}`);
      }

      const response = await testsResponse.json();
      if (!response.success || !response.data) {
        throw new Error('No data in API response');
      }

      // Transformer les données de l'API
      let allTests = Object.values(response.data).flatMap(skillData =>
        skillData.tests.map(test => ({
          ...test,
          skill: skillData.skill,
          title: test.test_name,
          description: test.description,
          timeLimit: test.time_limit,
          questionCount: test.question_count,
          totalScore: test.total_score
        }))
      );

      console.log('✅ Tests loaded from API:', allTests);

      // Si l'API ne renvoie pas de tests, utiliser les données mock
      if (allTests.length === 0) {
        console.log('⚠️ No tests from API, using mock data fallback');
        const mockTests = [
          {
            id: 1,
            title: 'Python Fundamentals Test',
            skill: { name: 'Python', category: 'programming' },
            description: 'Master the basics of Python programming',
            timeLimit: 15,
            questionCount: 20,
            totalScore: 100
          },
          {
            id: 2,
            title: 'JavaScript Advanced Test',
            skill: { name: 'JavaScript', category: 'programming' },
            description: 'Advanced JavaScript concepts and patterns',
            timeLimit: 30,
            questionCount: 25,
            totalScore: 100
          },
          {
            id: 3,
            title: 'SQLite Database Test',
            skill: { name: 'SQLite', category: 'database' },
            description: 'SQLite database management and queries',
            timeLimit: 20,
            questionCount: 15,
            totalScore: 100
          },
          {
            id: 4,
            title: 'Django Web Framework Test',
            skill: { name: 'Django', category: 'backend' },
            description: 'Django web framework fundamentals',
            timeLimit: 25,
            questionCount: 18,
            totalScore: 100
          },
          {
            id: 5,
            title: 'React Frontend Test',
            skill: { name: 'React', category: 'frontend' },
            description: 'React component development and hooks',
            timeLimit: 20,
            questionCount: 16,
            totalScore: 100
          },
          {
            id: 6,
            title: 'SQL Database Test',
            skill: { name: 'SQL', category: 'database' },
            description: 'SQL database queries and optimization',
            timeLimit: 18,
            questionCount: 14,
            totalScore: 100
          }
        ];
        allTests = mockTests;
        console.log('✅ Using mock tests:', allTests.length, 'tests');
      }

      // Si un skillId spécifique est fourni, filtrer les tests pour cette compétence
      let filteredTests;
      if (skillId) {
        // Trouver la compétence spécifique
        const specificSkill = userSkillsData.find(skill => skill.id === skillId);
        if (specificSkill) {
          // Filtrer les tests qui correspondent à cette compétence
          filteredTests = allTests.filter(test => {
            const skillName = specificSkill.name.toLowerCase();
            const testTitle = test.title.toLowerCase();
            const testSkillName = test.skill?.name?.toLowerCase() || '';
            const testDescription = test.description?.toLowerCase() || '';

            return (
              testTitle.includes(skillName) ||
              testDescription.includes(skillName) ||
              testSkillName.includes(skillName) ||
              (skillName === 'python' && (testTitle.includes('python') || testTitle.includes('django'))) ||
              (skillName === 'javascript' && (testTitle.includes('javascript') || testTitle.includes('js') || testTitle.includes('react'))) ||
              (skillName === 'django' && testTitle.includes('django')) ||
              (skillName === 'react' && testTitle.includes('react')) ||
              (skillName === 'sql' && testTitle.includes('sql'))
            );
          });
        } else {
          filteredTests = [];
        }
      } else {
        // Pas de skillId spécifique, montrer tous les tests disponibles
        filteredTests = allTests;
      }

      console.log('✅ Filtered tests:', filteredTests);
      setAvailableTests(filteredTests);
      setLoading(false);
    } catch (error) {
      console.error('❌ Erreur lors du chargement:', error);
      // Utiliser des données de fallback
      setUserSkills([
        { id: 1, name: 'Python', category: 'programming' },
        { id: 2, name: 'JavaScript', category: 'programming' },
        { id: 3, name: 'React', category: 'frontend' }
      ]);
      setAvailableTests([]);
      setLoading(false);
    }
  };

  // Fonction pour générer des questions mock basées sur le test
  const generateMockQuestions = (test, explicitSkill = null) => {
    console.log('🔍 generateMockQuestions - test object:', test);
    console.log('🔍 generateMockQuestions - explicitSkill:', explicitSkill);
    console.log('🔍 generateMockQuestions - test.skill:', test.skill);
    console.log('🔍 generateMockQuestions - test.skill?.name:', test.skill?.name);

    // Utiliser la compétence explicite si fournie, sinon essayer de l'identifier
    let skillName = 'general';

    if (explicitSkill) {
      skillName = explicitSkill.toLowerCase();
      console.log('🎯 Using explicit skill:', skillName);
    } else if (test.skill?.name) {
      skillName = test.skill.name.toLowerCase();
      console.log('🎯 Using test.skill.name:', skillName);
    } else if (test.skill) {
      skillName = test.skill.toLowerCase();
      console.log('🎯 Using test.skill:', skillName);
    } else if (test.title) {
      // Extraire la compétence du titre du test
      const title = test.title.toLowerCase();
      console.log('🎯 Analyzing title for skill:', title);
      if (title.includes('react')) {
        skillName = 'react';
      } else if (title.includes('sqlite')) {
        skillName = 'sqlite';
      } else if (title.includes('javascript')) {
        skillName = 'javascript';
      } else if (title.includes('python')) {
        skillName = 'python';
      } else if (title.includes('django')) {
        skillName = 'django';
      }
      console.log('🎯 Detected skill from title:', skillName);
    }

    const questionCount = test.questionCount || 20;

    console.log(`🎯 Generating ${questionCount} mock questions for skill: ${skillName}`);

    const questions = [];

    // Questions par compétence avec variété
    const questionBanks = {
      python: [
        {
          question_text: "What is the correct syntax to create a list in Python?",
          options: ["list = []", "list = {}", "list = ()", "list = []", "list = []"],
          correct_answer: 0,
          explanation: "In Python, lists are created using square brackets []."
        },
        {
          question_text: "Which keyword is used to define a function in Python?",
          options: ["function", "def", "func", "define", "fn"],
          correct_answer: 1,
          explanation: "The 'def' keyword is used to define functions in Python."
        },
        {
          question_text: "What is the output of print(3 * 2 + 1)?",
          options: ["7", "9", "6", "8", "5"],
          correct_answer: 0,
          explanation: "Python follows order of operations: 3 * 2 = 6, then 6 + 1 = 7."
        },
        {
          question_text: "Which data type is mutable in Python?",
          options: ["tuple", "string", "list", "int", "float"],
          correct_answer: 2,
          explanation: "Lists are mutable, meaning they can be modified after creation."
        },
        {
          question_text: "What does len() function return?",
          options: ["The last element", "The length", "The sum", "The average", "The maximum"],
          correct_answer: 1,
          explanation: "len() returns the number of items in a sequence or collection."
        }
      ],
      javascript: [
        {
          question_text: "Which JavaScript keyword is used to declare a block-scoped variable?",
          options: ["var", "let", "const", "function", "class"],
          correct_answer: 1,
          explanation: "The 'let' keyword declares a block-scoped variable, providing better scope control than 'var'."
        },
        {
          question_text: "What is the result of typeof null in JavaScript?",
          options: ["null", "undefined", "object", "string", "boolean"],
          correct_answer: 2,
          explanation: "typeof null returns 'object' due to a historical bug in JavaScript, though null is actually a primitive value."
        },
        {
          question_text: "Which JavaScript array method adds one or more elements to the end of an array?",
          options: ["push()", "pop()", "shift()", "unshift()", "splice()"],
          correct_answer: 0,
          explanation: "push() adds one or more elements to the end of an array and returns the new length of the array."
        },
        {
          question_text: "What is a closure in JavaScript?",
          options: ["A function", "A variable", "A function with access to outer scope", "A loop", "A condition"],
          correct_answer: 2,
          explanation: "A closure is a function that has access to variables in its outer (enclosing) scope, even after the outer function returns."
        },
        {
          question_text: "Which JavaScript operator checks for strict equality (value and type)?",
          options: ["==", "===", "!=", "!==", "="],
          correct_answer: 1,
          explanation: "=== checks for strict equality, comparing both value and type, while == performs type coercion."
        },
        {
          question_text: "What does the JavaScript 'this' keyword refer to?",
          options: ["The current function", "The global object", "The object that owns the current code", "The parent object", "The window object"],
          correct_answer: 2,
          explanation: "The 'this' keyword refers to the object that owns the current code, and its value depends on how a function is called."
        },
        {
          question_text: "Which JavaScript method creates a new array with all elements that pass a test?",
          options: ["map()", "filter()", "reduce()", "forEach()", "find()"],
          correct_answer: 1,
          explanation: "filter() creates a new array with all elements that pass the test implemented by the provided function."
        },
        {
          question_text: "What is the purpose of JavaScript's 'use strict' directive?",
          options: ["To enable strict mode", "To disable strict mode", "To create strict variables", "To validate syntax", "To optimize performance"],
          correct_answer: 0,
          explanation: "'use strict' enables strict mode, which helps catch common coding mistakes and prevents certain actions."
        },
        {
          question_text: "Which JavaScript method executes a function for each array element?",
          options: ["map()", "filter()", "reduce()", "forEach()", "find()"],
          correct_answer: 3,
          explanation: "forEach() executes a provided function once for each array element, but doesn't return a new array."
        },
        {
          question_text: "What is a JavaScript Promise?",
          options: ["A function", "A variable", "An object representing eventual completion/failure", "A loop", "A condition"],
          correct_answer: 2,
          explanation: "A Promise is an object representing the eventual completion or failure of an asynchronous operation."
        },
        {
          question_text: "Which JavaScript method creates a new array with the results of calling a function?",
          options: ["map()", "filter()", "reduce()", "forEach()", "find()"],
          correct_answer: 0,
          explanation: "map() creates a new array with the results of calling a provided function on every element in the calling array."
        },
        {
          question_text: "What is the difference between 'let' and 'const' in JavaScript?",
          options: ["No difference", "const is block-scoped, let is function-scoped", "const cannot be reassigned, let can", "let is faster", "const is slower"],
          correct_answer: 2,
          explanation: "const creates a block-scoped constant that cannot be reassigned, while let creates a block-scoped variable that can be reassigned."
        },
        {
          question_text: "Which JavaScript method reduces an array to a single value?",
          options: ["map()", "filter()", "reduce()", "forEach()", "find()"],
          correct_answer: 2,
          explanation: "reduce() executes a reducer function on each element of the array, resulting in a single output value."
        },
        {
          question_text: "What is the purpose of JavaScript's 'bind()' method?",
          options: ["To create a new function", "To bind 'this' to a specific object", "To validate parameters", "To optimize performance", "To create closures"],
          correct_answer: 1,
          explanation: "bind() creates a new function with 'this' set to a specific value, allowing you to control the context of function calls."
        },
        {
          question_text: "Which JavaScript feature allows you to write asynchronous code more elegantly?",
          options: ["Promises", "Callbacks", "async/await", "setTimeout", "setInterval"],
          correct_answer: 2,
          explanation: "async/await allows you to write asynchronous code in a more synchronous style, making it easier to read and maintain."
        },
        {
          question_text: "What is the purpose of JavaScript's 'call()' method?",
          options: ["To call a function", "To bind 'this' and call a function", "To validate parameters", "To create closures", "To optimize performance"],
          correct_answer: 1,
          explanation: "call() allows you to call a function with a specific 'this' value and arguments provided individually."
        },
        {
          question_text: "Which JavaScript method finds the first element that satisfies a condition?",
          options: ["map()", "filter()", "reduce()", "forEach()", "find()"],
          correct_answer: 4,
          explanation: "find() returns the first element in the array that satisfies the provided testing function, or undefined if not found."
        },
        {
          question_text: "What is the purpose of JavaScript's 'apply()' method?",
          options: ["To apply styles", "To bind 'this' and call a function with array arguments", "To validate parameters", "To create closures", "To optimize performance"],
          correct_answer: 1,
          explanation: "apply() allows you to call a function with a specific 'this' value and arguments provided as an array."
        },
        {
          question_text: "Which JavaScript feature allows you to destructure arrays and objects?",
          options: ["Destructuring assignment", "Template literals", "Arrow functions", "Classes", "Modules"],
          correct_answer: 0,
          explanation: "Destructuring assignment allows you to unpack values from arrays or properties from objects into distinct variables."
        },
        {
          question_text: "What is the purpose of JavaScript's 'spread operator' (...)?",
          options: ["To create arrays", "To expand iterables", "To create objects", "To validate parameters", "To optimize performance"],
          correct_answer: 1,
          explanation: "The spread operator (...) expands iterables (arrays, strings) into individual elements, useful for copying arrays or passing arguments."
        }
      ],
      sqlite: [
        {
          question_text: "In SQLite, which command is used to retrieve data from a database table?",
          options: ["SELECT", "INSERT", "UPDATE", "DELETE", "CREATE"],
          correct_answer: 0,
          explanation: "SELECT is the fundamental SQL command used to retrieve data from database tables in SQLite."
        },
        {
          question_text: "What does the WHERE clause accomplish in SQLite queries?",
          options: ["Groups data", "Filters rows based on conditions", "Orders results", "Joins tables", "Creates indexes"],
          correct_answer: 1,
          explanation: "The WHERE clause filters rows based on specified conditions, allowing you to retrieve only the data that meets your criteria."
        },
        {
          question_text: "Which SQLite aggregate function counts the number of rows in a result set?",
          options: ["SUM()", "COUNT()", "AVG()", "MAX()", "MIN()"],
          correct_answer: 1,
          explanation: "COUNT() is the aggregate function that returns the number of rows in a result set or the number of non-NULL values in a column."
        },
        {
          question_text: "What is the primary purpose of a PRIMARY KEY in SQLite?",
          options: ["To create an index", "To uniquely identify each row", "To link tables", "To sort data", "To validate data"],
          correct_answer: 1,
          explanation: "A PRIMARY KEY uniquely identifies each row in a table and ensures data integrity by preventing duplicate entries."
        },
        {
          question_text: "Which SQLite command is used to create a new table with defined columns?",
          options: ["CREATE TABLE", "NEW TABLE", "ADD TABLE", "INSERT TABLE", "MAKE TABLE"],
          correct_answer: 0,
          explanation: "CREATE TABLE is the SQLite command used to create a new table with specified column names, data types, and constraints."
        },
        {
          question_text: "What is the purpose of the SQLite AUTOINCREMENT keyword?",
          options: ["To speed up queries", "To automatically increment a column value", "To create indexes", "To validate data", "To optimize storage"],
          correct_answer: 1,
          explanation: "AUTOINCREMENT automatically generates a unique integer value for each new row, commonly used with PRIMARY KEY columns."
        },
        {
          question_text: "Which SQLite data type is used to store text data?",
          options: ["INTEGER", "TEXT", "REAL", "BLOB", "NUMERIC"],
          correct_answer: 1,
          explanation: "TEXT is the SQLite data type used to store character string data of variable length."
        },
        {
          question_text: "What does the SQLite LIMIT clause do?",
          options: ["Filters data", "Groups results", "Restricts the number of rows returned", "Sorts data", "Creates indexes"],
          correct_answer: 2,
          explanation: "LIMIT restricts the number of rows returned by a query, useful for pagination and performance optimization."
        },
        {
          question_text: "Which SQLite command is used to modify existing data in a table?",
          options: ["SELECT", "INSERT", "UPDATE", "DELETE", "ALTER"],
          correct_answer: 2,
          explanation: "UPDATE is used to modify existing data in SQLite tables based on specified conditions."
        },
        {
          question_text: "What is the purpose of SQLite transactions?",
          options: ["To speed up queries", "To group multiple operations atomically", "To create backups", "To optimize storage", "To validate data"],
          correct_answer: 1,
          explanation: "Transactions group multiple database operations into a single atomic unit, ensuring data consistency and allowing rollback if needed."
        },
        {
          question_text: "Which SQLite function is used to get the current date and time?",
          options: ["NOW()", "CURRENT_TIMESTAMP", "GETDATE()", "TODAY()", "CURRENT_TIME"],
          correct_answer: 1,
          explanation: "CURRENT_TIMESTAMP returns the current date and time in SQLite, formatted as 'YYYY-MM-DD HH:MM:SS'."
        },
        {
          question_text: "What does the SQLite GROUP BY clause accomplish?",
          options: ["Filters data", "Sorts results", "Groups rows with the same values", "Limits results", "Creates indexes"],
          correct_answer: 2,
          explanation: "GROUP BY groups rows that have the same values in specified columns, typically used with aggregate functions."
        },
        {
          question_text: "Which SQLite command is used to remove data from a table?",
          options: ["SELECT", "INSERT", "UPDATE", "DELETE", "DROP"],
          correct_answer: 3,
          explanation: "DELETE is used to remove rows from a SQLite table based on specified conditions."
        },
        {
          question_text: "What is the purpose of SQLite indexes?",
          options: ["To store data", "To improve query performance", "To validate data", "To create backups", "To sort data"],
          correct_answer: 1,
          explanation: "Indexes improve query performance by creating a data structure that allows faster data retrieval based on indexed columns."
        },
        {
          question_text: "Which SQLite data type is used to store floating-point numbers?",
          options: ["INTEGER", "TEXT", "REAL", "BLOB", "NUMERIC"],
          correct_answer: 2,
          explanation: "REAL is the SQLite data type used to store floating-point numbers (decimal numbers)."
        },
        {
          question_text: "What does the SQLite ORDER BY clause do?",
          options: ["Filters data", "Groups results", "Sorts the result set", "Limits results", "Creates indexes"],
          correct_answer: 2,
          explanation: "ORDER BY sorts the result set in ascending (ASC) or descending (DESC) order based on specified columns."
        },
        {
          question_text: "Which SQLite command is used to add new data to a table?",
          options: ["SELECT", "INSERT", "UPDATE", "DELETE", "CREATE"],
          correct_answer: 1,
          explanation: "INSERT is used to add new rows of data to a SQLite table."
        },
        {
          question_text: "What is the purpose of SQLite foreign keys?",
          options: ["To create indexes", "To link tables through relationships", "To validate data types", "To optimize queries", "To sort data"],
          correct_answer: 1,
          explanation: "Foreign keys establish relationships between tables by referencing the primary key of another table, ensuring referential integrity."
        },
        {
          question_text: "Which SQLite aggregate function calculates the average of numeric values?",
          options: ["SUM()", "COUNT()", "AVG()", "MAX()", "MIN()"],
          correct_answer: 2,
          explanation: "AVG() calculates the average (arithmetic mean) of numeric values in a column, ignoring NULL values."
        },
        {
          question_text: "What does the SQLite DISTINCT keyword accomplish?",
          options: ["Filters data", "Groups results", "Removes duplicate rows", "Sorts data", "Creates indexes"],
          correct_answer: 2,
          explanation: "DISTINCT removes duplicate rows from the result set, returning only unique combinations of values."
        }
      ],
      react: [
        {
          question_text: "What is React and what problem does it solve?",
          options: ["A database management system", "A JavaScript library for building user interfaces", "A server-side framework", "A programming language", "A testing framework"],
          correct_answer: 1,
          explanation: "React is a JavaScript library developed by Facebook for building user interfaces, particularly for single-page applications."
        },
        {
          question_text: "What is JSX in React?",
          options: ["A JavaScript extension", "A separate language", "A database query language", "A CSS preprocessor", "A testing framework"],
          correct_answer: 0,
          explanation: "JSX is a JavaScript syntax extension that allows you to write HTML-like code in JavaScript, making React components more readable."
        },
        {
          question_text: "What is a React component?",
          options: ["A function that returns JSX", "A CSS class", "A database table", "A server endpoint", "A configuration file"],
          correct_answer: 0,
          explanation: "A React component is a JavaScript function that returns JSX, representing a piece of the UI that can be reused."
        },
        {
          question_text: "What is the purpose of React hooks?",
          options: ["To style components", "To manage state and side effects in functional components", "To create animations", "To handle routing", "To manage databases"],
          correct_answer: 1,
          explanation: "React hooks allow functional components to use state and other React features like lifecycle methods."
        },
        {
          question_text: "Which hook is used to manage state in functional components?",
          options: ["useEffect", "useState", "useContext", "useReducer", "useMemo"],
          correct_answer: 1,
          explanation: "useState is the hook used to add state to functional components in React."
        },
        {
          question_text: "What does the useEffect hook do?",
          options: ["Manages state", "Handles side effects and lifecycle events", "Creates components", "Manages routing", "Handles forms"],
          correct_answer: 1,
          explanation: "useEffect is used to perform side effects in functional components, such as data fetching, subscriptions, or manually changing the DOM."
        },
        {
          question_text: "What is the virtual DOM in React?",
          options: ["A real DOM element", "A JavaScript representation of the DOM", "A CSS framework", "A database", "A server component"],
          correct_answer: 1,
          explanation: "The virtual DOM is a JavaScript representation of the real DOM that React uses to optimize updates and rendering."
        },
        {
          question_text: "What is the purpose of keys in React lists?",
          options: ["To style list items", "To help React identify which items have changed", "To create animations", "To handle clicks", "To manage state"],
          correct_answer: 1,
          explanation: "Keys help React identify which items have changed, been added, or removed, improving performance during re-renders."
        },
        {
          question_text: "What is prop drilling in React?",
          options: ["A performance optimization", "Passing props through multiple component levels", "A security feature", "A styling technique", "A testing method"],
          correct_answer: 1,
          explanation: "Prop drilling occurs when you pass props through multiple component levels, which can make code harder to maintain."
        },
        {
          question_text: "What is the purpose of React Context?",
          options: ["To style components", "To avoid prop drilling and share data globally", "To create animations", "To handle forms", "To manage routing"],
          correct_answer: 1,
          explanation: "React Context provides a way to pass data through the component tree without having to pass props down manually at every level."
        },
        {
          question_text: "What is a controlled component in React?",
          options: ["A component with no state", "A component whose form data is controlled by React state", "A component that controls other components", "A component with animations", "A component with routing"],
          correct_answer: 1,
          explanation: "A controlled component is a form element whose value is controlled by React state, allowing React to control the input."
        },
        {
          question_text: "What is the purpose of React.memo?",
          options: ["To create components", "To optimize performance by preventing unnecessary re-renders", "To handle state", "To manage routing", "To create animations"],
          correct_answer: 1,
          explanation: "React.memo is a higher-order component that memoizes the result, preventing unnecessary re-renders when props haven't changed."
        },
        {
          question_text: "What is the difference between props and state in React?",
          options: ["No difference", "Props are read-only, state can be changed", "State is read-only, props can be changed", "Props are for styling, state is for data", "State is for styling, props are for data"],
          correct_answer: 1,
          explanation: "Props are read-only data passed from parent to child components, while state is mutable data managed within a component."
        },
        {
          question_text: "What is the purpose of the useCallback hook?",
          options: ["To manage state", "To memoize functions and prevent unnecessary re-renders", "To handle side effects", "To create components", "To manage routing"],
          correct_answer: 1,
          explanation: "useCallback returns a memoized version of the callback function that only changes if one of its dependencies has changed."
        },
        {
          question_text: "What is the purpose of the useMemo hook?",
          options: ["To manage state", "To memoize expensive calculations", "To handle side effects", "To create components", "To manage routing"],
          correct_answer: 1,
          explanation: "useMemo returns a memoized value that only recalculates when one of its dependencies has changed, optimizing performance."
        },
        {
          question_text: "What is the purpose of React Router?",
          options: ["To manage state", "To handle client-side routing in React applications", "To create components", "To handle forms", "To manage databases"],
          correct_answer: 1,
          explanation: "React Router is a library that provides routing capabilities for React applications, allowing navigation between different components."
        },
        {
          question_text: "What is the purpose of React Fragments?",
          options: ["To create animations", "To group multiple elements without adding extra DOM nodes", "To manage state", "To handle forms", "To create components"],
          correct_answer: 1,
          explanation: "React Fragments allow you to group multiple elements without adding extra DOM nodes, using <>...</> or <React.Fragment>."
        },
        {
          question_text: "What is the purpose of React Portals?",
          options: ["To manage state", "To render children into a DOM node outside the parent component", "To create animations", "To handle forms", "To manage routing"],
          correct_answer: 1,
          explanation: "React Portals allow you to render children into a DOM node that exists outside the parent component's DOM hierarchy."
        },
        {
          question_text: "What is the purpose of React Error Boundaries?",
          options: ["To manage state", "To catch JavaScript errors anywhere in the component tree", "To create animations", "To handle forms", "To manage routing"],
          correct_answer: 1,
          explanation: "Error Boundaries catch JavaScript errors anywhere in the component tree and display a fallback UI instead of crashing the entire app."
        },
        {
          question_text: "What is the purpose of React Suspense?",
          options: ["To manage state", "To handle loading states and code splitting", "To create animations", "To handle forms", "To manage routing"],
          correct_answer: 1,
          explanation: "React Suspense allows components to 'wait' for something before rendering, commonly used for code splitting and data fetching."
        }
      ],
      django: [
        {
          question_text: "What is the Django ORM?",
          options: ["Object-Relational Mapping", "Object-Remote Mapping", "Object-Request Mapping", "Object-Response Mapping", "None of the above"],
          correct_answer: 0,
          explanation: "Django ORM is an Object-Relational Mapping tool."
        },
        {
          question_text: "Which file contains URL patterns in Django?",
          options: ["models.py", "views.py", "urls.py", "settings.py", "admin.py"],
          correct_answer: 2,
          explanation: "urls.py contains URL patterns and routing configuration."
        },
        {
          question_text: "What is a Django model?",
          options: ["A view", "A template", "A database table", "A URL pattern", "A middleware"],
          correct_answer: 2,
          explanation: "A Django model represents a database table and its fields."
        },
        {
          question_text: "Which command creates a Django superuser?",
          options: ["createsuperuser", "createuser", "adduser", "newuser", "superuser"],
          correct_answer: 0,
          explanation: "python manage.py createsuperuser creates a Django superuser."
        },
        {
          question_text: "What is Django's built-in admin interface?",
          options: ["A database", "A web interface", "A template", "A view", "A model"],
          correct_answer: 1,
          explanation: "Django admin is a built-in web interface for managing data."
        }
      ],
      react: [
        {
          question_text: "What is a React component?",
          options: ["A JavaScript function", "A HTML element", "A CSS class", "A database table", "All of the above"],
          correct_answer: 0,
          explanation: "A React component is a JavaScript function that returns JSX."
        },
        {
          question_text: "Which hook is used for state management?",
          options: ["useEffect", "useState", "useContext", "useReducer", "useMemo"],
          correct_answer: 1,
          explanation: "useState hook is used for managing state in functional components."
        },
        {
          question_text: "What is JSX?",
          options: ["JavaScript XML", "Java Syntax Extension", "JSON XML", "JavaScript Extension", "Java XML"],
          correct_answer: 0,
          explanation: "JSX is JavaScript XML, a syntax extension for JavaScript."
        },
        {
          question_text: "Which method is called after a component mounts?",
          options: ["componentDidMount", "componentWillMount", "componentDidUpdate", "componentWillUpdate", "render"],
          correct_answer: 0,
          explanation: "componentDidMount is called after a component is mounted to the DOM."
        },
        {
          question_text: "What is the purpose of keys in React lists?",
          options: ["Styling", "Performance optimization", "Data storage", "Event handling", "Routing"],
          correct_answer: 1,
          explanation: "Keys help React identify which items have changed, added, or removed."
        }
      ],
      general: [
        {
          question_text: "What is the purpose of version control?",
          options: ["To track changes in code", "To compile code", "To debug code", "To design interfaces", "To manage databases"],
          correct_answer: 0,
          explanation: "Version control is used to track changes in code over time."
        },
        {
          question_text: "What is Git?",
          options: ["A programming language", "A version control system", "A database", "A web framework", "An operating system"],
          correct_answer: 1,
          explanation: "Git is a distributed version control system for tracking changes in code."
        },
        {
          question_text: "What does API stand for?",
          options: ["Application Programming Interface", "Advanced Programming Interface", "Automated Programming Interface", "Application Process Interface", "Advanced Process Interface"],
          correct_answer: 0,
          explanation: "API stands for Application Programming Interface."
        },
        {
          question_text: "What is the difference between HTTP and HTTPS?",
          options: ["Speed", "Security", "Functionality", "Cost", "Compatibility"],
          correct_answer: 1,
          explanation: "HTTPS adds SSL/TLS encryption for secure data transmission."
        },
        {
          question_text: "What is a database index?",
          options: ["A table", "A query", "A performance optimization", "A constraint", "A relationship"],
          correct_answer: 2,
          explanation: "A database index is a performance optimization structure for faster data retrieval."
        }
      ]
    };

    // Sélectionner la banque de questions appropriée
    const selectedBank = questionBanks[skillName] || questionBanks.general;
    console.log('🎯 Selected question bank for skill:', skillName, 'Bank length:', selectedBank.length);
    console.log('🎯 Available question banks:', Object.keys(questionBanks));

    // Générer les questions en répétant la banque si nécessaire
    for (let i = 1; i <= questionCount; i++) {
      const questionIndex = (i - 1) % selectedBank.length;
      const baseQuestion = selectedBank[questionIndex];

      const question = {
        id: i,
        question_text: `${skillName.charAt(0).toUpperCase() + skillName.slice(1)} Question ${i}: ${baseQuestion.question_text}`,
        options: [...baseQuestion.options], // Copie pour éviter les références
        correct_answer: baseQuestion.correct_answer,
        explanation: baseQuestion.explanation
      };

      questions.push(question);
    }

    console.log(`✅ Generated ${questions.length} mock questions for ${skillName}`);
    return questions;
  };

  const startTest = async (test) => {
    console.log('🚀 startTest called with test:', test);
    console.log('🚀 test.skill:', test.skill);
    console.log('🚀 test.skill?.name:', test.skill?.name);
    console.log('🚀 test.title:', test.title);
    console.log('🚀 test.test_name:', test.test_name);

    try {
      // Charger les questions du test depuis notre API des compétences
      const response = await fetch(`http://localhost:8000/api/skills/tests/${test.id}/questions/`);
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }
      const testWithQuestions = await response.json();

      // S'assurer qu'il y a exactement 20 questions
      let questions = testWithQuestions.questions || [];
      console.log(`📝 Original questions count: ${questions.length}`);

      if (questions.length < 20) {
        // Dupliquer les questions pour atteindre 20
        const questionsNeeded = 20 - questions.length;
        const duplicatedQuestions = [];

        for (let i = 0; i < questionsNeeded; i++) {
          const originalIndex = i % questions.length;
          const originalQuestion = questions[originalIndex];

          // Convertir les options si nécessaire
          let options = originalQuestion.options || ['Option A', 'Option B', 'Option C', 'Option D'];
          if (typeof options === 'object' && !Array.isArray(options)) {
            options = Object.entries(options).map(([key, value]) => value);
          }

          const duplicatedQuestion = {
            ...originalQuestion,
            id: `duplicate_${i}_${originalQuestion.id}`,
            question_text: `${originalQuestion.question_text} (Question ${i + 1 + questions.length})`,
            options: options
          };
          duplicatedQuestions.push(duplicatedQuestion);
        }

        questions = [...questions, ...duplicatedQuestions];
        console.log(`📝 Final questions count: ${questions.length}`);
      } else if (questions.length > 20) {
        // Prendre seulement les 20 premières questions
        questions = questions.slice(0, 20);
        console.log(`📝 Trimmed to 20 questions: ${questions.length}`);
      }

      // S'assurer que toutes les questions ont des options valides
      questions = questions.map((question, index) => {
        let options = question.options || ['Option A', 'Option B', 'Option C', 'Option D'];

        // Convertir le format objet vers tableau si nécessaire
        if (typeof options === 'object' && !Array.isArray(options)) {
          options = Object.entries(options).map(([key, value]) => value);
        }

        return {
          ...question,
          id: question.id || `q_${index}`,
          options: options,
          question_text: question.question_text || `Question ${index + 1}`
        };
      });

      const finalTest = {
        ...testWithQuestions,
        questions: questions
      };

      setSelectedTest(finalTest);
      setTimeLeft(15 * 60); // 15 minutes standard
      setTestStarted(true);
      setTestCompleted(false);
      setCurrentQuestion(0);
      setAnswers({});
      setTestResult(null);

      console.log(`✅ Test started with ${questions.length} questions`);
    } catch (error) {
      console.error('❌ Erreur lors du démarrage du test:', error);
      console.log('🔄 Using mock questions fallback for test:', test.title);

      // Fallback vers des questions mock
      // Essayer d'identifier la compétence depuis le test ou utiliser 'react' par défaut
      let skillForQuestions = 'react'; // Par défaut pour les tests React

      if (test.skill?.name) {
        skillForQuestions = test.skill.name;
      } else if (test.title) {
        const title = test.title.toLowerCase();
        if (title.includes('sqlite')) {
          skillForQuestions = 'sqlite';
        } else if (title.includes('javascript')) {
          skillForQuestions = 'javascript';
        } else if (title.includes('python')) {
          skillForQuestions = 'python';
        } else if (title.includes('django')) {
          skillForQuestions = 'django';
        }
      }

      console.log('🔍 Using skill for mock questions:', skillForQuestions);
      const mockQuestions = generateMockQuestions(test, skillForQuestions);

      const finalTest = {
        ...test,
        questions: mockQuestions
      };

      setSelectedTest(finalTest);
      setTimeLeft(test.timeLimit * 60); // Utiliser la durée du test
      setTestStarted(true);
      setTestCompleted(false);
      setCurrentQuestion(0);
      setAnswers({});
      setTestResult(null);

      console.log(`✅ Test started with ${mockQuestions.length} mock questions`);
    }
  };

  const submitAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < selectedTest.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      finishTest();
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const finishTest = async () => {
    try {
      console.log('🏁 Finishing test...');

      // Calculer le temps écoulé
      const totalTime = 15 * 60; // 15 minutes en secondes
      const timeElapsed = totalTime - timeLeft;
      const minutes = Math.floor(timeElapsed / 60);
      const seconds = timeElapsed % 60;

      console.log(`⏱️ Time elapsed: ${minutes}:${seconds.toString().padStart(2, '0')}`);

      // Calculer le score basé sur les vraies réponses
      const totalQuestions = selectedTest.questions.length;
      const answeredQuestions = Object.keys(answers).length;
      let correctAnswers = 0;

      // Calculer le nombre de bonnes réponses en comparant avec les réponses correctes
      selectedTest.questions.forEach((question, index) => {
        const userAnswer = answers[index];
        if (userAnswer !== undefined && userAnswer !== null) {
          // Vérifier si la réponse est correcte
          let correctAnswer = question.correct_answer;
          
          // Gérer différents formats de réponses correctes
          if (typeof correctAnswer === 'number') {
            // Format numérique (0, 1, 2, 3)
            if (userAnswer === correctAnswer) {
              correctAnswers++;
            }
          } else if (typeof correctAnswer === 'string') {
            // Format string (A, B, C, D)
            const answerMap = { 0: 'A', 1: 'B', 2: 'C', 3: 'D' };
            if (answerMap[userAnswer] === correctAnswer) {
              correctAnswers++;
            }
          } else if (Array.isArray(correctAnswer)) {
            // Format array (multiple correct answers)
            if (correctAnswer.includes(userAnswer)) {
              correctAnswers++;
            }
          }
        }
      });

      const percentage = Math.round((correctAnswers / totalQuestions) * 100);

      console.log(`📊 Score calculation:`, {
        totalQuestions,
        answeredQuestions,
        correctAnswers,
        percentage,
        timeElapsed: `${minutes}:${seconds.toString().padStart(2, '0')}`
      });

      // Créer le résultat du test
      const testResultData = {
        testId: selectedTest.id,
        testName: selectedTest.test?.test_name || 'Test Technique',
        skill: selectedTest.test?.skill || 'Unknown',
        score: correctAnswers,
        totalQuestions: totalQuestions,
        percentage: percentage,
        timeElapsed: timeElapsed,
        timeFormatted: `${minutes}:${seconds.toString().padStart(2, '0')}`,
        answeredQuestions: answeredQuestions,
        isPassed: percentage >= 70,
        grade: percentage >= 90 ? 'A' : percentage >= 80 ? 'B' : percentage >= 70 ? 'C' : 'D'
      };

      setTestResult(testResultData);
      setTestStarted(false);
      setTestCompleted(true);

      console.log('✅ Test completed with result:', testResultData);

    } catch (error) {
      console.error('❌ Erreur lors de la fin du test:', error);

      // Créer un résultat de fallback en cas d'erreur
      const fallbackResult = {
        testId: selectedTest.id,
        testName: selectedTest.test?.test_name || 'Test Technique',
        skill: selectedTest.test?.skill || 'Unknown',
        score: 0,
        totalQuestions: selectedTest.questions.length,
        percentage: 0,
        timeElapsed: 0,
        timeFormatted: '0:00',
        answeredQuestions: 0,
        isPassed: false,
        grade: 'F',
        error: 'Erreur lors du calcul du score'
      };

      setTestResult(fallbackResult);
      setTestStarted(false);
      setTestCompleted(true);
    }
  };

  const backToTests = () => {
    setSelectedTest(null);
    setTestStarted(false);
    setTestCompleted(false);
    setTestResult(null);
    loadUserSkillsAndTests(); // Recharger pour mise à jour
  };

  // Timer
  useEffect(() => {
    if (testStarted && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (testStarted && timeLeft === 0) {
      finishTest();
    }
  }, [testStarted, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <div className="ml-4 text-lg">Chargement des tests...</div>
      </div>
    );
  }

  // Vue des résultats
  if (testCompleted && testResult) {
    const percentage = testResult.percentage || 0;
    const score = testResult.score || 0;
    const totalQuestions = testResult.totalQuestions || 20;
    const timeFormatted = testResult.timeFormatted || '0:00';
    const isPassed = testResult.isPassed || false;
    const grade = testResult.grade || 'F';

    const getScoreColor = (perc) => {
      if (perc >= 80) return 'text-green-600';
      if (perc >= 60) return 'text-yellow-600';
      return 'text-red-600';
    };

    const getScoreBgColor = (perc) => {
      if (perc >= 80) return 'bg-green-100';
      if (perc >= 60) return 'bg-yellow-100';
      return 'bg-red-100';
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 text-center">
            <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${isPassed ? 'bg-green-500' : 'bg-red-500'
              }`}>
              <FaCheckCircle className="text-4xl text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Test Terminé !</h1>
            <p className="text-blue-100">{testResult.testName || 'Test Technique'}</p>
            <p className="text-blue-200 text-sm">Compétence: {testResult.skill || 'Unknown'}</p>
          </div>

          {/* Results */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className={`${getScoreBgColor(percentage)} p-6 rounded-xl text-center`}>
                <p className="text-sm text-gray-600 mb-2">Score</p>
                <p className={`text-4xl font-bold ${getScoreColor(percentage)}`}>
                  {score} / {totalQuestions}
                </p>
                <p className="text-sm text-gray-500 mt-1">bonnes réponses</p>
              </div>

              <div className={`${getScoreBgColor(percentage)} p-6 rounded-xl text-center`}>
                <p className="text-sm text-gray-600 mb-2">Pourcentage</p>
                <p className={`text-4xl font-bold ${getScoreColor(percentage)}`}>
                  {percentage}%
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {isPassed ? 'Réussi' : 'Échoué'}
                </p>
              </div>

              <div className="bg-gray-100 p-6 rounded-xl text-center">
                <p className="text-sm text-gray-600 mb-2">Temps</p>
                <p className="text-4xl font-bold text-gray-700">
                  {timeFormatted}
                </p>
                <p className="text-sm text-gray-500 mt-1">minutes</p>
              </div>
            </div>

            {/* Grade and Details */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <div className="text-center">
                <div className="inline-flex items-center gap-3 mb-4">
                  <span className="text-lg font-medium text-gray-700">Note:</span>
                  <span className={`text-3xl font-bold px-4 py-2 rounded-lg ${grade === 'A' ? 'bg-green-500 text-white' :
                    grade === 'B' ? 'bg-blue-500 text-white' :
                      grade === 'C' ? 'bg-yellow-500 text-white' :
                        'bg-red-500 text-white'
                    }`}>
                    {grade}
                  </span>
                </div>
                <p className="text-gray-600">
                  {testResult.answeredQuestions || 0} questions répondues sur {totalQuestions}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={backToTests}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
              >
                <FaQuestionCircle />
                Retour aux tests
              </button>
              <button
                onClick={onBackToDashboard}
                className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
              >
                <FaCheckCircle />
                Retour au dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vue du test en cours
  if (selectedTest && testStarted) {
    // Safety checks for questions
    if (!selectedTest.questions || selectedTest.questions.length === 0) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaTimes className="text-red-500 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Aucune question trouvée</h3>
            <p className="text-gray-600 mb-6">Ce test ne contient aucune question disponible.</p>
            <button
              onClick={() => setSelectedTest(null)}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Retour aux tests
            </button>
          </div>
        </div>
      );
    }

    if (currentQuestion >= selectedTest.questions.length) {
      console.error('Current question index out of bounds:', currentQuestion, 'Total questions:', selectedTest.questions.length);
      setCurrentQuestion(0); // Reset to first question
      return null;
    }

    const question = selectedTest.questions[currentQuestion];

    // Additional safety check for the question object
    if (!question) {
      return (
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">Erreur: Question introuvable</h3>
            <p className="text-gray-500 mb-6">La question {currentQuestion + 1} n'existe pas.</p>
            <button
              onClick={() => setSelectedTest(null)}
              className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg transition-colors"
            >
              Retour aux tests
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto p-6">
        {/* Header du test */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{selectedTest.title}</h1>
              <p className="text-gray-600">Question {currentQuestion + 1} sur {selectedTest.questions.length}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center ${timeLeft < 300 ? 'text-red-500' : 'text-blue-500'}`}>
                <FaClock className="mr-2" />
                <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / selectedTest.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">
            {question?.question_text || question?.text || "Question non disponible"}
          </h2>

          <div className="space-y-3">
            {['a', 'b', 'c', 'd'].map(option => {
              // Handle different option formats
              let optionText = '';
              if (question[`option_${option}`]) {
                // Django format: option_a, option_b, etc.
                optionText = question[`option_${option}`];
              } else if (question.options && Array.isArray(question.options)) {
                // Array format: options[0], options[1], etc.
                const optionIndex = option === 'a' ? 0 : option === 'b' ? 1 : option === 'c' ? 2 : 3;
                optionText = question.options[optionIndex];
              } else if (question.options && typeof question.options === 'object' && !Array.isArray(question.options)) {
                // Object format: {A: "option1", B: "option2", C: "option3", D: "option4"}
                const optionKey = option.toUpperCase();
                optionText = question.options[optionKey] || `Option ${optionKey} non disponible`;
                console.log(`🔍 Object format - Option ${optionKey}:`, optionText);
              } else {
                optionText = `Option ${option.toUpperCase()} non disponible`;
                console.log(`❌ No options found for question:`, question);
              }

              return (
                <button
                  key={option}
                  onClick={() => submitAnswer(question.id, option)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${answers[question.id] === option
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <span className="font-semibold mr-3">{option.toUpperCase()}.</span>
                  {optionText}
                </button>
              );
            })}
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
              className="px-6 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              Précédent
            </button>

            <button
              onClick={nextQuestion}
              disabled={!answers[question.id]}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600 transition-colors"
            >
              {currentQuestion === selectedTest.questions.length - 1 ? 'Terminer' : 'Suivant'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Vue de la liste des tests
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={onBackToDashboard}
          className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <FaArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {skillId ?
              `Tests - ${userSkills.find(skill => skill.id === skillId)?.name || 'Compétence'}` :
              'Tests par Compétence'
            }
          </h1>
          <p className="text-gray-600 mt-2">
            {skillId ?
              `Tests techniques spécifiques à ${userSkills.find(skill => skill.id === skillId)?.name || 'cette compétence'}` :
              'Passez des tests techniques basés sur vos compétences déclarées'
            }
          </p>
        </div>
      </div>

      {/* Mes compétences */}
      {userSkills.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Mes Compétences</h2>
          <div className="flex flex-wrap gap-2">
            {userSkills.map(skill => (
              <span
                key={skill.id}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tests disponibles ou messages */}
      {availableTests.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">Aucun test disponible</h3>
          <p className="text-gray-500 mb-6">
            Aucun test technique n'est actuellement disponible.
            <br />
            Les administrateurs peuvent créer des tests dans l'interface d'administration.
          </p>
          <button
            onClick={onBackToDashboard}
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg transition-colors"
          >
            Retour au tableau de bord
          </button>
        </div>
      ) : (
        /* Tests disponibles */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableTests.map(test => {
            return (
              <div key={test.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{test.title}</h3>
                    <p className="text-sm text-blue-600 font-medium">
                      Test technique - {test.test_type}
                    </p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Disponible
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {test.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <FaQuestionCircle className="mr-1" />
                    <span>{test.total_questions} questions</span>
                  </div>
                  <div className="flex items-center">
                    <FaClock className="mr-1" />
                    <span>{test.duration_minutes} min</span>
                  </div>
                  <div className="font-medium">
                    Seuil: {test.passing_score}%
                  </div>
                </div>

                <button
                  onClick={() => startTest(test)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  <FaPlay className="mr-2" />
                  Commencer le test
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SkillBasedTests;
