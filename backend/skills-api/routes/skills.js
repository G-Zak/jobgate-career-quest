const express = require('express');
const router = express.Router();
const dbConnection = require('../database/connection');

const db = dbConnection.getDatabase();

// Get all available skills
router.get('/available', (req, res) => {
    const query = `
        SELECT id, name, category, description 
        FROM skills 
        ORDER BY category, name
    `;
    
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error fetching available skills:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ skills: rows });
    });
});

// Get skills grouped by category
router.get('/categories', (req, res) => {
    const query = `
        SELECT category, COUNT(*) as skill_count
        FROM skills 
        GROUP BY category
        ORDER BY category
    `;
    
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error fetching skill categories:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ categories: rows });
    });
});

// Get user's skills
router.get('/user/:userId', (req, res) => {
    const { userId } = req.params;
    
    const query = `
        SELECT s.id, s.name, s.category, s.description, us.proficiency_level, us.created_at
        FROM skills s
        JOIN user_skills us ON s.id = us.skill_id
        WHERE us.user_id = ?
        ORDER BY s.category, s.name
    `;
    
    db.all(query, [userId], (err, rows) => {
        if (err) {
            console.error('Error fetching user skills:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ userSkills: rows });
    });
});

// Add skill to user
router.post('/user/:userId/add', (req, res) => {
    const { userId } = req.params;
    const { skillId, proficiencyLevel = 'beginner' } = req.body;
    
    if (!skillId) {
        return res.status(400).json({ error: 'Skill ID is required' });
    }

    const query = `
        INSERT OR REPLACE INTO user_skills (user_id, skill_id, proficiency_level)
        VALUES (?, ?, ?)
    `;
    
    db.run(query, [userId, skillId, proficiencyLevel], function(err) {
        if (err) {
            console.error('Error adding skill to user:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ 
            message: 'Skill added successfully',
            id: this.lastID 
        });
    });
});

// Update user skill proficiency
router.put('/user/:userId/skill/:skillId', (req, res) => {
    const { userId, skillId } = req.params;
    const { proficiencyLevel } = req.body;
    
    if (!proficiencyLevel) {
        return res.status(400).json({ error: 'Proficiency level is required' });
    }

    const query = `
        UPDATE user_skills 
        SET proficiency_level = ?
        WHERE user_id = ? AND skill_id = ?
    `;
    
    db.run(query, [proficiencyLevel, userId, skillId], function(err) {
        if (err) {
            console.error('Error updating skill proficiency:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ error: 'User skill not found' });
        }
        
        res.json({ message: 'Skill proficiency updated successfully' });
    });
});

// Remove skill from user
router.delete('/user/:userId/remove/:skillId', (req, res) => {
    const { userId, skillId } = req.params;
    
    const query = `DELETE FROM user_skills WHERE user_id = ? AND skill_id = ?`;
    
    db.run(query, [userId, skillId], function(err) {
        if (err) {
            console.error('Error removing skill from user:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ error: 'User skill not found' });
        }
        
        res.json({ message: 'Skill removed successfully' });
    });
});

// Get technical questions for user's skills
router.get('/technical-questions/:userId', (req, res) => {
    const { userId } = req.params;
    const { limit = 20, difficulty } = req.query;
    
    let query = `
        SELECT tq.*, s.name as skill_name, s.category
        FROM technical_questions tq
        JOIN skills s ON tq.skill_id = s.id
        JOIN user_skills us ON s.id = us.skill_id
        WHERE us.user_id = ?
    `;
    
    const params = [userId];
    
    if (difficulty) {
        query += ` AND tq.difficulty_level = ?`;
        params.push(difficulty);
    }
    
    query += ` ORDER BY s.category, s.name, tq.difficulty_level LIMIT ?`;
    params.push(parseInt(limit));
    
    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Error fetching technical questions:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ questions: rows });
    });
});

// Get technical questions for specific skill
router.get('/technical-questions/skill/:skillId', (req, res) => {
    const { skillId } = req.params;
    const { limit = 10, difficulty } = req.query;
    
    let query = `
        SELECT tq.*, s.name as skill_name, s.category
        FROM technical_questions tq
        JOIN skills s ON tq.skill_id = s.id
        WHERE tq.skill_id = ?
    `;
    
    const params = [skillId];
    
    if (difficulty) {
        query += ` AND tq.difficulty_level = ?`;
        params.push(difficulty);
    }
    
    query += ` ORDER BY tq.difficulty_level, tq.id LIMIT ?`;
    params.push(parseInt(limit));
    
    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Error fetching skill questions:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ questions: rows });
    });
});

// Add new technical question (admin functionality)
router.post('/technical-questions', (req, res) => {
    const {
        skillId,
        question,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer,
        difficultyLevel = 1,
        explanation
    } = req.body;
    
    if (!skillId || !question || !optionA || !optionB || !optionC || !optionD || !correctAnswer) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    const query = `
        INSERT INTO technical_questions 
        (skill_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty_level, explanation)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.run(query, [
        skillId, question, optionA, optionB, optionC, optionD, 
        correctAnswer, difficultyLevel, explanation
    ], function(err) {
        if (err) {
            console.error('Error adding technical question:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ 
            message: 'Technical question added successfully',
            id: this.lastID 
        });
    });
});

// Get user's skill statistics
router.get('/user/:userId/stats', (req, res) => {
    const { userId } = req.params;
    
    const query = `
        SELECT 
            s.category,
            COUNT(*) as skill_count,
            GROUP_CONCAT(s.name) as skills
        FROM skills s
        JOIN user_skills us ON s.id = us.skill_id
        WHERE us.user_id = ?
        GROUP BY s.category
        ORDER BY s.category
    `;
    
    db.all(query, [userId], (err, rows) => {
        if (err) {
            console.error('Error fetching user skill stats:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        
        // Also get total question count available for user
        const questionsQuery = `
            SELECT COUNT(*) as total_questions
            FROM technical_questions tq
            JOIN user_skills us ON tq.skill_id = us.skill_id
            WHERE us.user_id = ?
        `;
        
        db.get(questionsQuery, [userId], (err, questionRow) => {
            if (err) {
                console.error('Error fetching question count:', err);
                res.status(500).json({ error: err.message });
                return;
            }
            
            res.json({ 
                skillStats: rows,
                totalQuestions: questionRow ? questionRow.total_questions : 0
            });
        });
    });
});

// ========== ENDPOINTS POUR VOS TESTS PERSONNALISÉS ==========

// Récupérer tous les tests disponibles pour les compétences d'un utilisateur
router.get('/user/:userId/available-tests', (req, res) => {
    const { userId } = req.params;
    
    const query = `
        SELECT 
            ct.id as test_id,
            ct.test_name,
            ct.description,
            ct.total_score,
            ct.time_limit,
            ct.instructions,
            s.id as skill_id,
            s.name as skill_name,
            s.category,
            (SELECT COUNT(*) FROM test_questions WHERE test_id = ct.id) as question_count,
            (SELECT COUNT(*) FROM user_test_results WHERE user_id = ? AND test_id = ct.id) as times_taken
        FROM custom_tests ct
        JOIN skills s ON ct.skill_id = s.id
        JOIN user_skills us ON s.id = us.skill_id
        WHERE us.user_id = ?
        ORDER BY s.category, s.name
    `;
    
    db.all(query, [userId, userId], (err, rows) => {
        if (err) {
            console.error('Error fetching available tests:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ tests: rows });
    });
});

// Récupérer un test spécifique avec ses questions
router.get('/test/:testId', (req, res) => {
    const { testId } = req.params;
    
    // D'abord récupérer les infos du test
    const testQuery = `
        SELECT 
            ct.*,
            s.name as skill_name,
            s.category
        FROM custom_tests ct
        JOIN skills s ON ct.skill_id = s.id
        WHERE ct.id = ?
    `;
    
    db.get(testQuery, [testId], (err, testData) => {
        if (err) {
            console.error('Error fetching test data:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        
        if (!testData) {
            return res.status(404).json({ error: 'Test not found' });
        }
        
        // Ensuite récupérer les questions
        const questionsQuery = `
            SELECT * FROM test_questions 
            WHERE test_id = ? 
            ORDER BY question_order
        `;
        
        db.all(questionsQuery, [testId], (err, questions) => {
            if (err) {
                console.error('Error fetching test questions:', err);
                res.status(500).json({ error: err.message });
                return;
            }
            
            res.json({
                test: testData,
                questions: questions
            });
        });
    });
});

// Soumettre les résultats d'un test
router.post('/test/:testId/submit', (req, res) => {
    const { testId } = req.params;
    const { userId, answers, timeTaken } = req.body;
    
    if (!userId || !answers) {
        return res.status(400).json({ error: 'User ID and answers are required' });
    }
    
    // D'abord récupérer les bonnes réponses
    const questionsQuery = `
        SELECT id, correct_answer, points 
        FROM test_questions 
        WHERE test_id = ?
    `;
    
    db.all(questionsQuery, [testId], (err, questions) => {
        if (err) {
            console.error('Error fetching questions for scoring:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        
        // Calculer le score
        let totalScore = 0;
        let maxScore = 0;
        const detailedResults = [];
        
        questions.forEach(question => {
            maxScore += question.points;
            const userAnswer = answers[question.id];
            const isCorrect = userAnswer === question.correct_answer;
            
            if (isCorrect) {
                totalScore += question.points;
            }
            
            detailedResults.push({
                questionId: question.id,
                userAnswer: userAnswer,
                correctAnswer: question.correct_answer,
                isCorrect: isCorrect,
                points: isCorrect ? question.points : 0,
                maxPoints: question.points
            });
        });
        
        const percentage = (totalScore / maxScore) * 100;
        
        // Sauvegarder le résultat
        const insertQuery = `
            INSERT INTO user_test_results 
            (user_id, test_id, score, total_score, percentage, time_taken, answers_data)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        db.run(insertQuery, [
            userId, testId, totalScore, maxScore, percentage, 
            timeTaken, JSON.stringify(detailedResults)
        ], function(err) {
            if (err) {
                console.error('Error saving test results:', err);
                res.status(500).json({ error: err.message });
                return;
            }
            
            res.json({
                resultId: this.lastID,
                score: totalScore,
                maxScore: maxScore,
                percentage: percentage.toFixed(2),
                timeTaken: timeTaken,
                detailedResults: detailedResults
            });
        });
    });
});

// Récupérer l'historique des tests d'un utilisateur
router.get('/user/:userId/test-history', (req, res) => {
    const { userId } = req.params;
    
    const query = `
        SELECT 
            utr.*,
            ct.test_name,
            s.name as skill_name,
            s.category
        FROM user_test_results utr
        JOIN custom_tests ct ON utr.test_id = ct.id
        JOIN skills s ON ct.skill_id = s.id
        WHERE utr.user_id = ?
        ORDER BY utr.completed_at DESC
    `;
    
    db.all(query, [userId], (err, rows) => {
        if (err) {
            console.error('Error fetching test history:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ testHistory: rows });
    });
});

// ========== ENDPOINTS D'ADMINISTRATION ==========

// Récupérer tous les tests (pour l'admin)
router.get('/all-tests', (req, res) => {
    const query = `
        SELECT 
            ct.*,
            s.name as skill_name,
            s.category,
            (SELECT COUNT(*) FROM test_questions WHERE test_id = ct.id) as question_count
        FROM custom_tests ct
        JOIN skills s ON ct.skill_id = s.id
        ORDER BY s.category, s.name, ct.test_name
    `;
    
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error fetching all tests:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ tests: rows });
    });
});

// Récupérer tous les tests (pour l'admin)
router.get('/admin/all-tests', (req, res) => {
    const query = `
        SELECT 
            ct.*,
            s.name as skill_name,
            s.category,
            (SELECT COUNT(*) FROM test_questions WHERE test_id = ct.id) as question_count
        FROM custom_tests ct
        JOIN skills s ON ct.skill_id = s.id
        ORDER BY s.category, s.name, ct.test_name
    `;
    
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error fetching all tests:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ tests: rows });
    });
});

// Créer un nouveau test avec ses questions
router.post('/admin/test', (req, res) => {
    const {
        skillId,
        testName,
        description,
        totalScore,
        timeLimit,
        instructions,
        questions
    } = req.body;
    
    if (!skillId || !testName || !questions || questions.length === 0) {
        return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis' });
    }
    
    // Insérer le test
    const testQuery = `
        INSERT INTO custom_tests (skill_id, test_name, description, total_score, time_limit, instructions)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    db.run(testQuery, [
        skillId, testName, description, totalScore, timeLimit, instructions
    ], function(err) {
        if (err) {
            console.error('Error creating test:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        
        const testId = this.lastID;
        
        // Insérer les questions
        const questionQuery = `
            INSERT INTO test_questions 
            (test_id, question_text, option_a, option_b, option_c, option_d, correct_answer, points, explanation, question_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        let insertedQuestions = 0;
        questions.forEach((question, index) => {
            db.run(questionQuery, [
                testId,
                question.questionText,
                question.optionA,
                question.optionB,
                question.optionC,
                question.optionD,
                question.correctAnswer,
                question.points,
                question.explanation,
                index + 1
            ], (err) => {
                if (err) {
                    console.error('Error inserting question:', err);
                    return;
                }
                
                insertedQuestions++;
                if (insertedQuestions === questions.length) {
                    res.json({
                        message: 'Test créé avec succès',
                        test: {
                            id: testId,
                            skill_id: skillId,
                            test_name: testName,
                            description,
                            total_score: totalScore,
                            time_limit: timeLimit,
                            instructions,
                            question_count: questions.length
                        }
                    });
                }
            });
        });
    });
});

// Modifier un test existant
router.put('/admin/test/:testId', (req, res) => {
    const { testId } = req.params;
    const {
        skillId,
        testName,
        description,
        totalScore,
        timeLimit,
        instructions,
        questions
    } = req.body;
    
    // Mettre à jour le test
    const updateTestQuery = `
        UPDATE custom_tests 
        SET skill_id = ?, test_name = ?, description = ?, total_score = ?, time_limit = ?, instructions = ?
        WHERE id = ?
    `;
    
    db.run(updateTestQuery, [
        skillId, testName, description, totalScore, timeLimit, instructions, testId
    ], function(err) {
        if (err) {
            console.error('Error updating test:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        
        // Supprimer les anciennes questions
        db.run('DELETE FROM test_questions WHERE test_id = ?', [testId], (err) => {
            if (err) {
                console.error('Error deleting old questions:', err);
                res.status(500).json({ error: err.message });
                return;
            }
            
            // Insérer les nouvelles questions
            const questionQuery = `
                INSERT INTO test_questions 
                (test_id, question_text, option_a, option_b, option_c, option_d, correct_answer, points, explanation, question_order)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            let insertedQuestions = 0;
            if (questions && questions.length > 0) {
                questions.forEach((question, index) => {
                    db.run(questionQuery, [
                        testId,
                        question.questionText,
                        question.optionA,
                        question.optionB,
                        question.optionC,
                        question.optionD,
                        question.correctAnswer,
                        question.points,
                        question.explanation,
                        index + 1
                    ], (err) => {
                        if (err) {
                            console.error('Error inserting question:', err);
                            return;
                        }
                        
                        insertedQuestions++;
                        if (insertedQuestions === questions.length) {
                            res.json({
                                message: 'Test modifié avec succès',
                                test: {
                                    id: testId,
                                    skill_id: skillId,
                                    test_name: testName,
                                    description,
                                    total_score: totalScore,
                                    time_limit: timeLimit,
                                    instructions,
                                    question_count: questions.length
                                }
                            });
                        }
                    });
                });
            } else {
                res.json({
                    message: 'Test modifié avec succès',
                    test: {
                        id: testId,
                        skill_id: skillId,
                        test_name: testName,
                        description,
                        total_score: totalScore,
                        time_limit: timeLimit,
                        instructions,
                        question_count: 0
                    }
                });
            }
        });
    });
});

// Supprimer un test
router.delete('/admin/test/:testId', (req, res) => {
    const { testId } = req.params;
    
    // Supprimer d'abord les questions
    db.run('DELETE FROM test_questions WHERE test_id = ?', [testId], (err) => {
        if (err) {
            console.error('Error deleting test questions:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        
        // Ensuite supprimer le test
        db.run('DELETE FROM custom_tests WHERE id = ?', [testId], function(err) {
            if (err) {
                console.error('Error deleting test:', err);
                res.status(500).json({ error: err.message });
                return;
            }
            
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Test not found' });
            }
            
            res.json({ message: 'Test supprimé avec succès' });
        });
    });
});

// Récupérer tous les résultats (pour l'admin)
router.get('/admin/all-results', (req, res) => {
    const query = `
        SELECT 
            utr.*,
            ct.test_name,
            s.name as skill_name,
            s.category
        FROM user_test_results utr
        JOIN custom_tests ct ON utr.test_id = ct.id
        JOIN skills s ON ct.skill_id = s.id
        ORDER BY utr.completed_at DESC
        LIMIT 100
    `;
    
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error fetching all results:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ results: rows });
    });
});

module.exports = router;
