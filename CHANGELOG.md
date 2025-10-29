# Changelog

Tous les changements importants du projet sont documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/),
et ce projet suit [Semantic Versioning](https://semver.org/).

## [1.0.0] - 2025-10-27

### ✨ Ajouté

#### Tableau de Bord
- ✅ Vue d'ensemble des stocks
- ✅ Alertes de stock bas en temps r��el
- ✅ Actions rapides (Vendre, Ajouter Stock, Gérer Articles)
- ✅ Résumé des stocks par produit

#### Gestion des Ventes
- ✅ Enregistrement rapide des ventes
- ✅ Recherche de produits en temps réel
- ✅ Filtre par catégorie
- ✅ Panier avec gestion des quantités
- ✅ Calcul automatique du total

#### Approvisionnement
- ✅ Sélection des fournisseurs
- ✅ Recherche de produits
- ✅ Entrée de quantité et prix d'achat
- ✅ Notes optionnelles
- ✅ Enregistrement automatique

#### Commandes WhatsApp
- ✅ Préparation multi-produits
- ✅ Filtre par catégorie
- ✅ Aperçu du message WhatsApp
- ✅ Envoi direct via WhatsApp Web/App
- ✅ Formatage automatique des messages

#### Gestion des Produits
- ✅ CRUD complet (Créer, Lire, Mettre à jour, Supprimer)
- ✅ Tableau avec recherche et filtrage
- ✅ Catégories (6 types)
- ✅ Affichage du stock et seuil d'alerte
- ✅ Modal d'édition
- ✅ Filtre par catégorie (boutons)

#### Gestion des Fournisseurs
- ✅ Liste des fournisseurs
- ✅ Recherche
- ✅ Ajout/modification/suppression
- ✅ Contacts avec lien WhatsApp
- ✅ Informations complètes (téléphone, email, adresse)

#### Rapports & Statistiques
- ✅ 6 périodes (quotidien, hebdomadaire, mensuel, trimestriel, semestriel, annuel)
- ✅ Graphiques (ligne, barre, pie)
- ✅ Filtrage par produit/catégorie/date
- ✅ Statistiques complètes (ventes, profit, quantités)
- ✅ Top 5 produits
- ✅ Distribution par catégorie
- ✅ Export CSV

#### Paramètres
- ✅ Infos de l'application
- ✅ Export/Import JSON des données
- ✅ Effacement complet des données
- ✅ Statut du mode hors ligne
- ✅ À propos

#### Navigation
- ✅ Header sticky avec logo et statut
- ✅ Navigation horizontale (desktop)
- ✅ Menu hamburger (mobile)
- ✅ Bottom navigation (mobile)
- ✅ 8 pages avec breadcrumbs

#### Mode Hors Ligne
- ✅ Stockage des données en localStorage
- ✅ Fonctionnement complet sans Internet
- ✅ Indicateur en ligne/hors ligne
- ✅ File d'attente de synchronisation

#### UI/UX
- ✅ Design responsive (mobile, tablette, desktop)
- ✅ Tailwind CSS 3 avec couleurs personnalisées
- ✅ Composants shadcn/ui
- ✅ Icônes Lucide React
- ✅ Notifications Sonner
- ✅ Formulaires modernes avec validation
- ✅ Animations fluides

#### Accessibilité
- ✅ Conformité WCAG 2.1 Level AA
- ✅ Ratio de contraste >= 4.5:1
- ✅ Tailles de police >= 14px
- ✅ Boutons >= 44px
- ✅ Navigation au clavier

#### Internationalisation
- ✅ Interface entièrement en Français
- ✅ Devise Franc CFA (XOF)

### 🔧 Technique

#### Stack Technologique
- React 18+
- TypeScript
- Tailwind CSS 3
- shadcn/ui
- Vite
- Vitest
- Recharts
- Lucide Icons
- Sonner Notifications

#### Architecture
- React Context API pour l'état global
- Composants réutilisables
- Séparation concerns (pages, composants, lib)
- Path aliases (@/ et @shared/)

#### Performance
- Bundle size < 5MB (compressé)
- Temps de chargement < 2s
- Temps de réponse < 500ms
- Optimisations Vite/SWC

### 📚 Documentation

- ✅ README.md complet
- ✅ ARCHITECTURE.md détaillé
- ✅ SETUP.md avec instructions
- ✅ CONTRIBUTING.md pour contributions
- ✅ API.md avec tous les hooks
- ✅ LICENSE (MIT)

### 🐛 Correctifs

N/A pour v1.0

### ⚠️ Breaking Changes

N/A pour v1.0

## [1.1.0] - À venir

### Planifié

- [ ] Export PDF des rapports
- [ ] Codes-barres/QR codes
- [ ] Notifications push
- [ ] Améliorations performance
- [ ] Bug fixes utilisateurs

## [2.0.0] - Roadmap Future

### Planifié

- [ ] Backend Express/CouchDB
- [ ] Authentification JWT
- [ ] Multi-utilisateurs
- [ ] Paiements mobiles (Orange Money, Wave)
- [ ] Support Wolof
- [ ] App mobile native
- [ ] Synchronisation serveur
- [ ] Analytics avancées

---

## Guide de Versioning

Ce projet suit [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0): Changements incompatibles
- **MINOR** (1.1.0): Nouvelles features compatibles
- **PATCH** (1.0.1): Correctifs de bugs

### Format des Commits

Ce projet suit [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: nouvelle fonctionnalité
fix: correction de bug
docs: changements documentation
style: changements style (non-fonctionnels)
refactor: refactorisation de code
perf: amélioration performance
test: ajout/modification tests
```

### Exemple

```
feat(rapports): ajouter export PDF

- Ajout du bouton export PDF
- Intégration de la librairie pdfkit
- Formatage du rapport pour PDF

Fixes #123
```

## Notes de Release

### v1.0.0

Cette version 1.0.0 est le MVP (Minimum Viable Product) complet avec:
- Toutes les fonctionnalités essentielles pour la gestion de stocks
- Interface responsive et intuitive
- Mode hors ligne pour reliabilité
- Documentation complète

Prête pour production et deployment!

---

## Contribution

Pour contribuer:
1. Créer une branche: `git checkout -b feature/nom`
2. Commiter avec le format: `git commit -m "feat: description"`
3. Pusher et créer une PR

Voir [CONTRIBUTING.md](./CONTRIBUTING.md) pour les détails.
