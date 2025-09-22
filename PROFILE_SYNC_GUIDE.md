# Guide de Synchronisation du Profil Utilisateur

## 🎯 Vue d'ensemble

Le système de synchronisation du profil permet de maintenir automatiquement les recommandations d'emploi à jour en fonction des modifications apportées au profil utilisateur.

## ✨ Fonctionnalités

### 1. **Synchronisation Automatique**
- Les recommandations se mettent à jour automatiquement quand vous modifiez votre profil
- Synchronisation en temps réel avec le backend
- Indicateurs visuels du statut de synchronisation

### 2. **Gestion des Compétences**
- Ajout/suppression de compétences avec niveaux de maîtrise
- Recherche et suggestions de compétences
- Catégorisation automatique des compétences

### 3. **Éducation et Expérience**
- Édition en ligne des formations et expériences
- Ajout/suppression d'entrées
- Validation des données

### 4. **Gestion du CV**
- Upload de fichiers PDF, DOC, DOCX
- Validation de la taille (max 5MB)
- Téléchargement et suppression

## 🚀 Comment utiliser

### Étape 1: Accéder au Profil
1. Allez sur la page "Profil" dans l'interface
2. Vous verrez votre profil actuel avec toutes vos informations

### Étape 2: Modifier vos Compétences
1. Dans la section "Compétences", cliquez sur "Ajouter"
2. Recherchez ou parcourez les compétences disponibles
3. Sélectionnez vos compétences et définissez votre niveau de maîtrise
4. Les compétences sont automatiquement catégorisées

### Étape 3: Mettre à jour l'Éducation
1. Dans la section "Education", cliquez sur "+" pour ajouter une formation
2. Remplissez les champs : Programme, École, Période, Description
3. Utilisez l'icône poubelle pour supprimer une entrée

### Étape 4: Ajouter votre Expérience
1. Dans la section "Work Experience", cliquez sur "+" pour ajouter un poste
2. Remplissez les champs : Poste, Entreprise, Période, Description
3. Utilisez l'icône poubelle pour supprimer une entrée

### Étape 5: Télécharger votre CV
1. Dans la section "CV/Resume", cliquez sur "Télécharger CV"
2. Sélectionnez un fichier PDF, DOC ou DOCX (max 5MB)
3. Le fichier sera validé et affiché avec ses informations

### Étape 6: Sauvegarder et Synchroniser
1. Cliquez sur "Save Changes" pour sauvegarder vos modifications
2. Le système synchronisera automatiquement avec le backend
3. Vous verrez des notifications de statut de synchronisation
4. Les recommandations d'emploi seront mises à jour automatiquement

## 🔄 Statuts de Synchronisation

- **🔄 Synchronisation...** : Le profil est en cours de synchronisation
- **✅ Synchronisé avec succès** : La synchronisation s'est bien déroulée
- **❌ Erreur de synchronisation** : Une erreur s'est produite, réessayez

## 🎨 Interface Utilisateur

### Indicateurs Visuels
- **Bouton de sauvegarde** : Change de couleur selon l'état
- **Notifications** : Affichage du statut de synchronisation
- **Champs d'édition** : Interface intuitive pour modifier les données
- **Validation** : Messages d'erreur pour les données invalides

### Thème Sombre
- Support complet du mode sombre
- Transitions fluides entre les modes
- Couleurs adaptées pour une meilleure lisibilité

## 🛠️ Dépannage

### Problèmes Courants

1. **Synchronisation échouée**
   - Vérifiez votre connexion internet
   - Assurez-vous que le backend est en cours d'exécution
   - Réessayez en cliquant sur "Save Changes"

2. **Compétences non mises à jour**
   - Vérifiez que vous avez cliqué sur "Save Changes"
   - Attendez que la synchronisation soit terminée
   - Rafraîchissez la page des recommandations

3. **Erreur d'upload de CV**
   - Vérifiez que le fichier est au bon format (PDF, DOC, DOCX)
   - Vérifiez que la taille ne dépasse pas 5MB
   - Réessayez avec un autre fichier

### Logs de Débogage
- Ouvrez la console du navigateur (F12)
- Regardez les messages de synchronisation
- Les erreurs sont affichées avec des détails

## 🔧 Configuration Technique

### Services Utilisés
- `ProfileSyncService` : Gestion de la synchronisation
- `useProfileSync` : Hook React pour l'état de synchronisation
- `SyncNotification` : Composant d'affichage des notifications

### Stockage Local
- Les données sont sauvegardées dans `localStorage`
- Clé : `userProfile_${userId}`
- Synchronisation automatique avec le backend

## 📱 Responsive Design

- Interface adaptée aux mobiles et tablettes
- Grille responsive pour l'affichage des compétences
- Navigation optimisée pour les petits écrans

## 🎯 Prochaines Améliorations

- [ ] Synchronisation en temps réel avec WebSockets
- [ ] Historique des modifications du profil
- [ ] Export du profil en PDF
- [ ] Import de données depuis LinkedIn
- [ ] Suggestions de compétences basées sur l'IA
