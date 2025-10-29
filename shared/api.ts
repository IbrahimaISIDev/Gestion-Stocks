/**
 * Stock Management Application - Shared Types
 */

export interface Product {
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

export interface Supplier {
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

export interface Movement {
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

export interface DemoResponse {
  message: string;
}
