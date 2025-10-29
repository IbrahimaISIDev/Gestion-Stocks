# 📦 Application de Gestion de Stocks (MVP)

Une Progressive Web App (PWA) moderne et intuitive pour digitaliser la gestion des stocks dans les multi-services sénégalais.

## 🎯 Caractéristiques Principales

### ✅ Fonctionnalités MVP

- **📊 Tableau de Bord** - Vue d'ensemble des stocks avec alertes temps réel
- **💳 Gestion des Ventes** - Enregistrement rapide des ventes avec panier
- **📦 Approvisionnement** - Suivi des entrées de stock avec fournisseurs
- **🛒 Commandes WhatsApp** - Préparez et envoyez les commandes directement via WhatsApp
- **📋 Gestion des Produits** - CRUD complet avec catégories et filtres
- **👥 Gestion des Fournisseurs** - Carnet de contacts des fournisseurs
- **📈 Rapports & Statistiques** - Analyses complètes (quotidien à annuel)
- **🔊 Notifications** - Alertes de stock bas en temps réel
- **📱 Mode Hors Ligne** - Fonctionnement sans connexion Internet
- **🎨 Design Responsive** - Mobile, tablette, desktop

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+
- pnpm (package manager)
- Navigateur moderne (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Cloner le repository
git clone https://github.com/[username]/gestion-stocks.git
cd gestion-stocks

# Installer les dépendances
pnpm install

# Démarrer le serveur de développement
pnpm dev
```

L'application sera disponible à `http://localhost:5173`

### Build Production

```bash
# Build l'application
pnpm build

# Démarrer le serveur production
pnpm start
```

## 📁 Structure du Projet

```
├── client/                          # Frontend React SPA
│   ├── components/
│   │   ├── Layout.tsx              # Layout principal avec navigation
│   │   ├── PageHeader.tsx          # Header des pages
│   │   └── ui/                     # Composants shadcn/ui
│   ├── pages/
│   │   ├── Index.tsx               # Tableau de bord
│   │   ├── Vendre.tsx              # Page de vente
│   │   ├── Approvisionnement.tsx   # Page d'approvisionnement
│   │   ├── Commandes.tsx           # Commandes WhatsApp
│   │   ├── Produits.tsx            # Gestion des produits
│   │   ├── Fournisseurs.tsx        # Gestion des fournisseurs
│   │   ├── Rapports.tsx            # Rapports et statistiques
│   │   └── Parametres.tsx          # Paramètres
│   ├── lib/
│   │   ├── context.tsx             # React Context pour l'état global
│   │   ├── db.ts                   # Utilitaires de base de données
│   │   ├── reports.ts              # Génération des rapports
│   │   └── whatsapp.ts             # Intégration WhatsApp
│   ├── hooks/
│   │   └── use-*.tsx               # Hooks réutilisables
│   ├── App.tsx                     # Routing principal
│   └── global.css                  # Styles globaux
├── server/                          # Backend Express (optionnel)
│   ├── index.ts                    # Serveur principal
│   └── routes/                     # Routes API
├── shared/                          # Code partagé client/serveur
│   └── api.ts                      # Types et interfaces
└── package.json
```

## 🛠 Stack Technologique

| Domaine | Technologie | Version |
|---------|-------------|---------|
| **Frontend** | React | 18+ |
| **Styling** | Tailwind CSS | 3+ |
| **UI Components** | shadcn/ui | Latest |
| **Routing** | React Router | 6+ |
| **State** | React Context API | Native |
| **Base de données** | localStorage/IndexedDB | Native |
| **Build Tool** | Vite | 7+ |
| **Testing** | Vitest | 3+ |
| **Charts** | Recharts | 2+ |
| **Notifications** | Sonner | 1+ |
| **Icons** | Lucide React | Latest |

## 📱 Pages et Fonctionnalités

### 1. Tableau de Bord (/)
- Affichage des alertes de stock bas
- Actions rapides (Vendre, Ajouter Stock, Gérer Articles)
- Résumé des stocks par produit
- Indicateur en ligne/hors ligne

### 2. Enregistrer une Vente (/vendre)
- Recherche de produits
- Filtre par catégorie
- Panier avec gestion des quantités
- Calcul automatique du total
- Enregistrement des mouvements

### 3. Approvisionnement (/approvisionnement)
- Sélection du fournisseur
- Recherche de produits
- Entrée de quantité et prix d'achat
- Note optionnelle
- Enregistrement automatique

### 4. Commandes WhatsApp (/commandes)
- Sélection multi-produits
- Filtre par catégorie
- Note sur la commande
- Aperçu du message WhatsApp
- Envoi direct via WhatsApp Web/App

### 5. Gestion des Produits (/produits)
- Tableau complet des produits
- Recherche et filtrage par catégorie
- Ajout/modification/suppression
- Affichage du stock et seuil d'alerte
- Modal d'édition

### 6. Gestion des Fournisseurs (/fournisseurs)
- Liste des fournisseurs
- Recherche
- Ajout/modification/suppression
- Contacts avec lien WhatsApp

### 7. Rapports (/rapports)
- 6 périodes (quotidien, hebdomadaire, mensuel, trimestriel, semestriel, annuel)
- Graphiques (ligne, barre, pie)
- Filtrage par produit/catégorie
- Statistiques détaillées
- Export CSV

### 8. Paramètres (/parametres)
- Infos de l'application
- Export/Import JSON
- Effacement des données
- Statut du mode hors ligne

## 💾 Modèle de Données

### Produits
```typescript
{
  _id: string;
  nom: string;
  description?: string;
  categorie: 'Électronique' | 'Papeterie' | 'Cosmétiques' | 'Chaussures' | 'Fournitures' | 'Services';
  prix_vente_XOF: number;
  seuil_alerte_stock: number;
  actif: boolean;
  date_creation: string;
}
```

### Fournisseurs
```typescript
{
  _id: string;
  nom: string;
  contact_principal?: string;
  telephone: string;
  email?: string;
  adresse?: string;
  actif: boolean;
  date_creation: string;
}
```

### Mouvements
```typescript
{
  _id: string;
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

## 🔄 Flux de Données

1. **Saisie Utilisateur** → Composant React
2. **Mise à Jour d'État** → React Context API
3. **Sauvegarde** → localStorage/IndexedDB
4. **Affichage** → Rendu des composants

## 🌐 Mode Hors Ligne

L'application fonctionne complètement sans Internet:
- Les données sont stockées localement (IndexedDB)
- Service Worker cache les assets
- Les transactions sont mises en file d'attente
- Synchronisation automatique au retour de la connexion

## 🧪 Tests

```bash
# Exécuter les tests
pnpm test

# Tests avec watch mode
pnpm test:watch
```

## 📊 Performance

- **Temps de chargement initial**: < 2 secondes (3G)
- **Taille du bundle**: < 5MB (compressé)
- **Temps de réponse des actions**: < 500ms

## 🎨 Palette de Couleurs

| Couleur | Usage | Hex |
|---------|-------|-----|
| Primaire | Header, boutons | #2563EB |
| Succès | Vendre, stock normal | #16A34A |
| Alerte | Avertissements | #EA580C |
| Danger | Stock bas, erreurs | #DC2626 |
| Neutre | Boutons secondaires | #6B7280 |

## ♿ Accessibilité

- ✅ Conformité WCAG 2.1 Level AA
- ✅ Ratio de contraste >= 4.5:1
- ✅ Tailles de police >= 14px
- ✅ Boutons >= 44px en hauteur
- ✅ Navigation au clavier

## 📝 Contribuer

Voir [CONTRIBUTING.md](./CONTRIBUTING.md) pour les directives de contribution.

## 📄 Licence

MIT - Voir [LICENSE](./LICENSE) pour les détails.

## 🤝 Support

Pour les issues ou questions:
- Ouvrir une issue GitHub
- Contacter: support@example.com
- Documentation complète: [docs/](./docs/)

## 🌍 Internationalisation

- ✅ Français (MVP)
- ⏳ Wolof (v2)
- ⏳ Anglais (v2)

## 🚀 Roadmap v2

- [ ] Authentification utilisateur
- [ ] Codes-barres/QR codes
- [ ] Paiements mobiles (Orange Money, Wave)
- [ ] Support multilingue (Wolof, Anglais)
- [ ] Backend CouchDB avec synchronisation
- [ ] Analytics avancées
- [ ] Export PDF des rapports
- [ ] App mobile native

## 📚 Documentation Additionnelle

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture technique
- [SETUP.md](./SETUP.md) - Configuration détaillée
- [API.md](./API.md) - Documentation des API
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Guide de contribution

---

**Développé avec ❤️ pour les multi-services sénégalais**
# Gestion-Stocks
