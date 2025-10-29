import React, { useState, useMemo } from 'react';
import { useStock } from '@/lib/context';
import { PageHeader } from '@/components/PageHeader';
import {
  sendOrderViaWhatsApp,
  generateOrderMessage,
  OrderItem,
} from '@/lib/whatsapp';
import {
  Plus,
  Minus,
  Trash2,
  Send,
  MessageSquare,
  Search,
  Package,
} from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = [
  'Électronique',
  'Papeterie',
  'Cosmétiques',
  'Chaussures',
  'Fournitures',
  'Services',
];

export default function Commandes() {
  const { products, suppliers } = useStock();

  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderNote, setOrderNote] = useState('');
  const [previewMessage, setPreviewMessage] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.nom.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === '' || p.categorie === selectedCategory) &&
        p.actif
    );
  }, [searchTerm, selectedCategory, products]);

  const selectedSupplier = suppliers.find(
    (s) => s._id === selectedSupplierId && s.actif
  );

  const handleAddProduct = (productId: string) => {
    const existing = orderItems.find((item) => item.productId === productId);
    if (existing) {
      setOrderItems(
        orderItems.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setOrderItems([...orderItems, { productId, quantity: 1 }]);
    }
    setSearchTerm('');
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveProduct(productId);
    } else {
      setOrderItems(
        orderItems.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setOrderItems(orderItems.filter((item) => item.productId !== productId));
  };

  const handlePreview = () => {
    if (!selectedSupplierId) {
      toast.error('Veuillez sélectionner un fournisseur');
      return;
    }
    if (orderItems.length === 0) {
      toast.error('Veuillez ajouter au moins un produit');
      return;
    }

    const preview = generateOrderMessage(
      selectedSupplier!,
      orderItems,
      products,
      orderNote
    );
    setPreviewMessage(preview);
    setShowPreview(true);
  };

  const handleSendViaWhatsApp = () => {
    if (!selectedSupplierId) {
      toast.error('Veuillez sélectionner un fournisseur');
      return;
    }
    if (orderItems.length === 0) {
      toast.error('Veuillez ajouter au moins un produit');
      return;
    }

    sendOrderViaWhatsApp(selectedSupplier!, orderItems, products, orderNote);
    toast.success('Ouverture de WhatsApp...');

    // Clear form after sending
    setTimeout(() => {
      setOrderItems([]);
      setOrderNote('');
      setShowPreview(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Commandes Fournisseurs"
        description="Préparez et envoyez vos commandes via WhatsApp"
        breadcrumbs={[
          { label: 'Accueil', path: '/' },
          { label: 'Commandes' },
        ]}
      />

      <div className="max-w-7xl mx-auto w-full p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Selection */}
          <div className="lg:col-span-2 space-y-4">
            {/* Supplier Selection */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Sélectionner un Fournisseur *
              </label>
              <select
                value={selectedSupplierId}
                onChange={(e) => setSelectedSupplierId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choisir un fournisseur...</option>
                {suppliers.filter((s) => s.actif).map((supplier) => (
                  <option key={supplier._id} value={supplier._id}>
                    {supplier.nom} - {supplier.telephone}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Search */}
            {selectedSupplierId && (
              <div className="space-y-4">
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      selectedCategory === ''
                        ? 'bg-blue-600 text-white'
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
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Product List */}
                <div className="space-y-2">
                  {filteredProducts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Aucun produit trouvé
                    </div>
                  ) : (
                    filteredProducts.map((product) => (
                      <button
                        key={product._id}
                        onClick={() => handleAddProduct(product._id)}
                        className="w-full bg-white border border-gray-200 rounded-lg p-4 text-left hover:border-blue-500 hover:bg-blue-50 transition"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {product.nom}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {product.categorie}
                            </p>
                          </div>
                          <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700">
                            + Ajouter
                          </button>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 h-fit sticky top-40">
            <div className="flex items-center gap-2 mb-4">
              <Package size={20} className="text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">
                Liste de Commande
              </h2>
            </div>

            {!selectedSupplierId ? (
              <p className="text-gray-600 text-center py-8">
                Sélectionnez un fournisseur pour commencer
              </p>
            ) : orderItems.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                Aucun produit sélectionné
              </p>
            ) : (
              <>
                <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                  {orderItems.map((item) => {
                    const product = products.find(
                      (p) => p._id === item.productId
                    );
                    if (!product) return null;

                    return (
                      <div
                        key={item.productId}
                        className="bg-white p-3 rounded border border-gray-200"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900 text-sm">
                            {product.nom}
                          </h4>
                          <button
                            onClick={() => handleRemoveProduct(item.productId)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
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
                              handleUpdateQuantity(
                                item.productId,
                                item.quantity + 1
                              )
                            }
                            className="bg-gray-200 text-gray-700 p-1 rounded hover:bg-gray-300"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Note Field */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Note (Optionnel)
                  </label>
                  <textarea
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    placeholder="Ex: Livraison urgente, produits de qualité..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    rows={3}
                  />
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={handlePreview}
                    className="w-full flex items-center justify-center gap-2 bg-gray-600 text-white font-bold py-2 rounded-lg hover:bg-gray-700 transition text-sm"
                  >
                    <MessageSquare size={16} />
                    Aperçu
                  </button>
                  <button
                    onClick={handleSendViaWhatsApp}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition"
                  >
                    <Send size={20} />
                    Envoyer via WhatsApp
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Message Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-center">
          <div className="bg-white w-full md:max-w-lg rounded-t-2xl md:rounded-lg p-6 space-y-4 max-h-96 overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900">
              Aperçu du Message WhatsApp
            </h2>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 whitespace-pre-wrap text-sm font-mono text-gray-900 max-h-64 overflow-y-auto">
              {previewMessage}
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={() => setShowPreview(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 font-semibold hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSendViaWhatsApp}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
              >
                <Send size={16} />
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
