// Script pour initialiser la base de données
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'skills.db');
console.log('📁 Chemin de la base de données:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Erreur ouverture BDD:', err.message);
        process.exit(1);
    } else {
        console.log('✅ Connexion à SQLite réussie');
        initializeTables();
    }
});

function initializeTables() {
    console.log('🔧 Création des tables...');

    // 1. Table skills (compétences)
    db.run(`
        CREATE TABLE IF NOT EXISTS skills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(100) NOT NULL UNIQUE,
            category VARCHAR(50) NOT NULL,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error('❌ Erreur table skills:', err);
        else console.log('✅ Table skills créée');
    });

    // 2. Table candidats (users)
    db.run(`
        CREATE TABLE IF NOT EXISTS candidats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nom VARCHAR(100) NOT NULL,
            prenom VARCHAR(100) NOT NULL,
            email VARCHAR(200) UNIQUE NOT NULL,
            telephone VARCHAR(20),
            cv_path TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error('❌ Erreur table candidats:', err);
        else console.log('✅ Table candidats créée');
    });

    // 3. Table user_skills (compétences des utilisateurs)
    db.run(`
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
        if (err) console.error('❌ Erreur table user_skills:', err);
        else console.log('✅ Table user_skills créée');
    });

    // 4. Table custom_tests (vos tests personnalisés)
    db.run(`
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
        if (err) console.error('❌ Erreur table custom_tests:', err);
        else console.log('✅ Table custom_tests créée');
    });

    // 5. Table test_questions (questions de vos tests)
    db.run(`
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
        if (err) console.error('❌ Erreur table test_questions:', err);
        else console.log('✅ Table test_questions créée');
    });

    // 6. Table user_test_results (résultats des tests)
    db.run(`
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
        if (err) console.error('❌ Erreur table user_test_results:', err);
        else console.log('✅ Table user_test_results créée');
        
        // Après création de toutes les tables, insérer les données de base
        seedInitialData();
    });
}

function seedInitialData() {
    console.log('🌱 Insertion des données de base...');
    
    // Vérifier si des compétences existent déjà
    db.get("SELECT COUNT(*) as count FROM skills", (err, row) => {
        if (err) {
            console.error('❌ Erreur vérification skills:', err);
            return;
        }

        if (row.count === 0) {
            console.log('📝 Insertion des compétences de base...');
            
            const skills = [
                ['Python', 'Programming Language', 'Langage de programmation de haut niveau'],
                ['Java', 'Programming Language', 'Langage de programmation orienté objet'],
                ['JavaScript', 'Programming Language', 'Langage de script pour le développement web'],
                ['React', 'Frontend Framework', 'Bibliothèque JavaScript pour interfaces utilisateur'],
                ['Node.js', 'Backend Technology', 'Runtime JavaScript côté serveur'],
                ['SQL', 'Database', 'Langage de requête pour bases de données'],
                ['HTML', 'Web Technology', 'Langage de balisage pour pages web'],
                ['CSS', 'Web Technology', 'Langage de style pour le web'],
                ['Git', 'Version Control', 'Système de contrôle de version distribué'],
                ['Docker', 'DevOps', 'Plateforme de conteneurisation'],
                ['Spring Boot', 'Backend Framework', 'Framework Java pour applications'],
                ['Angular', 'Frontend Framework', 'Framework TypeScript pour applications web'],
                ['Vue.js', 'Frontend Framework', 'Framework JavaScript progressif'],
                ['MongoDB', 'Database', 'Base de données NoSQL orientée documents'],
                ['PostgreSQL', 'Database', 'Système de gestion de base de données relationnelle'],
                ['AWS', 'Cloud', 'Services cloud Amazon'],
                ['Linux', 'Operating System', 'Système d\'exploitation open source'],
                ['Kubernetes', 'DevOps', 'Orchestration de conteneurs'],
                ['TypeScript', 'Programming Language', 'Superset typé de JavaScript'],
                ['PHP', 'Programming Language', 'Langage de script côté serveur']
            ];

            const stmt = db.prepare("INSERT INTO skills (name, category, description) VALUES (?, ?, ?)");
            
            skills.forEach((skill, index) => {
                stmt.run(skill, (err) => {
                    if (err) {
                        console.error(`❌ Erreur insertion skill ${skill[0]}:`, err);
                    } else {
                        console.log(`✅ Compétence ajoutée: ${skill[0]}`);
                    }
                    
                    // Quand toutes les compétences sont insérées
                    if (index === skills.length - 1) {
                        stmt.finalize();
                        console.log('🎉 Base de données initialisée avec succès !');
                        console.log('\n📊 Résumé:');
                        console.log(`   - ${skills.length} compétences ajoutées`);
                        console.log('   - 6 tables créées');
                        console.log('\n💡 Vous pouvez maintenant:');
                        console.log('   1. Importer vos tests JSON');
                        console.log('   2. Démarrer le serveur backend');
                        console.log('   3. Utiliser l\'interface d\'administration');
                        
                        db.close((err) => {
                            if (err) {
                                console.error('❌ Erreur fermeture BDD:', err);
                            } else {
                                console.log('✅ Connexion fermée');
                            }
                        });
                    }
                });
            });
        } else {
            console.log('ℹ️ Compétences déjà présentes dans la base');
            db.close();
        }
    });
}

// Fonction pour afficher le contenu de la base
function showTables() {
    console.log('\n📋 TABLES CRÉÉES:');
    
    const tables = ['skills', 'candidats', 'user_skills', 'custom_tests', 'test_questions', 'user_test_results'];
    
    tables.forEach(tableName => {
        db.get(`SELECT COUNT(*) as count FROM ${tableName}`, (err, row) => {
            if (err) {
                console.log(`   ❌ ${tableName}: Erreur`);
            } else {
                console.log(`   ✅ ${tableName}: ${row.count} enregistrements`);
            }
        });
    });
}
