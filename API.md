# 📡 Documentation API

## Vue d'Ensemble

L'application utilise une **architecture client-side** avec stockage local (localStorage/IndexedDB). Le backend Express est optionnel pour le MVP.

## State Management avec Context

### `useStock()` Hook

Fournit accès à tout l'état de l'application.

```typescript
import { useStock } from '@/lib/context';

export default function MyComponent() {
  const {
    products,
    suppliers,
    movements,
    isOnline,
    addProduct,
    getProductStock,
    // ... autres methods
  } = useStock();
  
  return <div>...</div>;
}
```

## API des Produits

### Types

```typescript
interface Product {
  _id: string;
  _rev?: string;
  type: 'produit';
  nom: string;
  description?: string;
  categorie: 'Électronique' | 'Papeterie' | 'Cosmétiques' | 'Chaussures' | 'Fournitures' | 'Services';
  prix_vente_XOF: number;
  seuil_alerte_stock: number;
  actif: boolean;
  date_creation: string;
}
```

### Lecture

#### `products`
Liste de tous les produits.

```typescript
const { products } = useStock();
console.log(products); // Product[]
```

#### `getProductStock(productId: string): number`
Récupère le stock actuel d'un produit.

```typescript
const { getProductStock } = useStock();
const stock = getProductStock('produit_001');
console.log(stock); // 5
```

#### `getLowStockProducts(): (Product & { stock: number })[]`
Retourne les produits en stock bas.

```typescript
const { getLowStockProducts } = useStock();
const lowStockItems = getLowStockProducts();
lowStockItems.forEach(p => {
  console.log(`${p.nom}: ${p.stock}/${p.seuil_alerte_stock}`);
});
```

### Écriture

#### `addProduct(product: Omit<Product, '_id' | '_rev' | 'type' | 'date_creation'>)`
Crée un nouveau produit.

```typescript
const { addProduct } = useStock();

addProduct({
  nom: 'Nouveau Produit',
  description: 'Description',
  categorie: 'Électronique',
  prix_vente_XOF: 15000,
  seuil_alerte_stock: 5,
  actif: true
});
```

#### `updateProduct(id: string, updates: Partial<Product>)`
Met à jour un produit existant.

```typescript
const { updateProduct } = useStock();

updateProduct('produit_001', {
  nom: 'Nom modifié',
  prix_vente_XOF: 20000
});
```

#### `deleteProduct(id: string)`
Supprime un produit.

```typescript
const { deleteProduct } = useStock();
deleteProduct('produit_001');
```

## API des Fournisseurs

### Types

```typescript
interface Supplier {
  _id: string;
  _rev?: string;
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

### Lecture

#### `suppliers`
Liste de tous les fournisseurs.

```typescript
const { suppliers } = useStock();
```

### Écriture

#### `addSupplier(supplier: Omit<Supplier, '_id' | '_rev' | 'type' | 'date_creation'>)`
Crée un fournisseur.

```typescript
const { addSupplier } = useStock();

addSupplier({
  nom: 'Dakar Tech',
  contact_principal: 'Mamadou',
  telephone: '+221 77 123 45 67',
  email: 'contact@dakartech.com',
  adresse: 'Dakar',
  actif: true
});
```

#### `updateSupplier(id: string, updates: Partial<Supplier>)`
Met à jour un fournisseur.

```typescript
const { updateSupplier } = useStock();
updateSupplier('fournisseur_001', {
  telephone: '+221 77 987 65 43'
});
```

#### `deleteSupplier(id: string)`
Supprime un fournisseur.

```typescript
const { deleteSupplier } = useStock();
deleteSupplier('fournisseur_001');
```

## API des Mouvements

### Types

```typescript
interface Movement {
  _id: string;
  _rev?: string;
  type: 'mouvement';
  type_mouvement: 'ENTREE' | 'SORTIE';
  date: string;
  id_produit: string;
  quantite: number;
  prix_unitaire_XOF: number;
  id_fournisseur?: string | null;
  note?: string;
  synchronise: boolean;
}
```

### Lecture

#### `movements`
Liste de tous les mouvements.

```typescript
const { movements } = useStock();
console.log(movements); // Movement[]
```

### Écriture

#### `addMovement(movement: Omit<Movement, '_id' | '_rev' | 'type'>)`
Enregistre un mouvement de stock (vente ou approvisionnement).

```typescript
const { addMovement } = useStock();

// Enregistrer une vente
addMovement({
  type_mouvement: 'SORTIE',
  date: new Date().toISOString(),
  id_produit: 'produit_001',
  quantite: 2,
  prix_unitaire_XOF: 15000,
  note: 'Vente au comptoir',
  synchronise: false
});

// Enregistrer un approvisionnement
addMovement({
  type_mouvement: 'ENTREE',
  date: new Date().toISOString(),
  id_produit: 'produit_002',
  quantite: 10,
  prix_unitaire_XOF: 8000,
  id_fournisseur: 'fournisseur_001',
  note: 'Livraison Dakar Tech',
  synchronise: false
});
```

## API de Base de Données

### `loadData(): StorageData`
Charge les données depuis localStorage.

```typescript
import { loadData } from '@/lib/db';

const data = loadData();
console.log(data.products); // Product[]
console.log(data.suppliers); // Supplier[]
console.log(data.movements); // Movement[]
```

### `saveData(data: StorageData)`
Sauvegarde les données dans localStorage.

```typescript
import { saveData } from '@/lib/db';

saveData({
  products: [],
  suppliers: [],
  movements: []
});
```

### `calculateProductStock(productId: string, movements: Movement[]): number`
Calcule le stock d'un produit.

```typescript
import { calculateProductStock } from '@/lib/db';

const stock = calculateProductStock('produit_001', movements);
```

### `generateId(prefix: string): string`
Génère un ID unique.

```typescript
import { generateId } from '@/lib/db';

const id = generateId('produit'); // produit_1234567890_abc123xyz
```

## API des Rapports

### Types

```typescript
type PeriodType = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'semiannual' | 'annual';

interface ReportSummary {
  totalRevenue: number;
  totalQuantity: number;
  totalProfit: number;
  totalTransactions: number;
  topProducts: ProductStats[];
  categoryStats: CategoryStats[];
  chartData: ReportData[];
}
```

### `generateReport(movements: Movement[], products: Product[], periodType: PeriodType): ReportSummary`
Génère un rapport complet.

```typescript
import { generateReport } from '@/lib/reports';

const report = generateReport(movements, products, 'monthly');
console.log(report.totalRevenue); // Total XOF
console.log(report.topProducts); // Top 5
console.log(report.chartData); // Données pour graphiques
```

### `filterMovementsByDateRange(movements: Movement[], startDate: Date, endDate: Date): Movement[]`
Filtre les mouvements par date.

```typescript
import { filterMovementsByDateRange } from '@/lib/reports';

const start = new Date('2025-01-01');
const end = new Date('2025-12-31');
const filtered = filterMovementsByDateRange(movements, start, end);
```

### `filterMovementsByProduct(movements: Movement[], productId: string): Movement[]`
Filtre les mouvements pour un produit.

```typescript
import { filterMovementsByProduct } from '@/lib/reports';

const productMovements = filterMovementsByProduct(movements, 'produit_001');
```

### `filterMovementsByCategory(movements: Movement[], products: Product[], category: string): Movement[]`
Filtre les mouvements pour une catégorie.

```typescript
import { filterMovementsByCategory } from '@/lib/reports';

const elecMovements = filterMovementsByCategory(movements, products, 'Électronique');
```

## API WhatsApp

### Types

```typescript
interface OrderItem {
  productId: string;
  quantity: number;
}

interface Order {
  _id: string;
  supplierId: string;
  items: OrderItem[];
  date: string;
  status: 'draft' | 'sent' | 'archived';
}
```

### `generateOrderMessage(supplier: Supplier, items: OrderItem[], products: Product[], note?: string): string`
Génère le message WhatsApp formaté.

```typescript
import { generateOrderMessage } from '@/lib/whatsapp';

const message = generateOrderMessage(
  supplier,
  [{ productId: 'prod_001', quantity: 10 }],
  products,
  'Livraison urgente'
);
console.log(message); // Message formaté
```

### `generateWhatsAppLink(phoneNumber: string, message: string): string`
Génère le lien wa.me.

```typescript
import { generateWhatsAppLink } from '@/lib/whatsapp';

const link = generateWhatsAppLink('+221771234567', 'Bonjour...');
// https://wa.me/221771234567?text=Bonjour...
```

### `sendOrderViaWhatsApp(supplier: Supplier, items: OrderItem[], products: Product[], note?: string)`
Ouvre WhatsApp pour envoyer la commande.

```typescript
import { sendOrderViaWhatsApp } from '@/lib/whatsapp';

sendOrderViaWhatsApp(supplier, items, products, note);
// Ouvre WhatsApp Web/App
```

## Événements Online/Offline

### `isOnline`
Booléen indiquant la connexion.

```typescript
const { isOnline } = useStock();

if (!isOnline) {
  console.log('Mode hors ligne');
}
```

### Événements Natifs

```typescript
// Écouter les changements de connexion
window.addEventListener('online', () => {
  console.log('Connexion rétablie');
});

window.addEventListener('offline', () => {
  console.log('Hors ligne');
});
```

## Exemples Complets

### Créer un Produit et Enregistrer une Vente

```typescript
import { useStock } from '@/lib/context';

export default function CheckoutPage() {
  const { products, addProduct, addMovement } = useStock();

  const handleCheckout = () => {
    // Créer un produit
    addProduct({
      nom: 'iPhone 15',
      categorie: 'Électronique',
      prix_vente_XOF: 450000,
      seuil_alerte_stock: 5,
      actif: true
    });

    // Enregistrer une vente
    addMovement({
      type_mouvement: 'SORTIE',
      date: new Date().toISOString(),
      id_produit: products[0]._id,
      quantite: 1,
      prix_unitaire_XOF: 450000,
      synchronise: false
    });
  };

  return <button onClick={handleCheckout}>Acheter</button>;
}
```

### Générer et Exporter un Rapport

```typescript
import { generateReport } from '@/lib/reports';
import { useStock } from '@/lib/context';

export default function ReportsPage() {
  const { movements, products } = useStock();

  const handleExport = () => {
    const report = generateReport(movements, products, 'monthly');
    
    const csv = report.chartData
      .map(d => `${d.period},${d.sales},${d.quantity},${d.profit}`)
      .join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rapport.csv';
    a.click();
  };

  return <button onClick={handleExport}>Exporter</button>;
}
```

## Mode Hors Ligne

Les données sont automatiquement persistées:

```typescript
// Les changements sont sauvegardés dans localStorage
addMovement({...}); // Sauvé automatiquement

// Accéder aux données hors ligne
const data = loadData(); // Depuis localStorage
```

## Limitations du MVP

- ❌ Pas de backend API
- ❌ Pas d'authentification
- ❌ Pas de synchronisation serveur
- ❌ Pas de chiffrement
- ❌ Pas de multi-utilisateurs

## Futur (v2)

- ✅ Backend Express/CouchDB
- ✅ API REST complète
- �� Authentification JWT
- ✅ Synchronisation bidirectionnelle
- ✅ Support multi-utilisateurs

## Support

Pour les questions sur l'API:
- Consulter [ARCHITECTURE.md](./ARCHITECTURE.md)
- Ouvrir une issue
- Lire le code source
