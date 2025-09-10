// ========== UTILITAIRES POUR GÉRER LA BASE DE DONNÉES ==========

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'skills.db');

class DatabaseManager {
    constructor() {
        this.db = new sqlite3.Database(dbPath);
    }

    // Exporter toutes les données vers JSON
    async exportToJSON(filename = 'backup.json') {
        return new Promise((resolve, reject) => {
            const data = {};
            
            // Exporter les compétences
            this.db.all("SELECT * FROM skills", (err, skills) => {
                if (err) {
                    reject(err);
                    return;
                }
                data.skills = skills;
                
                // Exporter les tests personnalisés
                this.db.all("SELECT * FROM custom_tests", (err, tests) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    data.custom_tests = tests;
                    
                    // Exporter les questions des tests
                    this.db.all("SELECT * FROM test_questions", (err, questions) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        data.test_questions = questions;
                        
                        // Exporter les résultats des utilisateurs
                        this.db.all("SELECT * FROM user_test_results", (err, results) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            data.user_test_results = results;
                            
                            // Sauvegarder le fichier JSON
                            const jsonData = JSON.stringify(data, null, 2);
                            fs.writeFileSync(filename, jsonData);
                            
                            console.log(`✅ Données exportées vers ${filename}`);
                            resolve(data);
                        });
                    });
                });
            });
        });
    }

    // Importer des tests depuis un fichier JSON
    async importTestsFromJSON(filename) {
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(filename)) {
                reject(new Error(`Fichier ${filename} introuvable`));
                return;
            }

            try {
                const jsonData = fs.readFileSync(filename, 'utf8');
                const data = JSON.parse(jsonData);
                
                if (data.tests && Array.isArray(data.tests)) {
                    this.importTests(data.tests)
                        .then(resolve)
                        .catch(reject);
                } else {
                    reject(new Error('Format JSON invalide. Attendu: { "tests": [...] }'));
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    // Importer une liste de tests
    async importTests(tests) {
        return new Promise((resolve, reject) => {
            let imported = 0;
            let errors = [];

            tests.forEach((testData, index) => {
                this.importSingleTest(testData)
                    .then(() => {
                        imported++;
                        if (imported + errors.length === tests.length) {
                            resolve({
                                imported: imported,
                                errors: errors.length,
                                errorDetails: errors
                            });
                        }
                    })
                    .catch((error) => {
                        errors.push({ index, error: error.message, testData });
                        if (imported + errors.length === tests.length) {
                            resolve({
                                imported: imported,
                                errors: errors.length,
                                errorDetails: errors
                            });
                        }
                    });
            });
        });
    }

    // Importer un seul test
    async importSingleTest(testData) {
        return new Promise((resolve, reject) => {
            const {
                skill_name,
                test_name,
                description,
                total_score,
                time_limit,
                instructions,
                questions
            } = testData;

            // D'abord trouver l'ID de la compétence
            this.db.get("SELECT id FROM skills WHERE name = ?", [skill_name], (err, skill) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (!skill) {
                    reject(new Error(`Compétence '${skill_name}' introuvable`));
                    return;
                }

                // Insérer le test
                const testQuery = `
                    INSERT INTO custom_tests (skill_id, test_name, description, total_score, time_limit, instructions)
                    VALUES (?, ?, ?, ?, ?, ?)
                `;

                this.db.run(testQuery, [
                    skill.id, test_name, description, total_score, time_limit, instructions
                ], function(err) {
                    if (err) {
                        reject(err);
                        return;
                    }

                    const testId = this.lastID;

                    // Insérer les questions
                    if (questions && questions.length > 0) {
                        let insertedQuestions = 0;
                        questions.forEach((question, qIndex) => {
                            const questionQuery = `
                                INSERT INTO test_questions 
                                (test_id, question_text, option_a, option_b, option_c, option_d, correct_answer, points, explanation, question_order)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                            `;

                            db.run(questionQuery, [
                                testId,
                                question.question_text,
                                question.option_a,
                                question.option_b,
                                question.option_c,
                                question.option_d,
                                question.correct_answer,
                                question.points || 1,
                                question.explanation || '',
                                qIndex + 1
                            ], (err) => {
                                if (err) {
                                    console.error('Erreur question:', err);
                                }
                                insertedQuestions++;
                                if (insertedQuestions === questions.length) {
                                    resolve({
                                        testId: testId,
                                        questionsCount: insertedQuestions
                                    });
                                }
                            });
                        });
                    } else {
                        resolve({
                            testId: testId,
                            questionsCount: 0
                        });
                    }
                });
            });
        });
    }

    // Vider toutes les données (ATTENTION !)
    async clearAllData() {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run("DELETE FROM user_test_results");
                this.db.run("DELETE FROM test_questions");
                this.db.run("DELETE FROM custom_tests");
                this.db.run("DELETE FROM user_skills");
                this.db.run("DELETE FROM technical_questions");
                this.db.run("DELETE FROM skills", (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log("✅ Toutes les données supprimées");
                        resolve();
                    }
                });
            });
        });
    }

    // Afficher le contenu de la base
    async showDatabaseContent() {
        console.log('\n=== CONTENU DE LA BASE DE DONNÉES ===\n');
        
        return new Promise((resolve) => {
            // Compétences
            this.db.all("SELECT * FROM skills ORDER BY category, name", (err, skills) => {
                console.log('📚 COMPÉTENCES:');
                skills?.forEach(skill => {
                    console.log(`  - ${skill.name} (${skill.category})`);
                });

                // Tests personnalisés
                this.db.all(`
                    SELECT ct.*, s.name as skill_name 
                    FROM custom_tests ct 
                    JOIN skills s ON ct.skill_id = s.id 
                    ORDER BY s.name
                `, (err, tests) => {
                    console.log('\n🧪 TESTS PERSONNALISÉS:');
                    tests?.forEach(test => {
                        console.log(`  - ${test.test_name} (${test.skill_name}) - ${test.total_score} pts`);
                    });

                    // Questions
                    this.db.get("SELECT COUNT(*) as count FROM test_questions", (err, questionCount) => {
                        console.log(`\n❓ QUESTIONS: ${questionCount?.count || 0} questions au total`);

                        // Résultats
                        this.db.get("SELECT COUNT(*) as count FROM user_test_results", (err, resultCount) => {
                            console.log(`\n📊 RÉSULTATS: ${resultCount?.count || 0} tentatives de test`);
                            console.log('\n=====================================\n');
                            resolve();
                        });
                    });
                });
            });
        });
    }

    close() {
        this.db.close();
    }
}

// Script d'utilisation
async function main() {
    const dbManager = new DatabaseManager();
    
    try {
        // Afficher le contenu actuel
        await dbManager.showDatabaseContent();
        
        // Exporter les données actuelles
        await dbManager.exportToJSON('backup_current.json');
        
        console.log('\n✅ Backup terminé !');
        console.log('📁 Fichier: backup_current.json');
        console.log('\n💡 Pour importer un test depuis JSON, utilisez:');
        console.log('   node database_manager.js import tests.json');
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    } finally {
        dbManager.close();
    }
}

// Gestion des arguments de ligne de commande
if (process.argv.length > 2) {
    const command = process.argv[2];
    const filename = process.argv[3];
    
    const dbManager = new DatabaseManager();
    
    if (command === 'import' && filename) {
        dbManager.importTestsFromJSON(filename)
            .then((result) => {
                console.log(`✅ Import terminé: ${result.imported} tests importés, ${result.errors} erreurs`);
                if (result.errors > 0) {
                    console.log('❌ Erreurs:', result.errorDetails);
                }
                dbManager.close();
            })
            .catch((error) => {
                console.error('❌ Erreur d\'import:', error.message);
                dbManager.close();
            });
    } else if (command === 'show') {
        dbManager.showDatabaseContent().then(() => dbManager.close());
    } else if (command === 'export') {
        const exportFile = filename || 'export.json';
        dbManager.exportToJSON(exportFile).then(() => dbManager.close());
    } else {
        console.log('Usage:');
        console.log('  node database_manager.js show                 - Afficher le contenu');
        console.log('  node database_manager.js export [fichier]     - Exporter vers JSON');
        console.log('  node database_manager.js import fichier.json  - Importer depuis JSON');
        dbManager.close();
    }
} else {
    main();
}

module.exports = DatabaseManager;
