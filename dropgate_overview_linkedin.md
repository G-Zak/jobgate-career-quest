# Dropgate — Plateforme de validation des compétences & recrutement (Aperçu)

**Zakaria Guennani — Étudiant en Génie Logiciel**  
Stage : Juillet – Septembre 2025

---

## One‑liner

Conception et développement d’un prototype full‑stack pour évaluer les compétences techniques et cognititives, faciliter la présélection des candidats via des tests (y compris une batterie de tests cognitifs), et fournir un tableau de bord utilisateur pour visualiser les résultats.

## Contexte

Les équipes de recrutement manquent souvent d'outils objectifs et rapides pour valider les compétences techniques. L'objectif de Dropgate était de construire une solution qui permet :
- la passation de tests (QCM, SJT, raisonnement),
- l'analyse automatique des résultats,
- la génération de recommandations exploitables pour les recruteurs.

## Ce que fait la plateforme (en bref)

- Permet la création et la gestion de tests (différents formats : QCM, SJT, et surtout une batterie de tests cognitifs : raisonnement abstrait, raisonnement spatial, logique).  
- Offre une interface candidate pour passer les tests (chronométrage, navigation, validations) et un tableau de bord utilisateur pour consulter ses résultats et historiques.  
- Calcule des scores bruts et les normalise (pondérations métier, percentiles).  
- Fonctionnalités d'export et d'aide à la sélection (recommandations et filtres) destinées à l'utilisation interne ou à l'export pour les recruteurs.

## Comment ça marche (haute‑niveau)

1. Le candidat accède au test depuis le frontend (React).  
2. Les réponses et la session sont envoyées à l'API (Django REST).  
3. Le service de scoring traite la session : application des règles métiers (SJT), pondération par compétence, normalisation.  
4. Les résultats sont stockés en base (PostgreSQL) et servis au tableau de bord recruteur.  
5. Le tableau de bord utilisateur permet de visualiser ses résultats, télécharger ses rapports et (selon configuration) produire des exports pour les recruteurs.

### Pipeline de scoring & clustering

- Validation préalable : avant tout calcul, la session est vérifiée (format, complétude, anti‑fraude). **Les scores et recommandations ne sont calculés que si la validation est passée.** En cas d'erreur la session est sauvegardée pour audit et le candidat est notifié / invité à reprendre le test si nécessaire.  
- Score brut : calcul direct à partir des réponses (nombre de bonnes réponses, temps, erreurs critiques).  
- Pondération : application de poids par compétence / type de test (par ex. donner plus d'importance aux tests cognitifs pour certains postes).  
- Normalisation : conversion en percentiles au sein de la population pour rendre les scores comparables.  
- Clustering (k‑means) : segmentation des candidats par profils de performance pour repérer des groupes homogènes (ex. « forts en logique mais faibles en spatial »).  
- Recommandations : combinaison de règles métiers (seuils, priorités) et de similarité au cluster / profil cible pour proposer des candidats pertinents.

### Quand le clustering est‑il effectué ? (modes d'activation)

- Activation configurable : le clustering est activé via un paramètre de configuration (feature flag) — on peut décider de l'activer par environnement (dev/test/prod) ou par campagne.  
- Seuil d'échantillon : pour obtenir des clusters stables, le clustering n'est lancé que si un nombre minimal d'échantillons (ex. 30–50 sessions) est disponible pour la population ciblée.  
- Mode temps réel vs batch :
  - **Batch (recommandé)** : exécution périodique (nightly / hebdomadaire) sur l'ensemble des sessions — stable et reproductible.  
  - **Temps réel/à la soumission** : possible en mode prototype pour assigner immédiatement un candidat à un cluster (si le modèle a été entraîné et que le seuil d'échantillon est respecté). Ce mode est souvent asynchrone (enqueue job) pour ne pas bloquer l'UX.  
  - **On‑demand / admin** : possibilité de relancer un reclustering manuel (recompute) depuis l'interface admin ou un script CLI.  
- Prétraitement requis : extraction et scaling des features (StandardScaler / MinMax) avant k‑means. Les paramètres de transformation doivent être versionnés avec le modèle de clustering.  
- Stockage & versioning : les affectations de cluster et la version du modèle (params k, seed, date) sont stockées pour traçabilité et pour permettre le rescoring si nécessaire.  

En pratique, le pipeline garde la session brute pour audit et permet de relancer des traitements (rescoring, reclustering) si la logique évolue.

Architecture (schéma simplifié) :

```
Candidat (Browser)
  → Frontend React (Vite + Tailwind)
    → API Django REST
      → Scoring Service
        → PostgreSQL
    ← Tableau de bord Recruteur
```

## Fonctionnalités clés

- Passation de tests multi‑types (QCM, SJT) et une batterie de tests cognitifs (raisonnement abstrait, raisonnement spatial, logique).  
- Scoring configurable : règles métiers, pondération par compétence et normalisation (percentiles).  
- Tableau de bord utilisateur : consultation des résultats, historique, export de rapports (CSV/PDF).  
- Mécanismes d'import / rescoring pour corriger des données historiques.
 - Clustering & recommandations : utilisation de k‑means pour segmenter les profils et moteur de recommandations mixte (règles + similarité aux clusters).  
 - Visualisation des scores et segmentation : affichage des percentiles, labels de compétence et grouping pour faciliter l'interprétation.

## Mon rôle & contributions

- Conception technique du prototype (choix technologiques, API).  
- Développement backend complet : modèles, serializers, API endpoints (Django REST), logique métier et scripts d’import/migration.  
- Conception et administration de la base de données (PostgreSQL) : modèles, migrations, indexation et scripts de nettoyage.  
- Développement frontend : pages de passation, tableau de bord utilisateur, composants réutilisables (React + Tailwind).  
- Réalisation du module de scoring : règles SJT, pondérations, normalisation et spécialisation pour tests cognitifs.  
- Tests, debug, et documentation technique pour l'équipe.
 
- Méthodologie : travail en **Scrum** avec itérations courtes; projet réalisé en équipe de **3 personnes** (développement collaboratif, revues de code et meetings de suivi).
 - Implémentation d'un prototype de moteur de recommandations : algorithme de clustering (k‑means) pour segmentation, logique de matching et génération de suggestions basées sur les scores normalisés.

## Résultats & impact

- Prototype fonctionnel livré en fin de stage.  
- Base technique stable pour itérations ultérieures (API documentée et UI modulaire).  
- Amélioration de la fiabilité du scoring, en particulier pour les tests cognitifs et SJT, via scripts de correction et règles métiers supplémentaires.  

- Ajout d'une couche de clustering (k‑means) a permis d'identifier des segments de candidats et d'affiner les recommandations, améliorant la pertinence des suggestions dans les scénarios testés.

Si des métriques sont disponibles (ex. nombre de tests, passations), elles peuvent être insérées ici pour renforcer l'impact.

## Compétences développées

- Techniques : Django REST Framework, React (Vite), Tailwind CSS, PostgreSQL (modélisation, migrations, optimisation), Docker (déploiement local), scripts d’import/ETL, gestion des règles de scoring pour tests cognitifs.  
- Data & ML basique : implémentation de k‑means pour clustering, traitement des features, normalisation et utilisation des clusters pour recommandations simples.
- Méthodologiques : conception d’API, architecture full‑stack, définition et implémentation de règles métiers, priorisation technique.  
- Méthodes de travail : Scrum (sprints, standups, revues) et collaboration en équipe.  
- Soft skills : communication produit, présentation auprès des parties prenantes, autonomie et résolution de problèmes.

## Mots clés (LinkedIn)

Validation des compétences · Scoring · Django · React · API REST · PostgreSQL · Recrutement · Tests techniques · SJT · Data cleaning

## Liens & contact

- Dépôt / Démo : (ajoute ici le lien vers le repo ou la démo)  
- Contact : zakariaguennani@example.com

---

_Remarque :_ ce document est volontairement synthétique — il sert d’aperçu professionnel pour LinkedIn. Si tu veux, je peux générer une version plus courte (150‑200 signes) pour la section « expérience » sur LinkedIn, ou créer un fichier markdown/HTML prêt à télécharger et convertir en PDF.

## Figures suggérées (à inclure)

Voici une liste de figures visuelles recommandées pour illustrer rapidement le projet dans le document ou dans un post LinkedIn. Pour chaque figure je donne : type, emplacement conseillé, courte légende et recommandations d'export.

1. Couverture — Mockup du tableau de bord
  - Type : mockup / screenshot du front (page d'accueil ou écran principal de test).  
  - Emplacement : page 1 (couverture) — grand visuel central.  
  - Légende : « Aperçu du tableau de bord candidat / écran de test ».  
  - Export : PNG ou JPEG 1200–1800 px de largeur pour web, 300 dpi si impression.  

2. Schéma de flux utilisateur (User flow)
  - Type : diagramme simple (icônes + flèches).  
  - Emplacement : Page 3 ou 4 (Comment ça marche / Architecture).  
  - Légende : « Flux : Candidat → Frontend → API → Scoring → Stockage ».  
  - Reco : SVG (pour netteté) ou PNG 1000–1400 px.  

3. Architecture technique (Architecture stack)
  - Type : diagramme composants (API, DB, scoring, frontend).  
  - Emplacement : Page 4 (Architecture).  
  - Légende : « Architecture générale : Django REST, PostgreSQL, Scoring, React ».  
  - Reco : SVG ou PDF vectoriel si possible.

4. Pipeline de scoring (étapes)
  - Type : infographic horizontale (raw → weighted → normalized → clustered → recommended).  
  - Emplacement : Page 4 (Pipeline de scoring & clustering).  
  - Légende : « Pipeline : calcul, pondération, normalisation, clustering (k‑means) ».  
  - Reco : SVG/PNG; garder suffisamment d'espace pour labels clairs.

5. Visualisation du clustering (k‑means)
  - Type : scatter plot (2D) ou radar chart montrant 2–4 clusters synthétiques (ou exemple réel anonymisé).  
  - Emplacement : Page 4 ou Page 5 (résultats/impact).  
  - Légende : « Segmentation des profils par performance (k‑means) ».  
  - Reco : PNG 1000 px, inclure axe/legend, couleurs contrastées.

6. Capture écran – Test cognitif (sample)
  - Type : screenshot de l'interface de passation (question + timer).  
  - Emplacement : Page 3 (Solution développée / Captures).  
  - Légende : « Extrait d’un test de raisonnement abstrait ».  
  - Reco : PNG, recadrer sur le contenu utile, flouter données personnelles.

7. Exemple de rapport utilisateur / export PDF
  - Type : vignette du PDF exporté (aperçu).  
  - Emplacement : Page 5 (résultats & impact).  
  - Légende : « Rapport de performance exportable ».  
  - Reco : PNG ou JPEG compressé; proposer un lien vers le PDF complet.

8. Timeline & workflow Scrum (optionnel)
  - Type : carte visuelle (sprint backlog / Kanban snapshot).  
  - Emplacement : Annexes ou page 5 (méthodologie).  
  - Légende : « Organisation en Scrum — sprints courts et revues ».  
  - Reco : PNG/SVG.

9. Photo d’équipe / image « about us » (optionnel)
  - Type : photo d’équipe ou collage d’avatars (3 personnes).  
  - Emplacement : page de conclusion ou annexes.  
  - Légende : « Équipe projet — 3 personnes ».  
  - Reco : JPG/PNG, respecter la confidentialité et droits à l'image.

Conseils généraux pour les figures
- Format web : privilégier PNG/JPEG optimisés (taille < 400 KB pour posts).  
- Format print/PDF : PNG 300 dpi ou SVG/PDF vectoriel.  
- Accessibilité : toujours ajouter une légende courte et un alt text (2–6 mots) pour chaque image.  
- Outils : Figma / Canva / Sketch pour mockups; Matplotlib / Seaborn / Plotly pour charts; draw.io ou diagrams.net pour schémas rapides.

Si tu veux, je peux générer des templates HTML/CSS pour placer ces figures dans un PDF imprimable, ou préparer des images prototypes (diagrammes et plots) à partir de données factices.
