# Guide de Démarrage - Système de Tests Techniques

## Aperçu du Système

Ce système permet de créer des tests techniques adaptatifs basés sur les compétences du candidat. Il comprend :

1. **Base de données SQLite** pour stocker les compétences et questions techniques
2. **API REST** pour la gestion des compétences (Node.js/Express)
3. **Interface utilisateur** pour la sélection des compétences et les tests (React)

## Architecture

```
backend/
├── skills-api/          # Serveur API des compétences
│   ├── server.js        # Serveur principal
│   ├── database/        # Base de données SQLite
│   └── routes/          # Routes API
│
frontend/
├── src/features/skills-assessment/
│   ├── components/
│   │   ├── SkillsSelector.jsx      # Gestion des compétences
│   │   ├── TechnicalTest.jsx       # Test technique adaptatif
│   │   └── ...
│   └── data/
│       └── technicalTestSections.js # Logique des tests
```

## Démarrage Rapide

### Option 1 : Script Automatique (Windows)
```bash
# Double-cliquer sur le fichier :
start-dev.bat
```

### Option 2 : Démarrage Manuel

1. **Démarrer l'API des compétences :**
```bash
cd backend/skills-api
npm install
npm start
```

2. **Démarrer le frontend :**
```bash
cd frontend
npm install
npm run dev
```

## URLs d'Accès

- **Frontend** : http://localhost:5173
- **API Skills** : http://localhost:3001
- **Health Check** : http://localhost:3001/api/health

## Fonctionnalités

### 1. Gestion des Compétences
- Ajouter/supprimer des compétences techniques
- Définir le niveau de maîtrise (débutant → expert)
- Catégorisation des compétences

### 2. Tests Techniques Adaptatifs
- Questions basées sur les compétences sélectionnées
- Durée adaptative selon le nombre de compétences
- Résultats détaillés par compétence

### 3. Base de Données
- **Table `skills`** : Liste des compétences disponibles
- **Table `technical_questions`** : Questions par compétence
- **Table `user_skills`** : Compétences des utilisateurs

## API Endpoints

### Compétences
- `GET /api/skills/available` - Liste toutes les compétences
- `GET /api/skills/user/:userId` - Compétences de l'utilisateur
- `POST /api/skills/user/:userId/add` - Ajouter une compétence
- `DELETE /api/skills/user/:userId/remove/:skillId` - Supprimer une compétence

### Questions Techniques
- `GET /api/skills/technical-questions/:userId` - Questions pour l'utilisateur
- `GET /api/skills/technical-questions/skill/:skillId` - Questions par compétence
- `POST /api/skills/technical-questions` - Ajouter une question

### Statistiques
- `GET /api/skills/user/:userId/stats` - Statistiques des compétences

## Navigation dans l'Interface

1. **Gestion des compétences** : `Gestion des compétences` dans la sidebar
2. **Test technique** : `Test technique` dans la sidebar

## Données Pré-chargées

Le système inclut :
- **20 compétences** dans 6 catégories
- **15+ questions techniques** de base
- Support pour Python, JavaScript, Java, React, SQL, HTML, CSS

## Ajout de Nouvelles Questions

```javascript
// Exemple d'ajout via API
POST /api/skills/technical-questions
{
  "skillId": 1,
  "question": "Votre question ici ?",
  "optionA": "Option A",
  "optionB": "Option B", 
  "optionC": "Option C",
  "optionD": "Option D",
  "correctAnswer": "a",
  "difficultyLevel": 2,
  "explanation": "Explication de la réponse"
}
```

## Développement

### Structure des Composants

- **SkillsSelector** : Interface de gestion des compétences
- **TechnicalTest** : Composant de test adaptatif
- **technicalTestSections.js** : Logique de génération des tests

### État de l'Application

L'ID utilisateur par défaut est `"user123"`. Pour un système réel, intégrez l'authentification.

## Troubleshooting

### Port 3001 déjà utilisé
```bash
# Changer le port dans backend/skills-api/server.js
const PORT = process.env.PORT || 3002;
```

### Base de données corrompue
```bash
# Supprimer et recréer
rm backend/skills-api/database/skills.db
# Redémarrer le serveur
```

### Erreurs CORS
Le serveur API est configuré pour accepter les requêtes depuis localhost:5173

## Prochaines Étapes

1. **Authentification** : Intégrer un système d'auth réel
2. **Plus de questions** : Ajouter plus de questions par compétence
3. **Analytics** : Tracking des performances
4. **Export** : Export des résultats en PDF
5. **Admin Panel** : Interface d'administration des questions

## Support

Pour des questions ou des problèmes :
1. Vérifiez que les deux serveurs sont démarrés
2. Consultez les logs dans les terminaux
3. Testez l'API avec : http://localhost:3001/api/health
