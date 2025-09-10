// Utilitaire simple pour importer les tests JSON
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'skills.db');

function importJSON() {
    console.log('🔗 Connexion à la base de données...');
    
    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('❌ Erreur connexion BDD:', err.message);
            return;
        }
        
        console.log('✅ Connexion réussie');
        
        // Lire le fichier JSON
        const jsonPath = path.join(__dirname, 'exemple_tests.json');
        
        if (!fs.existsSync(jsonPath)) {
            console.error('❌ Fichier exemple_tests.json non trouvé');
            db.close();
            return;
        }
        
        try {
            const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
            console.log(`📥 Import de ${jsonData.tests.length} tests`);
            
            let testsCompleted = 0;
            
            jsonData.tests.forEach((testData, testIndex) => {
                console.log(`\n🔄 Import du test: ${testData.test_name} (${testData.skill_name})`);
                
                // 1. Chercher la compétence
                db.get("SELECT id FROM skills WHERE name = ?", [testData.skill_name], (err, skill) => {
                    if (err) {
                        console.error(`❌ Erreur recherche skill:`, err.message);
                        return;
                    }
                    
                    if (!skill) {
                        console.error(`❌ Compétence '${testData.skill_name}' non trouvée`);
                        // Afficher les compétences disponibles
                        db.all("SELECT name FROM skills ORDER BY name", (err, skills) => {
                            if (!err && skills.length > 0) {
                                console.log('💡 Compétences disponibles:');
                                skills.forEach(s => console.log(`   - ${s.name}`));
                            }
                        });
                        testsCompleted++;
                        checkIfDone();
                        return;
                    }
                    
                    console.log(`✅ Compétence trouvée: ${testData.skill_name} (ID: ${skill.id})`);
                    
                    // 2. Créer le test
                    const testQuery = `
                        INSERT INTO custom_tests 
                        (skill_id, test_name, description, total_score, time_limit, instructions)
                        VALUES (?, ?, ?, ?, ?, ?)
                    `;
                    
                    db.run(testQuery, [
                        skill.id,
                        testData.test_name,
                        testData.description || '',
                        testData.total_score || 10,
                        testData.time_limit || 30,
                        testData.instructions || ''
                    ], function(err) {
                        if (err) {
                            console.error(`❌ Erreur création test:`, err.message);
                            testsCompleted++;
                            checkIfDone();
                            return;
                        }
                        
                        const testId = this.lastID;
                        console.log(`✅ Test créé avec ID: ${testId}`);
                        
                        // 3. Ajouter les questions
                        const questions = testData.questions || [];
                        
                        if (questions.length === 0) {
                            console.log(`⚠️ Aucune question pour ce test`);
                            testsCompleted++;
                            checkIfDone();
                            return;
                        }
                        
                        console.log(`📝 Ajout de ${questions.length} questions...`);
                        
                        let questionsCompleted = 0;
                        
                        questions.forEach((question, qIndex) => {
                            const questionQuery = `
                                INSERT INTO test_questions 
                                (test_id, question_text, option_a, option_b, option_c, option_d, correct_answer, points, explanation, question_order)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                            `;
                            
                            db.run(questionQuery, [
                                testId,
                                question.question_text,
                                question.option_a || null,
                                question.option_b || null,
                                question.option_c || null,
                                question.option_d || null,
                                question.correct_answer,
                                question.points || 1,
                                question.explanation || '',
                                qIndex + 1
                            ], (err) => {
                                if (err) {
                                    console.error(`❌ Erreur question ${qIndex + 1}:`, err.message);
                                } else {
                                    console.log(`✅ Question ${qIndex + 1} ajoutée`);
                                }
                                
                                questionsCompleted++;
                                
                                // Si toutes les questions de ce test sont traitées
                                if (questionsCompleted === questions.length) {
                                    testsCompleted++;
                                    checkIfDone();
                                }
                            });
                        });
                    });
                });
            });
            
            function checkIfDone() {
                if (testsCompleted === jsonData.tests.length) {
                    console.log('\n🎉 Import terminé avec succès !');
                    
                    // Afficher un résumé
                    db.get("SELECT COUNT(*) as count FROM custom_tests", (err, result) => {
                        if (!err) {
                            console.log(`📊 Total des tests: ${result.count}`);
                        }
                    });
                    
                    db.get("SELECT COUNT(*) as count FROM test_questions", (err, result) => {
                        if (!err) {
                            console.log(`📊 Total des questions: ${result.count}`);
                        }
                        
                        db.close((err) => {
                            if (!err) {
                                console.log('✅ Base de données fermée');
                            }
                        });
                    });
                }
            }
            
        } catch (error) {
            console.error('❌ Erreur lecture JSON:', error.message);
            db.close();
        }
    });
}

// Fonction pour afficher le contenu
function showDatabase() {
    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('❌ Erreur connexion:', err.message);
            return;
        }
        
        console.log('\n=== CONTENU DE LA BASE ===\n');
        
        // Tests
        db.all(`
            SELECT ct.id, ct.test_name, s.name as skill_name, ct.total_score, ct.time_limit
            FROM custom_tests ct
            JOIN skills s ON ct.skill_id = s.id
            ORDER BY s.name, ct.test_name
        `, (err, tests) => {
            if (err) {
                console.error('❌ Erreur tests:', err.message);
            } else {
                console.log(`🧪 TESTS (${tests.length}):`);
                tests.forEach(test => {
                    console.log(`   ${test.skill_name}: ${test.test_name} (${test.total_score}pts, ${test.time_limit}min)`);
                });
            }
            
            // Questions
            db.get("SELECT COUNT(*) as count FROM test_questions", (err, result) => {
                if (!err) {
                    console.log(`\n❓ QUESTIONS: ${result.count} au total`);
                }
                
                db.close();
            });
        });
    });
}

// Exécution selon l'argument
const action = process.argv[2];

if (action === 'import') {
    importJSON();
} else if (action === 'show') {
    showDatabase();
} else {
    console.log('Usage:');
    console.log('  node simple_import.js import  - Importer les tests JSON');
    console.log('  node simple_import.js show    - Afficher le contenu de la base');
}
