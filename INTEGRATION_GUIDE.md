# Guide d'Intégration - Système d'Authentification

## 🎯 Ce qui a été créé

### 1. **Pages d'Authentification**
- `frontend/src/pages/auth/LoginPage.jsx` - Page de connexion
- `frontend/src/pages/auth/RegisterPage.jsx` - Page d'inscription

### 2. **Contexte d'Authentification**
- `frontend/src/contexts/AuthContext.jsx` - Gestion de l'état d'authentification
- `frontend/src/hooks/useLogout.js` - Hook pour la déconnexion
- `frontend/src/components/LogoutButton.jsx` - Composant bouton de déconnexion

### 3. **Routes et Navigation**
- `frontend/src/routes/AppRoutes.jsx` - Configuration des routes
- `frontend/src/pages/HomePage.jsx` - Page d'accueil avec redirection

## 🔧 Comment intégrer le bouton de déconnexion

### Option 1: Utiliser le composant LogoutButton existant

Dans votre dropdown de profil existant, remplacez votre bouton de déconnexion par :

```jsx
import LogoutButton from '../components/LogoutButton';

// Dans votre dropdown
<LogoutButton className="w-full text-left">
  Se déconnecter
</LogoutButton>
```

### Option 2: Utiliser le hook useLogout

Si vous préférez garder votre bouton existant, ajoutez simplement :

```jsx
import { useLogout } from '../hooks/useLogout';

// Dans votre composant
const { handleLogout } = useLogout();

// Sur votre bouton existant
<button onClick={handleLogout}>
  Se déconnecter
</button>
```

## 🚀 Fonctionnalités

### ✅ **Connexion/Inscription**
- Validation des formulaires
- Gestion des erreurs
- Redirection automatique après connexion
- Support du mode sombre

### ✅ **Déconnexion**
- Suppression de toutes les données utilisateur du localStorage
- Redirection vers la page de connexion
- Nettoyage complet de l'état

### ✅ **Protection des Routes**
- Redirection automatique si non connecté
- Redirection vers le dashboard si déjà connecté
- Gestion des états de chargement

## 🔄 Flux d'Utilisation

1. **Première visite** → Redirige vers `/login`
2. **Connexion réussie** → Redirige vers `/dashboard`
3. **Déconnexion** → Redirige vers `/login`
4. **Inscription** → Redirige vers `/profile`

## 📁 Structure des Fichiers

```
frontend/src/
├── contexts/
│   └── AuthContext.jsx          # Contexte d'authentification
├── hooks/
│   └── useLogout.js             # Hook de déconnexion
├── components/
│   └── LogoutButton.jsx         # Composant bouton de déconnexion
├── pages/
│   ├── auth/
│   │   ├── LoginPage.jsx        # Page de connexion
│   │   └── RegisterPage.jsx     # Page d'inscription
│   └── HomePage.jsx             # Page d'accueil
└── routes/
    └── AppRoutes.jsx            # Configuration des routes
```

## 🎨 Personnalisation

### Modifier les styles des pages d'authentification
Les pages utilisent Tailwind CSS et s'adaptent automatiquement au mode sombre.

### Modifier les messages d'erreur
Modifiez les messages dans les composants `LoginPage.jsx` et `RegisterPage.jsx`.

### Ajouter des champs supplémentaires
Modifiez les formulaires dans les pages d'authentification.

## 🔧 Test

1. **Test de connexion** : Allez sur `/login` et connectez-vous
2. **Test d'inscription** : Allez sur `/register` et créez un compte
3. **Test de déconnexion** : Utilisez le bouton de déconnexion dans le dropdown
4. **Test de protection** : Essayez d'accéder à `/dashboard` sans être connecté

## ⚠️ Notes Importantes

- Le système utilise localStorage pour la persistance des données
- Les mots de passe ne sont pas réellement sécurisés (simulation)
- Pour un environnement de production, intégrez avec un vrai backend d'authentification
- Le système est compatible avec votre architecture existante
