# 🔧 Guide de Configuration et Installation

## Prérequis

### Système
- **Node.js**: 18.0.0 ou supérieur
- **pnpm**: 9.0.0 ou supérieur (gestionnaire de paquets recommandé)
- **Git**: Pour le version control

### Navigateur
- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Installation Locale

### 1. Cloner le Repository

```bash
# HTTPS
git clone https://github.com/[username]/gestion-stocks.git

# SSH
git clone git@github.com:[username]/gestion-stocks.git

# Naviguer dans le dossier
cd gestion-stocks
```

### 2. Installer les Dépendances

```bash
# Utiliser pnpm (recommandé)
pnpm install

# Ou npm
npm install

# Ou yarn
yarn install
```

### 3. Démarrer le Serveur de Développement

```bash
pnpm dev
```

L'application s'ouvre automatiquement à:
- **Frontend**: http://localhost:5173
- **Backend** (si activé): http://localhost:3000

### 4. Vérifier la Configuration

```bash
# Afficher la version Node
node --version

# Afficher la version pnpm
pnpm --version

# Afficher les variables de démarrage
pnpm run build
```

## Configuration des Variables d'Environnement

### Fichier `.env` (Optionnel)

```bash
# Créer un fichier .env à la racine du projet
touch .env
```

**Contenu recommandé:**
```env
# Frontend
VITE_API_URL=http://localhost:3000
VITE_ENABLE_SERVICE_WORKER=true

# Backend (optionnel)
NODE_ENV=development
PORT=3000
DATABASE_URL=http://localhost:5984

# Sentry (futur)
# VITE_SENTRY_DSN=https://...
```

### Fichier `.env.production`

```env
VITE_API_URL=https://api.example.com
VITE_ENABLE_SERVICE_WORKER=true
NODE_ENV=production
```

**Note**: Ne jamais commiter les fichiers `.env` avec des secrets!

## Structure des Dossiers Importante

### `client/`
```
client/
├── components/          # Composants React réutilisables
│   ├── Layout.tsx      # Layout principal
│   ├── PageHeader.tsx  # Header des pages
│   └── ui/             # Composants shadcn/ui
├── pages/              # Pages de l'application
│   ├── Index.tsx       # Page d'accueil
│   ├── Vendre.tsx      # Enregistrement ventes
│   ├── Rapports.tsx    # Rapports
│   └── ...
├── lib/                # Logique métier
│   ├── context.tsx     # State management
│   ├── db.ts           # Database utilities
│   ├── reports.ts      # Reports engine
│   └── whatsapp.ts     # WhatsApp integration
├── hooks/              # Hooks personnalisés
└── global.css          # Styles globaux
```

### `server/` (Optionnel)
```
server/
├── index.ts            # Express setup
└── routes/             # Route handlers
    └── demo.ts         # Exemple route
```

### `shared/`
```
shared/
└── api.ts              # Types partagés
```

## Configuration Tailwind CSS

Le fichier `tailwind.config.ts` est déjà configuré avec:

```typescript
// Couleurs personnalisées
colors: {
  success: "#16A34A",
  warning: "#EA580C",
  danger: "#DC2626",
  neutral: "#6B7280",
}

// Breakpoints
screens: {
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
}
```

Pour ajouter de nouvelles couleurs:

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        'custom-color': '#123456',
      }
    }
  }
}
```

## Configuration TypeScript

Le fichier `tsconfig.json` configure:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./client/*"],
      "@shared/*": ["./shared/*"]
    }
  }
}
```

Cela permet d'importer sans chemins relatifs:
```typescript
// Au lieu de: import { Product } from '../../../shared/api'
import { Product } from '@shared/api'
```

## Configuration Vite

### `vite.config.ts`

Configurations principales:
- **Plugin React** pour JSX/TSX
- **SWC** pour compilation ultra-rapide
- **Path aliases** pour imports propres

### `vite.config.server.ts`

Configuration serveur Express séparé (optionnel).

## Scripts NPM Disponibles

```bash
# Développement
pnpm dev              # Démarrer dev server

# Build
pnpm build            # Build production
pnpm build:client     # Build frontend uniquement
pnpm build:server     # Build backend uniquement

# Serveur
pnpm start            # Démarrer app production

# Tests
pnpm test             # Exécuter les tests
pnpm test:watch      # Tests avec watcher

# Code Quality
pnpm typecheck       # Vérifier types TypeScript
pnpm format.fix      # Formater le code (prettier)
```

## Configuration des IDE

### VS Code (Recommandé)

**Extensions recommandées:**
```
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- TypeScript Vue Plugin
- Vite
```

**Fichier `.vscode/settings.json`:**
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

### WebStorm/IntelliJ

- Activer "EditorConfig support"
- Configurer Prettier comme formatter par défaut
- Activer "Tailwind CSS" support

## Test de Configuration

Vérifier que tout est bien configuré:

```bash
# 1. Vérifier Node.js
node --version         # Doit être >= 18.0.0

# 2. Vérifier pnpm
pnpm --version         # Doit être >= 9.0.0

# 3. Installer les dépendances
pnpm install

# 4. Exécuter les tests
pnpm test              # Doit passer

# 5. Vérifier types
pnpm typecheck         # Pas d'erreurs

# 6. Build production
pnpm build             # Succès

# 7. Démarrer le serveur
pnpm dev               # Accès à http://localhost:5173
```

## Configuration du Service Worker

Le Service Worker est optionnel et peut être activé via:

```typescript
// client/main.ts ou App.tsx
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

## Configuration de la Base de Données Locale

Les données sont stockées automatiquement dans `localStorage`:

```typescript
// Accéder aux données
const data = localStorage.getItem('stock_app_data');
const parsed = JSON.parse(data);

// Effacer les données
localStorage.removeItem('stock_app_data');
```

## Configuration pour Production

### Build Optimisé

```bash
pnpm build
# Génère:
# - dist/index.html
# - dist/spa/assets/
# - dist/server/ (si backend inclus)
```

### Variables d'Environnement Production

```env
VITE_API_URL=https://api.example.com
NODE_ENV=production
VITE_ENABLE_SERVICE_WORKER=true
```

### Déploiement

Voir [README.md](./README.md#-démarrage-rapide) pour les options de déploiement.

## Dépannage

### Port déjà utilisé
```bash
# Changer le port
pnpm dev -- --port 3000
```

### Cache problématique
```bash
# Vider le cache npm
pnpm store prune

# Réinstaller les dépendances
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Service Worker problématique
```bash
# Effacer le cache du service worker
# Dans DevTools: Application → Service Workers → Unregister
```

### Build échouée
```bash
# Vérifier les types TypeScript
pnpm typecheck

# Vérifier les dépendances
pnpm audit

# Réinstaller si nécessaire
pnpm install --force
```

## Ressources Supplémentaires

- [Documentation Vite](https://vitejs.dev)
- [Documentation React](https://react.dev)
- [Documentation Tailwind](https://tailwindcss.com)
- [Documentation TypeScript](https://www.typescriptlang.org)
- [Guide pnpm](https://pnpm.io)

## Prochaines Étapes

Après la configuration:
1. Lire [ARCHITECTURE.md](./ARCHITECTURE.md)
2. Explorer les pages dans `client/pages/`
3. Consulter [CONTRIBUTING.md](./CONTRIBUTING.md) pour contribuer
4. Vérifier [API.md](./API.md) pour les détails de l'API
