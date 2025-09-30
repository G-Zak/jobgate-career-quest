# Guide du Système de Notation JobGate

## Table des Matières
1. [Score d'Employabilité](#score-demployabilité)
2. [Système de Recommandation](#système-de-recommandation)
3. [Expérience et Niveaux (XP)](#expérience-et-niveaux-xp)

---

## Score d'Employabilité

### Qu'est-ce que le Score d'Employabilité ?
Le Score d'Employabilité est une métrique complète (0-100) qui mesure votre préparation à l'emploi à travers plusieurs catégories de compétences. Il s'adapte en fonction de votre profil de carrière choisi pour vous donner l'évaluation la plus pertinente.

### Comment il est Calculé

#### 1. **Catégories de Tests**
Vos résultats de tests sont regroupés dans ces catégories :
- **Cognitif** : Raisonnement Verbal, Numérique, Logique, Abstrait, Spatial, Diagrammatique
- **Situationnel** : Tests de Jugement Situationnel (scénarios de travail)
- **Technique** : Évaluations de programmation et compétences techniques
- **Analytique** : Tests d'analyse de données et résolution de problèmes
- **Communication** : Compétences linguistiques et de présentation

#### 2. **Pondération Basée sur le Profil**
Différents profils de carrière mettent l'accent sur différentes compétences :

**Profil Ingénieur Logiciel :**
- Technique : 35%
- Cognitif : 25%
- Analytique : 20%
- Situationnel : 15%
- Communication : 5%

**Profil Data Scientist :**
- Analytique : 40%
- Technique : 25%
- Cognitif : 20%
- Communication : 10%
- Situationnel : 5%

**Profil Chef de Produit :**
- Situationnel : 30%
- Communication : 25%
- Analytique : 20%
- Cognitif : 15%
- Technique : 10%

#### 3. **Processus de Calcul du Score**
1. **Scores de Tests Individuels** : Moyenne de toutes les tentatives par type de test
2. **Agrégation par Catégorie** : Regroupement des tests individuels en catégories de haut niveau
3. **Pondération de Profil** : Application des poids spécifiques à la carrière aux catégories
4. **Score Final** : Moyenne pondérée normalisée sur une échelle de 0-100

### Interprétation du Score
- **90-100** : Exceptionnel - Prêt pour des postes seniors
- **80-89** : Excellent - Candidat solide pour la plupart des postes
- **70-79** : Bon - Base solide avec place pour l'amélioration
- **60-69** : Correct - Quelques lacunes de compétences à combler
- **Moins de 60** : Nécessite Amélioration - Se concentrer sur les compétences fondamentales

---

## Système de Recommandation

### Comment Fonctionnent les Recommandations d'Emploi

Le système de recommandation utilise plusieurs algorithmes pour vous faire correspondre aux meilleures opportunités d'emploi :

#### 1. **Correspondance de Compétences (40% de poids)**
- **Compétences Requises** : Compétences indispensables pour l'emploi (poids plus élevé)
- **Compétences Préférées** : Compétences souhaitables (poids plus faible)
- **Catégories de Compétences** : Programmation, frontend, backend, base de données, etc.
- **Score de Correspondance** : Pourcentage des compétences d'emploi que vous possédez

#### 2. **Correspondance d'Expérience (20% de poids)**
Années d'expérience vs. exigences de séniorité du poste :
- **Junior** : 0-2 ans
- **Intermédiaire** : 2-5 ans
- **Senior** : 5-10 ans
- **Expert** : 8-15 ans
- **Lead** : 6-12 ans

#### 3. **Performance aux Tests Techniques (15% de poids)**
- Scores récents de tests dans les domaines techniques pertinents
- Tendances de performance et cohérence
- Évaluations spécifiques aux compétences

#### 4. **Localisation et Préférences (15% de poids)**
- Correspondance de localisation géographique
- Préférences de travail à distance
- Attentes salariales vs. offre d'emploi

#### 5. **Compétences Cognitives (35% de poids)**
- Performance aux tests de raisonnement (verbal, numérique, logique, abstrait, spatial)
- Évaluation des capacités de résolution de problèmes
- Analyse des tendances d'amélioration cognitive
- Cohérence des performances à travers différents types de tests cognitifs

#### 6. **Score d'Employabilité (10% de poids)**
- Votre score d'employabilité global
- Pondération spécifique au profil appliquée
- Tendances de performance récentes

### Calcul Détaillé des Compétences Cognitives

Les compétences cognitives représentent 35% du score de recommandation et sont calculées comme suit :

#### **Composants des Compétences Cognitives :**

**1. Tests de Raisonnement Verbal (20% du score cognitif)**
- Compréhension de lecture et analyse de texte
- Analogies et relations logiques entre mots
- Classification et catégorisation conceptuelle

**2. Tests de Raisonnement Numérique (25% du score cognitif)**
- Calculs mathématiques et interprétation de données
- Résolution de problèmes quantitatifs
- Analyse de graphiques et tableaux

**3. Tests de Raisonnement Logique (20% du score cognitif)**
- Déduction et induction logique
- Pensée critique et analyse d'arguments
- Résolution de problèmes séquentiels

**4. Tests de Raisonnement Abstrait (15% du score cognitif)**
- Reconnaissance de motifs et séquences
- Pensée conceptuelle et spatiale
- Résolution de problèmes non-verbaux

**5. Tests Spatiaux et Diagrammatiques (20% du score cognitif)**
- Rotation mentale et visualisation spatiale
- Interprétation de diagrammes et schémas
- Raisonnement géométrique

#### **Formule de Calcul Cognitif :**
```
Score Cognitif = (Verbal × 0.20) + (Numérique × 0.25) + (Logique × 0.20) +
                 (Abstrait × 0.15) + (Spatial × 0.20)
```

#### **Facteurs d'Ajustement :**
- **Cohérence** : Bonus pour des performances stables à travers les tests
- **Amélioration** : Bonus pour les tendances d'amélioration récentes
- **Récence** : Poids plus élevé pour les tests récents (derniers 6 mois)

### Types de Recommandations

**Filtrage Basé sur le Contenu :**
- Correspondances basées sur vos compétences et performances aux tests
- Analyse des descriptions d'emploi pour les exigences de compétences
- Utilise l'apprentissage automatique pour la correspondance sémantique
- **Intégration cognitive** : Analyse des exigences cognitives des postes

**Filtrage Collaboratif :**
- Trouve des candidats similaires et leurs correspondances réussies
- Identifie les modèles dans les décisions d'embauche
- Recommande des emplois pour lesquels des profils similaires ont été embauchés
- **Clustering cognitif** : Groupe les candidats par profils cognitifs similaires

**Approche Hybride :**
- Combine plusieurs stratégies de recommandation
- Équilibre différents facteurs basés sur votre profil
- Apprend continuellement de vos interactions
- **Optimisation cognitive** : Ajuste les recommandations selon vos forces cognitives

---

## Expérience et Niveaux (XP)

### Aperçu du Système XP
Le système XP (Points d'Expérience) gamifie votre parcours d'apprentissage, récompensant diverses activités avec des points qui contribuent à votre niveau global.

### Sources et Valeurs XP

#### 1. **Complétion de Tests**
**Formule de Base** : `(100 XP × Multiplicateur de Difficulté) + Bonus de Score + Bonus de Longueur`

**Multiplicateurs de Difficulté :**
- Facile : 1.0× (100 XP)
- Moyen : 1.5× (150 XP)
- Difficile : 2.0× (200 XP)
- Expert : 2.5× (250 XP)

**Bonus de Score :**
- Score 90%+ : +50 XP
- Score 80%+ : +30 XP
- Score 70%+ : +15 XP
- Score 60%+ : +5 XP

**Bonus de Longueur** : `(Questions - 10) × 5 XP` (pour tests > 10 questions)

**Exemple** : Test difficile (20 questions, score 85%) = 200 + 30 + 50 = 280 XP

#### 2. **Évaluation de Compétences**
- Base : 75 XP
- Bonus de Complétion : +25 XP
- Bonus Score Parfait : +100 XP
- Bonus Multi-Compétences : `(Nombre de Compétences - 1) × 10 XP`

#### 3. **Complétion de Profil**
- Informations de Base : 50 XP
- Compétences Ajoutées : 25 XP chacune
- Bio Complétée : 30 XP
- CV Téléchargé : 75 XP
- Photo de Profil : 20 XP
- Objectifs de Carrière : 40 XP

#### 4. **Engagement Quotidien**
- Connexion Quotidienne : 10 XP × jours de série (max 30)
- Série Hebdomadaire : 50 XP × nombre de semaines
- Série Mensuelle : 200 XP × nombre de mois
- Premier Test du Jour : 15 XP × jours

#### 5. **Réalisations**
- Premier Score Parfait : 200 XP
- Maître des Tests (10+ tests) : 300 XP
- Maître de Vitesse : 150 XP
- Série d'Amélioration : 100 XP
- Apprenant Polyvalent : 250 XP

### Progression de Niveau

| Niveau | XP Requis | XP Cumulé | Titre |
|--------|-----------|-----------|-------|
| 1 | 0 | 0 | Explorateur de Carrière |
| 2 | 500 | 500 | Chercheur de Compétences |
| 3 | 700 | 1,200 | Bâtisseur de Connaissances |
| 4 | 1,300 | 2,500 | Conquérant de Tests |
| 5 | 2,000 | 4,500 | Maître des Compétences |
| 6 | 3,000 | 7,500 | Pro de la Performance |
| 7 | 4,500 | 12,000 | Atteint l'Excellence |
| 8 | 6,000 | 18,000 | Champion de Carrière |
| 9 | 8,000 | 26,000 | Expert de l'Industrie |
| 10 | 10,000 | 36,000 | Performeur d'Élite |
| 11+ | 14,000+ | 50,000+ | Professionnel Légendaire |

### Avantages par Niveau
- **Niveau 1-2** : Accès de base au tableau de bord et aux tests
- **Niveau 3-4** : Analyses avancées et suivi des compétences
- **Niveau 5-6** : Analyse experte et recommandations personnalisées
- **Niveau 7-8** : Insights de leadership et fonctionnalités premium
- **Niveau 9-10** : Statut d'expert de l'industrie et contenu exclusif
- **Niveau 11+** : Avantages de membre élite et conseiller personnel

### Calcul de Progression
**Pourcentage de Progression** : `(XP Actuel - XP Niveau Actuel) / (XP Niveau Suivant - XP Niveau Actuel) × 100`

**Exemple** : Utilisateur avec 3,000 XP au Niveau 4
- XP Niveau Actuel : 2,500
- XP Niveau Suivant : 4,500
- Progression : (3,000 - 2,500) / (4,500 - 2,500) × 100 = 25%

---

## Conseils pour l'Amélioration

### Améliorer Votre Score d'Employabilité
1. **Passez des Tests Diversifiés** : Couvrez toutes les catégories de compétences
2. **Choisissez le Bon Profil** : Sélectionnez le profil qui correspond à vos objectifs de carrière
3. **Concentrez-vous sur les Points Faibles** : Identifiez les catégories à faible score et pratiquez
4. **Refaites les Tests** : Plusieurs tentatives aident à améliorer vos scores moyens
5. **Restez Cohérent** : Les tests réguliers montrent l'engagement et l'amélioration

### Maximiser les Gains XP
1. **Engagement Quotidien** : Connectez-vous quotidiennement pour construire des séries
2. **Complétez Votre Profil** : XP facile de la complétion de profil
3. **Passez des Tests Difficiles** : Difficulté plus élevée = plus d'XP
4. **Visez des Scores Élevés** : Les bonus de score ajoutent des XP significatifs
5. **Gagnez des Réalisations** : Gros bonus XP pour les jalons

### Obtenir de Meilleures Recommandations
1. **Mettez à Jour Vos Compétences** : Gardez votre liste de compétences à jour
2. **Définissez des Préférences** : Spécifiez la localisation, le salaire et les préférences de travail
3. **Passez des Tests Pertinents** : Concentrez-vous sur les tests liés à vos rôles cibles
4. **Maintenez des Scores Élevés** : Meilleure performance = meilleures correspondances d'emploi
5. **Restez Actif** : L'activité régulière améliore la précision des recommandations

---

*Ce système de notation est conçu pour fournir des commentaires équitables, complets et exploitables pour vous aider à faire progresser votre carrière. Les algorithmes évoluent continuellement basés sur les tendances de l'industrie et les commentaires des utilisateurs.*
