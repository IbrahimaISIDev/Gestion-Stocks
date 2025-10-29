# 🏗️ Architecture Technique

## Vue d'Ensemble

```
┌─────────────────────────────────────────────────────────────┐
│           PROGRESSIVE WEB APP (PWA)                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │     INTERFACE UTILISATEUR (React 18 + TypeScript)      │ │
│  │  - Pages (8 pages)                                     │ │
│  │  - Composants UI (shadcn/ui)                           │ │
│  │  - Hooks personnalisés                                 │ │
│  │  - Styling (Tailwind CSS)                              │ │
│  └────────────────────────────────────────────────────────┘ │
│                           ↓                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │      COUCHE DE GESTION D'ÉTAT (React Context)          │ │
│  │  - useStock() hook                                     │ │
│  │  - Produits, Fournisseurs, Mouvements                  │ │
│  │  - Actions CRUD                                        │ │
│  │  - Statut en ligne/hors ligne                          │ │
│  └────────────────────────────────────────────────────────┘ │
│                           ↓                                 │
│  ┌─��─────────────────────────────────────────────────────┐ │
│  │    COUCHE DE STOCKAGE (localStorage/IndexedDB)         │ │
│  │  - Persistance des données                             │ │
│  │  - Génération d'IDs                                    │ │
│  │  - Calculs (stock, profit)                             │ │
│  └────────────────────────────────────────────────────────┘ │
│                           ↓                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           SERVICE WORKER (Workbox)                     │ │
│  │  - Cache des assets (HTML, CSS, JS)                    │ │
│  │  - Fonctionnement hors ligne                           │ │
│  │  - Synchronisation en arrière-plan                     │ │
│  └─────────────────────────────────────────────��─────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
         ↓ (Futur - Quand la connexion est disponible)
┌─────────────────────────────────────────────────────────────┐
│              SERVEUR BACKEND (Futur - v2)                   │
│  - CouchDB pour synchronisation                             │
│  - Authentification utilisateur                             │
│  - API REST                                                 │
└─────────────────────────────────────────────────────────────┘
```

## Composants Clés

### 1. **Layout Component** (`client/components/Layout.tsx`)

Wrapper global avec:
- **Header Sticky** - Navigation horizontale + logo + statut en ligne
- **Mobile Menu** - Hamburger menu pour petit écran
- **Bottom Navigation** - Navigation mobile responsive
- **Main Content** - Zone de contenu principal

```typescript
interface NavItem {
  path: string;
  label: string;
  icon: ReactNode;
  shortLabel: string;
}
```

### 2. **Context Provider** (`client/lib/context.tsx`)

Gestion d'état centralisée avec:
- **Products State** - CRUD des produits
- **Suppliers State** - CRUD des fournisseurs
- **Movements State** - Enregistrement des transactions
- **Online Status** - Indicateur en ligne/hors ligne

```typescript
interface StockContextType {
  products: Product[];
  suppliers: Supplier[];
  movements: Movement[];
  isOnline: boolean;
  
  // Operations
  addProduct, updateProduct, deleteProduct
  addSupplier, updateSupplier, deleteSupplier
  addMovement
  getProductStock
  getLowStockProducts
}
```

### 3. **Database Layer** (`client/lib/db.ts`)

Utilitaires pour:
- **Chargement/Sauvegarde** - localStorage JSON
- **Calcul du stock** - Dynamique basé sur mouvements
- **Génération d'IDs** - Identifiants uniques
- **Données mockées** - Données initiales

### 4. **Reports Engine** (`client/lib/reports.ts`)

Génération de rapports avec:
- **Filtrage par dates** - 6 périodes différentes
- **Calculs statistiques** - Ventes, profit, quantités
- **Groupement par catégorie** - Analyse par type
- **Export CSV** - Téléchargement de données

### 5. **WhatsApp Integration** (`client/lib/whatsapp.ts`)

Intégration WhatsApp avec:
- **Message Formatting** - Format professionnel
- **Link Generation** - URLs wa.me/?text=
- **Order Preparation** - Structure d'envoi

## Flux de Données Détaillé

### Cycle de Vie d'une Vente

```
1. Utilisateur clique "VENDRE"
   ↓
2. Page /vendre charge
   ↓
3. Affichage de la liste de produits
   - Recherche en temps réel
   - Filtre par catégorie
   ↓
4. Utilisateur ajoute au panier
   - État local du composant
   - Panier côté client
   ↓
5. Utilisateur clique "VALIDER LA VENTE"
   ↓
6. Création du mouvement (SORTIE)
   - addMovement() → Context
   - Calcul du stock
   - Sauvegarde localStorage
   ↓
7. Toast de confirmation
   ↓
8. Redirection vers accueil
```

### Cycle de Vie d'une Commande WhatsApp

```
1. Utilisateur clique "COMMANDES"
   ↓
2. Sélectionne un fournisseur
   ↓
3. Recherche et ajoute des produits
   - Filtre par catégorie
   - Panier de commande
   ↓
4. Optionnel: Ajoute une note
   ↓
5. Clique "Aperçu"
   - Génération du message formaté
   - Affichage en modal
   ↓
6. Clique "Envoyer via WhatsApp"
   - Génération du lien wa.me
   - Ouverture de WhatsApp Web/App
   - Utilisateur envoie le message
   ↓
7. Modal ferme
```

## Types et Interfaces

### Product
```typescript
interface Product {
  _id: string;
  type: 'produit';
  nom: string;
  description?: string;
  categorie: Categories;
  prix_vente_XOF: number;
  seuil_alerte_stock: number;
  actif: boolean;
  date_creation: string;
}
```

### Supplier
```typescript
interface Supplier {
  _id: string;
  type: 'fournisseur';
  nom: string;
  contact_principal?: string;
  telephone: string;
  email?: string;
  adresse?: string;
  actif: boolean;
  date_creation: string;
}
```

### Movement
```typescript
interface Movement {
  _id: string;
  type: 'mouvement';
  type_mouvement: 'ENTREE' | 'SORTIE';
  date: string;
  id_produit: string;
  quantite: number;
  prix_unitaire_XOF: number;
  id_fournisseur?: string;
  note?: string;
  synchronise: boolean;
}
```

## Routage

```typescript
// client/App.tsx
<Routes>
  <Route path="/" element={<Index />} />                    // Dashboard
  <Route path="/vendre" element={<Vendre />} />             // Sales
  <Route path="/approvisionnement" element={<Approvisionnement />} />  // Replenishment
  <Route path="/commandes" element={<Commandes />} />       // Orders
  <Route path="/produits" element={<Produits />} />         // Products
  <Route path="/fournisseurs" element={<Fournisseurs />} /> // Suppliers
  <Route path="/rapports" element={<Rapports />} />         // Reports
  <Route path="/parametres" element={<Parametres />} />     // Settings
  <Route path="*" element={<NotFound />} />                 // 404
</Routes>
```

## Gestion d'État

### État Global (Context)
```
App
├── StockProvider
│   ├── products: Product[]
│   ├── suppliers: Supplier[]
│   ├── movements: Movement[]
│   └── isOnline: boolean
└── useStock() hook
```

### État Local (Composants)
- Formulaires (searchTerm, selectedCategory)
- Modals (isFormOpen)
- Paniers (orderItems)

## Performance

### Code Splitting
- Vite lazy loading des routes
- Tree-shaking automatique

### Caching
- Service Worker pour assets
- localStorage pour données
- useMemo pour calculs coûteux

### Bundle Size
```
main.js: ~250KB
css: ~50KB
Total: < 5MB (gzipped)
```

## Sécurité

### Frontend
- ✅ Validation des données
- ✅ Pas de secrets en code source
- ✅ HTTPS obligatoire

### Backend (Futur)
- [ ] Authentification JWT
- [ ] Chiffrement des données
- [ ] Rate limiting
- [ ] CORS configuré

## Internationalisation (i18n)

**MVP**: Français uniquement

**Structure prévue (v2)**:
```
locales/
├── fr.json
├── wo.json
└── en.json
```

## Tester

```bash
# Unit tests
pnpm test

# E2E tests (futur)
pnpm test:e2e
```

## Déploiement

### Options Supportées
1. **Netlify** (Recommandé)
   - Build: `pnpm build`
   - Publish: `dist`

2. **Vercel**
   - Configuration automatique
   - Edge functions optionnelles

3. **Auto-hébergé**
   - Node.js + Express
   - Nginx reverse proxy

## Monitoring (Futur)

- [ ] Sentry pour erreurs
- [ ] Analytics (Plausible)
- [ ] Performance metrics
- [ ] User feedback

## Améliorations Futures

### Phase 2 (v1.5)
- [ ] Export PDF des rapports
- [ ] Codes-barres/QR codes
- [ ] Notifications push
- [ ] Chiffrement des données

### Phase 3 (v2)
- [ ] Backend CouchDB
- [ ] Authentification utilisateur
- [ ] Multi-utilisateurs
- [ ] Paiements mobiles
- [ ] App native mobile

## Conventions de Code

### Naming
- Composants: PascalCase (`ProductCard.tsx`)
- Fichiers: kebab-case ou PascalCase selon type
- Variables: camelCase
- Constants: UPPER_SNAKE_CASE

### Structure
```typescript
// Imports
import React, { useState } from 'react';

// Types
interface Props { ... }

// Component
export default function Component(props: Props) {
  // Hooks
  const [state, setState] = useState();
  
  // Handlers
  const handleClick = () => {};
  
  // Render
  return <div>...</div>;
}
```

### CSS
- Tailwind classes pour styling
- Custom CSS seulement si nécessaire
- Utiliser `cn()` pour classes conditionnelles

## Ressources

- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Vite](https://vitejs.dev)
- [TypeScript](https://www.typescriptlang.org)
