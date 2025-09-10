const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure database directory exists
const dbDir = path.join(__dirname);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'skills.db');

class DatabaseConnection {
    constructor() {
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Error opening database:', err.message);
            } else {
                console.log('Connected to SQLite database');
                this.initializeTables();
            }
        });
    }

    initializeTables() {
        // Create skills table
        this.db.run(`
            CREATE TABLE IF NOT EXISTS skills (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(100) NOT NULL UNIQUE,
                category VARCHAR(50) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) console.error('Error creating skills table:', err);
        });

        // Create technical_questions table
        this.db.run(`
            CREATE TABLE IF NOT EXISTS technical_questions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                skill_id INTEGER NOT NULL,
                question TEXT NOT NULL,
                option_a TEXT NOT NULL,
                option_b TEXT NOT NULL,
                option_c TEXT NOT NULL,
                option_d TEXT NOT NULL,
                correct_answer CHAR(1) NOT NULL,
                difficulty_level INTEGER DEFAULT 1,
                explanation TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (skill_id) REFERENCES skills (id)
            )
        `, (err) => {
            if (err) console.error('Error creating technical_questions table:', err);
        });

        // Create user_skills table
        this.db.run(`
            CREATE TABLE IF NOT EXISTS user_skills (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id VARCHAR(100) NOT NULL,
                skill_id INTEGER NOT NULL,
                proficiency_level VARCHAR(20) DEFAULT 'beginner',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (skill_id) REFERENCES skills (id),
                UNIQUE(user_id, skill_id)
            )
        `, (err) => {
            if (err) console.error('Error creating user_skills table:', err);
        });

        // Create custom_tests table (pour vos tests personnalisés)
        this.db.run(`
            CREATE TABLE IF NOT EXISTS custom_tests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                skill_id INTEGER NOT NULL,
                test_name VARCHAR(200) NOT NULL,
                description TEXT,
                total_score INTEGER NOT NULL DEFAULT 10,
                time_limit INTEGER DEFAULT 30,
                instructions TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (skill_id) REFERENCES skills (id)
            )
        `, (err) => {
            if (err) console.error('Error creating custom_tests table:', err);
        });

        // Create test_questions table (questions pour vos tests)
        this.db.run(`
            CREATE TABLE IF NOT EXISTS test_questions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                test_id INTEGER NOT NULL,
                question_text TEXT NOT NULL,
                question_type VARCHAR(20) DEFAULT 'multiple_choice',
                option_a TEXT,
                option_b TEXT,
                option_c TEXT,
                option_d TEXT,
                correct_answer TEXT NOT NULL,
                points INTEGER DEFAULT 1,
                explanation TEXT,
                question_order INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (test_id) REFERENCES custom_tests (id)
            )
        `, (err) => {
            if (err) console.error('Error creating test_questions table:', err);
        });

        // Create user_test_results table (résultats des tests)
        this.db.run(`
            CREATE TABLE IF NOT EXISTS user_test_results (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id VARCHAR(100) NOT NULL,
                test_id INTEGER NOT NULL,
                score INTEGER NOT NULL,
                total_score INTEGER NOT NULL,
                percentage DECIMAL(5,2),
                time_taken INTEGER,
                completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                answers_data TEXT,
                FOREIGN KEY (test_id) REFERENCES custom_tests (id)
            )
        `, (err) => {
            if (err) console.error('Error creating user_test_results table:', err);
            else this.seedInitialData();
        });
    }

    seedInitialData() {
        // Check if skills already exist
        this.db.get("SELECT COUNT(*) as count FROM skills", (err, row) => {
            if (err) {
                console.error('Error checking skills count:', err);
                return;
            }

            if (row.count === 0) {
                // Insert basic skills
                const skills = [
                    ['Python', 'Programming Language', 'High-level programming language'],
                    ['Java', 'Programming Language', 'Object-oriented programming language'],
                    ['JavaScript', 'Programming Language', 'Web development scripting language'],
                    ['React', 'Frontend Framework', 'JavaScript library for building user interfaces'],
                    ['Node.js', 'Backend Technology', 'JavaScript runtime for server-side development'],
                    ['SQL', 'Database', 'Structured Query Language for database management'],
                    ['HTML', 'Web Technology', 'Markup language for creating web pages'],
                    ['CSS', 'Web Technology', 'Style sheet language for web design'],
                    ['Git', 'Version Control', 'Distributed version control system'],
                    ['Docker', 'DevOps', 'Containerization platform'],
                    ['Angular', 'Frontend Framework', 'TypeScript-based web application framework'],
                    ['Vue.js', 'Frontend Framework', 'Progressive JavaScript framework'],
                    ['PHP', 'Programming Language', 'Server-side scripting language'],
                    ['C++', 'Programming Language', 'General-purpose programming language'],
                    ['MongoDB', 'Database', 'NoSQL document database'],
                    ['PostgreSQL', 'Database', 'Open source relational database'],
                    ['MySQL', 'Database', 'Open source relational database management system'],
                    ['Redis', 'Database', 'In-memory data structure store'],
                    ['AWS', 'Cloud Platform', 'Amazon Web Services cloud computing platform'],
                    ['Azure', 'Cloud Platform', 'Microsoft cloud computing platform']
                ];

                const insertSkill = this.db.prepare(`
                    INSERT OR IGNORE INTO skills (name, category, description) VALUES (?, ?, ?)
                `);

                skills.forEach(skill => {
                    insertSkill.run(skill, (err) => {
                        if (err) console.error('Error inserting skill:', err);
                    });
                });

                insertSkill.finalize(() => {
                    console.log('Initial skills data seeded successfully');
                    this.seedTechnicalQuestions();
                });
            }
        });
    }

    seedTechnicalQuestions() {
        // Sample technical questions for each skill
        const questions = [
            // Python questions
            {
                skill_name: 'Python',
                question: 'What is the output of the following Python code?\n\nx = [1, 2, 3]\ny = x\ny.append(4)\nprint(x)',
                option_a: '[1, 2, 3]',
                option_b: '[1, 2, 3, 4]',
                option_c: '[4]',
                option_d: 'Error',
                correct_answer: 'b',
                difficulty_level: 2,
                explanation: 'In Python, lists are mutable objects. When y = x, both variables reference the same list object. Modifying y also affects x.'
            },
            {
                skill_name: 'Python',
                question: 'Which of the following is used to handle exceptions in Python?',
                option_a: 'try-catch',
                option_b: 'try-except',
                option_c: 'try-finally',
                option_d: 'catch-except',
                correct_answer: 'b',
                difficulty_level: 1,
                explanation: 'Python uses try-except blocks to handle exceptions, unlike some other languages that use try-catch.'
            },
            {
                skill_name: 'Python',
                question: 'What does the len() function return for the string "Hello"?',
                option_a: '4',
                option_b: '5',
                option_c: '6',
                option_d: 'Error',
                correct_answer: 'b',
                difficulty_level: 1,
                explanation: 'The len() function returns the number of characters in a string. "Hello" has 5 characters.'
            },
            // JavaScript questions
            {
                skill_name: 'JavaScript',
                question: 'What does the following JavaScript code return?\n\nconsole.log(typeof null);',
                option_a: 'null',
                option_b: 'undefined',
                option_c: 'object',
                option_d: 'boolean',
                correct_answer: 'c',
                difficulty_level: 2,
                explanation: 'This is a well-known quirk in JavaScript. typeof null returns "object" due to a legacy bug in the language.'
            },
            {
                skill_name: 'JavaScript',
                question: 'Which method is used to add an element to the end of an array in JavaScript?',
                option_a: 'add()',
                option_b: 'append()',
                option_c: 'push()',
                option_d: 'insert()',
                correct_answer: 'c',
                difficulty_level: 1,
                explanation: 'The push() method adds one or more elements to the end of an array and returns the new length of the array.'
            },
            {
                skill_name: 'JavaScript',
                question: 'What is the result of 2 + "3" in JavaScript?',
                option_a: '5',
                option_b: '"23"',
                option_c: 'Error',
                option_d: 'NaN',
                correct_answer: 'b',
                difficulty_level: 1,
                explanation: 'JavaScript performs type coercion. When adding a number and a string, the number is converted to a string and concatenated.'
            },
            // Java questions
            {
                skill_name: 'Java',
                question: 'What is the correct way to create an object of a class named "Car" in Java?',
                option_a: 'Car myCar = new Car();',
                option_b: 'Car myCar = Car();',
                option_c: 'new Car myCar = Car();',
                option_d: 'Car myCar = create Car();',
                correct_answer: 'a',
                difficulty_level: 1,
                explanation: 'In Java, objects are created using the "new" keyword followed by the constructor call.'
            },
            {
                skill_name: 'Java',
                question: 'Which of the following is NOT a Java primitive data type?',
                option_a: 'int',
                option_b: 'String',
                option_c: 'boolean',
                option_d: 'double',
                correct_answer: 'b',
                difficulty_level: 1,
                explanation: 'String is not a primitive data type in Java; it is a reference type (class). The primitive types include int, boolean, double, char, etc.'
            },
            // React questions
            {
                skill_name: 'React',
                question: 'What is the correct way to pass data from a parent component to a child component in React?',
                option_a: 'Using state',
                option_b: 'Using props',
                option_c: 'Using context',
                option_d: 'Using refs',
                correct_answer: 'b',
                difficulty_level: 1,
                explanation: 'Props (properties) are the primary way to pass data from parent to child components in React.'
            },
            {
                skill_name: 'React',
                question: 'Which hook is used to manage state in functional components?',
                option_a: 'useEffect',
                option_b: 'useState',
                option_c: 'useContext',
                option_d: 'useReducer',
                correct_answer: 'b',
                difficulty_level: 1,
                explanation: 'useState is the primary hook for managing local state in functional components.'
            },
            // SQL questions
            {
                skill_name: 'SQL',
                question: 'Which SQL clause is used to filter records?',
                option_a: 'FILTER',
                option_b: 'WHERE',
                option_c: 'SELECT',
                option_d: 'HAVING',
                correct_answer: 'b',
                difficulty_level: 1,
                explanation: 'The WHERE clause is used to filter records that meet a certain condition.'
            },
            {
                skill_name: 'SQL',
                question: 'Which SQL command is used to retrieve data from a database?',
                option_a: 'GET',
                option_b: 'FETCH',
                option_c: 'SELECT',
                option_d: 'RETRIEVE',
                correct_answer: 'c',
                difficulty_level: 1,
                explanation: 'SELECT is the SQL command used to query and retrieve data from a database.'
            },
            // HTML questions
            {
                skill_name: 'HTML',
                question: 'Which HTML tag is used to create a hyperlink?',
                option_a: '<link>',
                option_b: '<a>',
                option_c: '<href>',
                option_d: '<url>',
                correct_answer: 'b',
                difficulty_level: 1,
                explanation: 'The <a> (anchor) tag is used to create hyperlinks in HTML.'
            },
            {
                skill_name: 'HTML',
                question: 'What does HTML stand for?',
                option_a: 'Hyper Text Markup Language',
                option_b: 'High Tech Modern Language',
                option_c: 'Home Tool Markup Language',
                option_d: 'Hyperlink and Text Markup Language',
                correct_answer: 'a',
                difficulty_level: 1,
                explanation: 'HTML stands for HyperText Markup Language, which is the standard markup language for creating web pages.'
            },
            // CSS questions
            {
                skill_name: 'CSS',
                question: 'Which CSS property is used to change the text color of an element?',
                option_a: 'text-color',
                option_b: 'font-color',
                option_c: 'color',
                option_d: 'text-style',
                correct_answer: 'c',
                difficulty_level: 1,
                explanation: 'The "color" property in CSS is used to set the color of the text.'
            },
            {
                skill_name: 'CSS',
                question: 'Which CSS property is used to make text bold?',
                option_a: 'font-weight',
                option_b: 'text-weight',
                option_c: 'font-style',
                option_d: 'text-style',
                correct_answer: 'a',
                difficulty_level: 1,
                explanation: 'The font-weight property is used to set the weight (boldness) of the font. Use font-weight: bold; to make text bold.'
            }
        ];

        // Insert questions for each skill
        questions.forEach(q => {
            // First get the skill_id
            this.db.get("SELECT id FROM skills WHERE name = ?", [q.skill_name], (err, row) => {
                if (err) {
                    console.error('Error getting skill ID:', err);
                    return;
                }
                
                if (row) {
                    this.db.run(`
                        INSERT OR IGNORE INTO technical_questions 
                        (skill_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty_level, explanation)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `, [
                        row.id, q.question, q.option_a, q.option_b, 
                        q.option_c, q.option_d, q.correct_answer, 
                        q.difficulty_level, q.explanation
                    ], (err) => {
                        if (err) console.error('Error inserting question:', err);
                    });
                }
            });
        });

        console.log('Technical questions seeded successfully');
        
        // Seed custom tests
        this.seedCustomTests();
    }

    seedCustomTests() {
        // Vérifier si des tests personnalisés existent déjà
        this.db.get("SELECT COUNT(*) as count FROM custom_tests", (err, row) => {
            if (err) {
                console.error('Error checking custom tests count:', err);
                return;
            }

            if (row.count === 0) {
                // Créer des tests d'exemple pour chaque compétence
                const customTests = [
                    {
                        skill_name: 'JavaScript',
                        test_name: 'Test JavaScript Fondamentaux',
                        description: 'Évaluation des connaissances de base en JavaScript',
                        total_score: 20,
                        time_limit: 30,
                        instructions: 'Répondez à toutes les questions. Vous avez 30 minutes.',
                        questions: [
                            {
                                question_text: 'Que fait la méthode Array.push() en JavaScript ?',
                                option_a: 'Supprime le dernier élément',
                                option_b: 'Ajoute un élément à la fin',
                                option_c: 'Trie le tableau',
                                option_d: 'Inverse le tableau',
                                correct_answer: 'b',
                                points: 2,
                                explanation: 'push() ajoute un ou plusieurs éléments à la fin d\'un tableau'
                            },
                            {
                                question_text: 'Comment déclarer une variable en JavaScript ?',
                                option_a: 'variable x = 5;',
                                option_b: 'var x = 5;',
                                option_c: 'x := 5;',
                                option_d: 'declare x = 5;',
                                correct_answer: 'b',
                                points: 2,
                                explanation: 'On utilise var, let ou const pour déclarer des variables'
                            },
                            {
                                question_text: 'Que retourne typeof null en JavaScript ?',
                                option_a: 'null',
                                option_b: 'undefined',
                                option_c: 'object',
                                option_d: 'string',
                                correct_answer: 'c',
                                points: 3,
                                explanation: 'C\'est un bug historique de JavaScript: typeof null retourne "object"'
                            }
                        ]
                    },
                    {
                        skill_name: 'Python',
                        test_name: 'Test Python Avancé',
                        description: 'Test des concepts avancés en Python',
                        total_score: 15,
                        time_limit: 25,
                        instructions: 'Questions de niveau intermédiaire à avancé.',
                        questions: [
                            {
                                question_text: 'Que fait la méthode list.extend() ?',
                                option_a: 'Ajoute un élément à la fin',
                                option_b: 'Étend la liste avec les éléments d\'un itérable',
                                option_c: 'Supprime tous les éléments',
                                option_d: 'Trie la liste',
                                correct_answer: 'b',
                                points: 3,
                                explanation: 'extend() ajoute tous les éléments d\'un itérable à la fin de la liste'
                            },
                            {
                                question_text: 'Qu\'est-ce qu\'un décorateur en Python ?',
                                option_a: 'Une fonction qui modifie une autre fonction',
                                option_b: 'Un type de données',
                                option_c: 'Une méthode de classe',
                                option_d: 'Un module',
                                correct_answer: 'a',
                                points: 4,
                                explanation: 'Un décorateur est une fonction qui prend une autre fonction en argument et étend son comportement'
                            }
                        ]
                    },
                    {
                        skill_name: 'Java',
                        test_name: 'Test Java OOP',
                        description: 'Programmation orientée objet en Java',
                        total_score: 25,
                        time_limit: 40,
                        instructions: 'Focus sur les concepts OOP.',
                        questions: [
                            {
                                question_text: 'Qu\'est-ce que l\'encapsulation en Java ?',
                                option_a: 'Masquer les détails d\'implémentation',
                                option_b: 'Créer des objets',
                                option_c: 'Hériter de classes',
                                option_d: 'Gérer les exceptions',
                                correct_answer: 'a',
                                points: 5,
                                explanation: 'L\'encapsulation consiste à masquer les détails internes d\'une classe'
                            }
                        ]
                    }
                ];

                // Insérer chaque test
                customTests.forEach(testData => {
                    // D'abord récupérer l'ID de la compétence
                    this.db.get("SELECT id FROM skills WHERE name = ?", [testData.skill_name], (err, skillRow) => {
                        if (err || !skillRow) {
                            console.error('Error getting skill ID for test:', err);
                            return;
                        }

                        // Insérer le test
                        this.db.run(`
                            INSERT INTO custom_tests (skill_id, test_name, description, total_score, time_limit, instructions)
                            VALUES (?, ?, ?, ?, ?, ?)
                        `, [
                            skillRow.id, testData.test_name, testData.description,
                            testData.total_score, testData.time_limit, testData.instructions
                        ], function(err) {
                            if (err) {
                                console.error('Error inserting custom test:', err);
                                return;
                            }

                            const testId = this.lastID;

                            // Insérer les questions pour ce test
                            testData.questions.forEach((question, index) => {
                                this.db.run(`
                                    INSERT INTO test_questions 
                                    (test_id, question_text, option_a, option_b, option_c, option_d, correct_answer, points, explanation, question_order)
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                                `, [
                                    testId, question.question_text, question.option_a, question.option_b,
                                    question.option_c, question.option_d, question.correct_answer,
                                    question.points, question.explanation, index + 1
                                ], (err) => {
                                    if (err) console.error('Error inserting test question:', err);
                                });
                            });
                        });
                    });
                });

                console.log('Custom tests seeded successfully');
            }
        });
    }

    getDatabase() {
        return this.db;
    }

    close() {
        return new Promise((resolve) => {
            this.db.close((err) => {
                if (err) {
                    console.error('Error closing database:', err);
                } else {
                    console.log('Database connection closed');
                }
                resolve();
            });
        });
    }
}

module.exports = new DatabaseConnection();
