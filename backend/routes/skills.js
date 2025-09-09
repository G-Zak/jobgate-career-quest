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

module.exports = router;
