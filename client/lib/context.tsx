import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Product, Supplier, Movement } from '@shared/api';
import { loadData, saveData, calculateProductStock, generateId } from './db';

interface StockContextType {
  products: Product[];
  suppliers: Supplier[];
  movements: Movement[];
  isOnline: boolean;
  
  // Product operations
  addProduct: (product: Omit<Product, '_id' | '_rev' | 'type' | 'date_creation'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Supplier operations
  addSupplier: (supplier: Omit<Supplier, '_id' | '_rev' | 'type' | 'date_creation'>) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  
  // Movement operations
  addMovement: (movement: Omit<Movement, '_id' | '_rev' | 'type'>) => void;
  
  // Utility
  getProductStock: (productId: string) => number;
  getLowStockProducts: () => (Product & { stock: number })[];
}

const StockContext = createContext<StockContextType | undefined>(undefined);

export const StockProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const initialData = loadData();
  const [products, setProducts] = useState<Product[]>(initialData.products);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialData.suppliers);
  const [movements, setMovements] = useState<Movement[]>(initialData.movements);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const addProduct = useCallback((product: Omit<Product, '_id' | '_rev' | 'type' | 'date_creation'>) => {
    const newProduct: Product = {
      ...product,
      _id: generateId('produit'),
      type: 'produit',
      date_creation: new Date().toISOString()
    };
    const updated = [...products, newProduct];
    setProducts(updated);
    saveData({ products: updated, suppliers, movements });
  }, [products, suppliers, movements]);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    const updated = products.map(p => p._id === id ? { ...p, ...updates } : p);
    setProducts(updated);
    saveData({ products: updated, suppliers, movements });
  }, [products, suppliers, movements]);

  const deleteProduct = useCallback((id: string) => {
    const updated = products.filter(p => p._id !== id);
    setProducts(updated);
    saveData({ products: updated, suppliers, movements });
  }, [products, suppliers, movements]);

  const addSupplier = useCallback((supplier: Omit<Supplier, '_id' | '_rev' | 'type' | 'date_creation'>) => {
    const newSupplier: Supplier = {
      ...supplier,
      _id: generateId('fournisseur'),
      type: 'fournisseur',
      date_creation: new Date().toISOString()
    };
    const updated = [...suppliers, newSupplier];
    setSuppliers(updated);
    saveData({ products, suppliers: updated, movements });
  }, [products, suppliers, movements]);

  const updateSupplier = useCallback((id: string, updates: Partial<Supplier>) => {
    const updated = suppliers.map(s => s._id === id ? { ...s, ...updates } : s);
    setSuppliers(updated);
    saveData({ products, suppliers: updated, movements });
  }, [products, suppliers, movements]);

  const deleteSupplier = useCallback((id: string) => {
    const updated = suppliers.filter(s => s._id !== id);
    setSuppliers(updated);
    saveData({ products, suppliers: updated, movements });
  }, [products, suppliers, movements]);

  const addMovement = useCallback((movement: Omit<Movement, '_id' | '_rev' | 'type'>) => {
    const newMovement: Movement = {
      ...movement,
      _id: generateId('mouvement'),
      type: 'mouvement'
    };
    const updated = [...movements, newMovement];
    setMovements(updated);
    saveData({ products, suppliers, movements: updated });
  }, [products, suppliers, movements]);

  const getProductStock = useCallback((productId: string): number => {
    return calculateProductStock(productId, movements);
  }, [movements]);

  const getLowStockProducts = useCallback((): (Product & { stock: number })[] => {
    return products
      .map(p => ({
        ...p,
        stock: getProductStock(p._id)
      }))
      .filter(p => p.stock < p.seuil_alerte_stock && p.actif)
      .sort((a, b) => a.stock - b.stock);
  }, [products, getProductStock]);

  return (
    <StockContext.Provider
      value={{
        products,
        suppliers,
        movements,
        isOnline,
        addProduct,
        updateProduct,
        deleteProduct,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        addMovement,
        getProductStock,
        getLowStockProducts
      }}
    >
      {children}
    </StockContext.Provider>
  );
};

export const useStock = () => {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error('useStock must be used within StockProvider');
  }
  return context;
};
