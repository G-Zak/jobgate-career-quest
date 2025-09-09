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
