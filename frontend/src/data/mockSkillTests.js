/**
 * Mock data for skill tests
 * Used as fallback when backend API is not available
 */

export const mockSkillTests = {
 "Python": {
 "skill": {
 "id": 1,
 "name": "Python",
 "category": "programming",
 "description": "Python programming language"
 },
 "tests": [
 {
 "id": 1,
 "test_name": "Python Fundamentals Test",
 "description": "Test your Python programming fundamentals",
 "instructions": "Answer all questions. Each question has only one correct answer.",
 "time_limit": 30,
 "total_score": 100,
 "question_count": 3,
 "difficulty": "Intermediate",
 "created_at": "2024-01-15T10:00:00Z"
 }
 ]
 },
 "JavaScript": {
 "skill": {
 "id": 2,
 "name": "JavaScript",
 "category": "programming",
 "description": "JavaScript programming language"
 },
 "tests": [
 {
 "id": 2,
 "test_name": "JavaScript Essentials Test",
 "description": "Test your JavaScript programming knowledge",
 "instructions": "Answer all questions. Each question has only one correct answer.",
 "time_limit": 25,
 "total_score": 100,
 "question_count": 2,
 "difficulty": "Intermediate",
 "created_at": "2024-01-15T10:00:00Z"
 }
 ]
 },
 "React": {
 "skill": {
 "id": 3,
 "name": "React",
 "category": "frontend",
 "description": "React JavaScript library"
 },
 "tests": [
 {
 "id": 3,
 "test_name": "React Components Test",
 "description": "Test your React component knowledge",
 "instructions": "Answer all questions about React components and hooks.",
 "time_limit": 20,
 "total_score": 100,
 "question_count": 2,
 "difficulty": "Intermediate",
 "created_at": "2024-01-15T10:00:00Z"
 }
 ]
 },
 "Django": {
 "skill": {
 "id": 4,
 "name": "Django",
 "category": "backend",
 "description": "Django web framework"
 },
 "tests": [
 {
 "id": 4,
 "test_name": "Django Framework Test",
 "description": "Test your Django web framework knowledge",
 "instructions": "Answer questions about Django models, views, and templates.",
 "time_limit": 35,
 "total_score": 100,
 "question_count": 2,
 "difficulty": "Intermediate",
 "created_at": "2024-01-15T10:00:00Z"
 }
 ]
 },
 "SQL": {
 "skill": {
 "id": 5,
 "name": "SQL",
 "category": "database",
 "description": "Structured Query Language"
 },
 "tests": [
 {
 "id": 5,
 "test_name": "SQL Database Test",
 "description": "Test your SQL database query knowledge",
 "instructions": "Answer questions about SQL queries and database operations.",
 "time_limit": 25,
 "total_score": 100,
 "question_count": 2,
 "difficulty": "Intermediate",
 "created_at": "2024-01-15T10:00:00Z"
 }
 ]
 },
 "Git": {
 "skill": {
 "id": 6,
 "name": "Git",
 "category": "other",
 "description": "Git version control system"
 },
 "tests": [
 {
 "id": 6,
 "test_name": "Git Version Control Test",
 "description": "Test your Git version control knowledge",
 "instructions": "Answer questions about Git commands and workflows.",
 "time_limit": 20,
 "total_score": 100,
 "question_count": 2,
 "difficulty": "Intermediate",
 "created_at": "2024-01-15T10:00:00Z"
 }
 ]
 }
};

export const mockTestQuestions = {
 1: {
 "test": {
 "id": 1,
 "test_name": "Python Fundamentals Test",
 "skill": "Python",
 "description": "Test your Python programming fundamentals",
 "instructions": "Answer all questions. Each question has only one correct answer.",
 "time_limit": 30,
 "total_score": 100,
 "question_count": 3
 },
 "questions": [
 {
 "id": 1,
 "order": 1,
 "question_text": "What is the correct way to create a list in Python?",
 "options": {
 "A": "list = []",
 "B": "list = {}",
 "C": "list = ()",
 "D": "list = []"
 }
 },
 {
 "id": 2,
 "order": 2,
 "question_text": "Which keyword is used to define a function in Python?",
 "options": {
 "A": "function",
 "B": "def",
 "C": "func",
 "D": "define"
 }
 },
 {
 "id": 3,
 "order": 3,
 "question_text": "What does the len() function do?",
 "options": {
 "A": "Returns the length of a string or list",
 "B": "Returns the maximum value",
 "C": "Returns the minimum value",
 "D": "Returns the sum of elements"
 }
 }
 ]
 },
 2: {
 "test": {
 "id": 2,
 "test_name": "JavaScript Essentials Test",
 "skill": "JavaScript",
 "description": "Test your JavaScript programming knowledge",
 "instructions": "Answer all questions. Each question has only one correct answer.",
 "time_limit": 25,
 "total_score": 100,
 "question_count": 2
 },
 "questions": [
 {
 "id": 4,
 "order": 1,
 "question_text": "What is the correct way to declare a variable in JavaScript?",
 "options": {
 "A": "var name = \"John\"",
 "B": "variable name = \"John\"",
 "C": "v name = \"John\"",
 "D": "declare name = \"John\""
 }
 },
 {
 "id": 5,
 "order": 2,
 "question_text": "Which method is used to add an element to the end of an array?",
 "options": {
 "A": "push()",
 "B": "add()",
 "C": "append()",
 "D": "insert()"
 }
 }
 ]
 },
 3: {
 "test": {
 "id": 3,
 "test_name": "React Components Test",
 "skill": "React",
 "description": "Test your React component knowledge",
 "instructions": "Answer all questions about React components and hooks.",
 "time_limit": 20,
 "total_score": 100,
 "question_count": 2
 },
 "questions": [
 {
 "id": 6,
 "order": 1,
 "question_text": "What is a React component?",
 "options": {
 "A": "A JavaScript function that returns HTML",
 "B": "A CSS class",
 "C": "A database table",
 "D": "A server-side function"
 }
 },
 {
 "id": 7,
 "order": 2,
 "question_text": "Which hook is used to manage state in functional components?",
 "options": {
 "A": "useState",
 "B": "useEffect",
 "C": "useContext",
 "D": "useReducer"
 }
 }
 ]
 },
 4: {
 "test": {
 "id": 4,
 "test_name": "Django Framework Test",
 "skill": "Django",
 "description": "Test your Django web framework knowledge",
 "instructions": "Answer questions about Django models, views, and templates.",
 "time_limit": 35,
 "total_score": 100,
 "question_count": 2
 },
 "questions": [
 {
 "id": 8,
 "order": 1,
 "question_text": "What is Django?",
 "options": {
 "A": "A Python web framework",
 "B": "A JavaScript library",
 "C": "A database system",
 "D": "A CSS framework"
 }
 },
 {
 "id": 9,
 "order": 2,
 "question_text": "Which file contains Django URL patterns?",
 "options": {
 "A": "urls.py",
 "B": "views.py",
 "C": "models.py",
 "D": "settings.py"
 }
 }
 ]
 },
 5: {
 "test": {
 "id": 5,
 "test_name": "SQL Database Test",
 "skill": "SQL",
 "description": "Test your SQL database query knowledge",
 "instructions": "Answer questions about SQL queries and database operations.",
 "time_limit": 25,
 "total_score": 100,
 "question_count": 2
 },
 "questions": [
 {
 "id": 10,
 "order": 1,
 "question_text": "Which SQL command is used to retrieve data?",
 "options": {
 "A": "SELECT",
 "B": "GET",
 "C": "FETCH",
 "D": "RETRIEVE"
 }
 },
 {
 "id": 11,
 "order": 2,
 "question_text": "What does WHERE clause do in SQL?",
 "options": {
 "A": "Filters records based on conditions",
 "B": "Groups records",
 "C": "Orders records",
 "D": "Joins tables"
 }
 }
 ]
 },
 6: {
 "test": {
 "id": 6,
 "test_name": "Git Version Control Test",
 "skill": "Git",
 "description": "Test your Git version control knowledge",
 "instructions": "Answer questions about Git commands and workflows.",
 "time_limit": 20,
 "total_score": 100,
 "question_count": 2
 },
 "questions": [
 {
 "id": 12,
 "order": 1,
 "question_text": "Which command is used to stage files in Git?",
 "options": {
 "A": "git add",
 "B": "git stage",
 "C": "git commit",
 "D": "git push"
 }
 },
 {
 "id": 13,
 "order": 2,
 "question_text": "What does git commit do?",
 "options": {
 "A": "Saves changes to the local repository",
 "B": "Pushes changes to remote repository",
 "C": "Pulls changes from remote repository",
 "D": "Creates a new branch"
 }
 }
 ]
 }
};

export const mockTestResults = {
 "results": [],
 "total_tests": 0,
 "average_score": 0
};

