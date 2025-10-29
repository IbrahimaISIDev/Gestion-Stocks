import React, { useState, useMemo } from 'react';
import { useStock } from '@/lib/context';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/PageHeader';

export default function Approvisionnement() {
  const { products, suppliers, addMovement } = useStock();
  const navigate = useNavigate();
  
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantite, setQuantite] = useState('');
  const [prixAchat, setPrixAchat] = useState('');
  const [note, setNote] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.nom.toLowerCase().includes(searchTerm.toLowerCase()) && p.actif
    );
  }, [searchTerm, products]);

  const selectedProduct = products.find((p) => p._id === selectedProductId);

  const handleSubmit = () => {
    if (!selectedSupplierId) {
      toast.error('Veuillez sélectionner un fournisseur');
      return;
    }
    if (!selectedProductId) {
      toast.error('Veuillez sélectionner un produit');
      return;
    }
    if (!quantite || parseInt(quantite) <= 0) {
      toast.error('Quantité invalide');
      return;
    }
    if (!prixAchat || parseInt(prixAchat) <= 0) {
      toast.error('Prix invalide');
      return;
    }

    addMovement({
      type_mouvement: 'ENTREE',
      date: new Date().toISOString(),
      id_produit: selectedProductId,
      quantite: parseInt(quantite),
      prix_unitaire_XOF: parseInt(prixAchat),
      id_fournisseur: selectedSupplierId,
      note: note || `Livraison de ${parseInt(quantite)} unité(s)`,
      synchronise: false,
    });

    toast.success('Approvisionnement enregistré');
    setQuantite('');
    setPrixAchat('');
    setNote('');
    setSelectedProductId('');
    setTimeout(() => navigate('/'), 1000);
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Enregistrer un Approvisionnement"
        description="Ajoutez du stock en fonction des livraisons reçues"
        breadcrumbs={[
          { label: 'Accueil', path: '/' },
          { label: 'Approvisionnement' },
        ]}
      />

      <div className="max-w-3xl mx-auto w-full p-4 md:p-6 space-y-6">
        <div className="bg-white rounded-lg p-6 space-y-6">
          {/* Supplier Selection */}
          <div>
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
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Rechercher un Produit
            </label>
            <div className="relative mb-4">
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

            {searchTerm && (
              <div className="space-y-2 mb-4">
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    Aucun produit trouvé
                  </div>
                ) : (
                  filteredProducts.map((product) => (
                    <button
                      key={product._id}
                      onClick={() => {
                        setSelectedProductId(product._id);
                        setSearchTerm('');
                      }}
                      className={`w-full p-3 rounded-lg border text-left transition ${
                        selectedProductId === product._id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-500'
                      }`}
                    >
                      <div className="font-semibold text-gray-900">
                        {product.nom}
                      </div>
                      <div className="text-sm text-gray-600">
                        {product.categorie}
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Product Selection Display */}
          {selectedProduct && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">Produit sélectionné:</p>
              <p className="font-bold text-gray-900">{selectedProduct.nom}</p>
            </div>
          )}

          {/* Entry Details */}
          {selectedProduct && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Quantité Reçue *
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="Ex: 10"
                  value={quantite}
                  onChange={(e) => setQuantite(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Prix d'Achat Unitaire (XOF) *
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="Ex: 8000"
                  value={prixAchat}
                  onChange={(e) => setPrixAchat(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Note (Optionnel)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Livraison Dakar Tech"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
              >
                ENREGISTRER L'ENTRÉE
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
