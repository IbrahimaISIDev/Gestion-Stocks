import { Product, Supplier, Movement } from '@shared/api';

// Simple in-memory storage for MVP (can be upgraded to PouchDB/IndexedDB later)
const STORAGE_KEY = 'stock_app_data';

interface StorageData {
  products: Product[];
  suppliers: Supplier[];
  movements: Movement[];
}

function getDefaultData(): StorageData {
  return {
    products: [
      {
        _id: 'produit_001',
        type: 'produit',
        nom: 'Chargeur USB-C 65W',
        description: 'Compatible avec ordinateurs et téléphones',
        categorie: 'Électronique',
        prix_vente_XOF: 15000,
        seuil_alerte_stock: 5,
        actif: true,
        date_creation: '2025-10-27T10:30:00Z'
      },
      {
        _id: 'produit_002',
        type: 'produit',
        nom: 'Savon Artisanal',
        description: 'Savon naturel fait à la main',
        categorie: 'Cosmétiques',
        prix_vente_XOF: 2500,
        seuil_alerte_stock: 10,
        actif: true,
        date_creation: '2025-10-27T10:30:00Z'
      },
      {
        _id: 'produit_003',
        type: 'produit',
        nom: 'Cahier A4 100 pages',
        description: 'Cahier scolaire de qualité',
        categorie: 'Papeterie',
        prix_vente_XOF: 3000,
        seuil_alerte_stock: 5,
        actif: true,
        date_creation: '2025-10-27T10:30:00Z'
      },
      {
        _id: 'produit_004',
        type: 'produit',
        nom: 'Sandales Confort',
        description: 'Sandales confortables pour tous',
        categorie: 'Chaussures',
        prix_vente_XOF: 12000,
        seuil_alerte_stock: 3,
        actif: true,
        date_creation: '2025-10-27T10:30:00Z'
      },
      {
        _id: 'produit_005',
        type: 'produit',
        nom: 'Stylo Bleu',
        description: 'Stylo bille de qualité',
        categorie: 'Papeterie',
        prix_vente_XOF: 500,
        seuil_alerte_stock: 20,
        actif: true,
        date_creation: '2025-10-27T10:30:00Z'
      }
    ],
    suppliers: [
      {
        _id: 'fournisseur_001',
        type: 'fournisseur',
        nom: 'Dakar Tech Import',
        contact_principal: 'Mamadou Diop',
        telephone: '+221 77 123 45 67',
        email: 'contact@dakartech.sn',
        adresse: 'Marché Kermel, Stand 12, Dakar',
        actif: true,
        date_creation: '2025-10-27T10:30:00Z'
      },
      {
        _id: 'fournisseur_002',
        type: 'fournisseur',
        nom: 'Dakar Cosmétiques',
        contact_principal: 'Fatou Sall',
        telephone: '+221 78 987 65 43',
        email: 'contact@dakarcos.sn',
        adresse: 'Rue 15, Plateau, Dakar',
        actif: true,
        date_creation: '2025-10-27T10:30:00Z'
      }
    ],
    movements: [
      {
        _id: 'mouvement_20251027_001',
        type: 'mouvement',
        type_mouvement: 'ENTREE',
        date: '2025-10-27T10:00:00Z',
        id_produit: 'produit_001',
        quantite: 10,
        prix_unitaire_XOF: 12000,
        id_fournisseur: 'fournisseur_001',
        note: 'Livraison initiale',
        synchronise: false
      },
      {
        _id: 'mouvement_20251027_002',
        type: 'mouvement',
        type_mouvement: 'ENTREE',
        date: '2025-10-27T10:05:00Z',
        id_produit: 'produit_002',
        quantite: 20,
        prix_unitaire_XOF: 1500,
        id_fournisseur: 'fournisseur_002',
        note: 'Livraison initiale',
        synchronise: false
      },
      {
        _id: 'mouvement_20251027_003',
        type: 'mouvement',
        type_mouvement: 'ENTREE',
        date: '2025-10-27T10:10:00Z',
        id_produit: 'produit_003',
        quantite: 50,
        prix_unitaire_XOF: 2000,
        id_fournisseur: 'fournisseur_001',
        note: 'Livraison initiale',
        synchronise: false
      },
      {
        _id: 'mouvement_20251027_004',
        type: 'mouvement',
        type_mouvement: 'ENTREE',
        date: '2025-10-27T10:15:00Z',
        id_produit: 'produit_004',
        quantite: 5,
        prix_unitaire_XOF: 8000,
        id_fournisseur: 'fournisseur_001',
        note: 'Livraison initiale',
        synchronise: false
      },
      {
        _id: 'mouvement_20251027_005',
        type: 'mouvement',
        type_mouvement: 'SORTIE',
        date: '2025-10-27T11:00:00Z',
        id_produit: 'produit_001',
        quantite: 7,
        prix_unitaire_XOF: 15000,
        note: 'Ventes comptoir',
        synchronise: false
      },
      {
        _id: 'mouvement_20251027_006',
        type: 'mouvement',
        type_mouvement: 'SORTIE',
        date: '2025-10-27T11:30:00Z',
        id_produit: 'produit_002',
        quantite: 18,
        prix_unitaire_XOF: 2500,
        note: 'Ventes comptoir',
        synchronise: false
      },
      {
        _id: 'mouvement_20251027_007',
        type: 'mouvement',
        type_mouvement: 'SORTIE',
        date: '2025-10-27T12:00:00Z',
        id_produit: 'produit_003',
        quantite: 35,
        prix_unitaire_XOF: 3000,
        note: 'Ventes comptoir',
        synchronise: false
      },
      {
        _id: 'mouvement_20251027_008',
        type: 'mouvement',
        type_mouvement: 'SORTIE',
        date: '2025-10-27T12:30:00Z',
        id_produit: 'produit_004',
        quantite: 4,
        prix_unitaire_XOF: 12000,
        note: 'Ventes comptoir',
        synchronise: false
      }
    ]
  };
}

export function loadData(): StorageData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
  }
  const defaultData = getDefaultData();
  saveData(defaultData);
  return defaultData;
}

export function saveData(data: StorageData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
}

export function calculateProductStock(productId: string, movements: Movement[]): number {
  const relevant = movements.filter(m => m.id_produit === productId);
  const entries = relevant.filter(m => m.type_mouvement === 'ENTREE').reduce((sum, m) => sum + m.quantite, 0);
  const exits = relevant.filter(m => m.type_mouvement === 'SORTIE').reduce((sum, m) => sum + m.quantite, 0);
  return entries - exits;
}

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
