import React, { useState, useMemo } from 'react';
import { useStock } from '@/lib/context';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Minus, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/PageHeader';

interface CartItem {
  productId: string;
  quantity: number;
}

const CATEGORIES = [
  'Électronique',
  'Papeterie',
  'Cosmétiques',
  'Chaussures',
  'Fournitures',
  'Services',
];

export default function Vendre() {
  const { products, addMovement, getProductStock } = useStock();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);

  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.nom.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === '' || p.categorie === selectedCategory) &&
        p.actif &&
        getProductStock(p._id) > 0
    );
  }, [searchTerm, selectedCategory, products, getProductStock]);

  const addToCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => {
    const product = products.find((p) => p._id === item.productId);
    return sum + (product?.prix_vente_XOF || 0) * item.quantity;
  }, 0);

  const handleValidate = () => {
    if (cart.length === 0) {
      toast.error('Le panier est vide');
      return;
    }

    cart.forEach((item) => {
      const product = products.find((p) => p._id === item.productId);
      if (product) {
        addMovement({
          type_mouvement: 'SORTIE',
          date: new Date().toISOString(),
          id_produit: product._id,
          quantite: item.quantity,
          prix_unitaire_XOF: product.prix_vente_XOF,
          note: 'Vente au comptoir',
          synchronise: false,
        });
      }
    });

    toast.success(`Vente enregistrée: ${cart.length} produit(s)`);
    setCart([]);
    setTimeout(() => navigate('/'), 1000);
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Enregistrer une Vente"
        description="Sélectionnez les produits à vendre et validez la transaction"
        breadcrumbs={[
          { label: 'Accueil', path: '/' },
          { label: 'Vendre' },
        ]}
      />

      <div className="max-w-7xl mx-auto w-full p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Search and Filter */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  selectedCategory === ''
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tous
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    selectedCategory === cat
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Aucun produit trouvé
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <button
                    key={product._id}
                    onClick={() => addToCart(product._id)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-4 text-left hover:border-green-500 hover:bg-green-50 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {product.nom}
                        </h3>
                        <p className="text-sm text-gray-600">{product.categorie}</p>
                        <p className="text-sm text-gray-600">
                          Stock: {getProductStock(product._id)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          {product.prix_vente_XOF.toLocaleString()} XOF
                        </p>
                        <button className="mt-2 bg-green-600 text-white px-4 py-1 rounded text-sm font-medium hover:bg-green-700">
                          Ajouter
                        </button>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Cart */}
          <div className="bg-gray-50 rounded-lg p-4 h-fit sticky top-40">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Panier</h2>

            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Panier vide</p>
            ) : (
              <>
                <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                  {cart.map((item) => {
                    const product = products.find(
                      (p) => p._id === item.productId
                    );
                    if (!product) return null;

                    const subtotal = product.prix_vente_XOF * item.quantity;

                    return (
                      <div
                        key={item.productId}
                        className="bg-white p-3 rounded border border-gray-200"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm">
                              {product.nom}
                            </h4>
                            <p className="text-xs text-gray-600">
                              {product.prix_vente_XOF.toLocaleString()} XOF
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity - 1
                                )
                              }
                              className="bg-gray-200 text-gray-700 p-1 rounded hover:bg-gray-300"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="font-bold w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity + 1
                                )
                              }
                              className="bg-gray-200 text-gray-700 p-1 rounded hover:bg-gray-300"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <div className="text-sm font-semibold text-gray-900">
                            {subtotal.toLocaleString()} XOF
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t pt-4 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-gray-900">TOTAL:</span>
                    <span className="text-2xl font-bold text-green-600">
                      {cartTotal.toLocaleString()} XOF
                    </span>
                  </div>

                  <button
                    onClick={handleValidate}
                    className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition"
                  >
                    VALIDER LA VENTE
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
