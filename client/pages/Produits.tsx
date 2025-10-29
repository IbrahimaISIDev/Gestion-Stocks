import React, { useState, useMemo } from 'react';
import { useStock } from '@/lib/context';
import { Search, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/PageHeader';

const CATEGORIES = [
  'Électronique',
  'Papeterie',
  'Cosmétiques',
  'Chaussures',
  'Fournitures',
  'Services',
];

export default function Produits() {
  const { products, addProduct, updateProduct, deleteProduct, getProductStock } =
    useStock();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    categorie: 'Électronique' as const,
    prix_vente_XOF: '',
    seuil_alerte_stock: '',
  });

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.nom
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchCategory =
        selectedCategory === '' || p.categorie === selectedCategory;
      return matchSearch && matchCategory && p.actif;
    });
  }, [searchTerm, selectedCategory, products]);

  const handleOpenForm = (product?: typeof products[0]) => {
    if (product) {
      setEditingId(product._id);
      setFormData({
        nom: product.nom,
        description: product.description || '',
        categorie: product.categorie,
        prix_vente_XOF: product.prix_vente_XOF.toString(),
        seuil_alerte_stock: product.seuil_alerte_stock.toString(),
      });
    } else {
      setEditingId(null);
      setFormData({
        nom: '',
        description: '',
        categorie: 'Électronique',
        prix_vente_XOF: '',
        seuil_alerte_stock: '',
      });
    }
    setIsFormOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.nom) {
      toast.error('Veuillez entrer un nom');
      return;
    }
    if (!formData.prix_vente_XOF || parseInt(formData.prix_vente_XOF) <= 0) {
      toast.error('Prix invalide');
      return;
    }
    if (
      !formData.seuil_alerte_stock ||
      parseInt(formData.seuil_alerte_stock) <= 0
    ) {
      toast.error('Seuil invalide');
      return;
    }

    if (editingId) {
      updateProduct(editingId, {
        nom: formData.nom,
        description: formData.description,
        categorie: formData.categorie,
        prix_vente_XOF: parseInt(formData.prix_vente_XOF),
        seuil_alerte_stock: parseInt(formData.seuil_alerte_stock),
      } as any);
      toast.success('Produit mis à jour');
    } else {
      addProduct({
        nom: formData.nom,
        description: formData.description,
        categorie: formData.categorie,
        prix_vente_XOF: parseInt(formData.prix_vente_XOF),
        seuil_alerte_stock: parseInt(formData.seuil_alerte_stock),
        actif: true,
      });
      toast.success('Produit créé');
    }

    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    if (
      window.confirm('Êtes-vous sûr de vouloir supprimer ce produit?')
    ) {
      deleteProduct(id);
      toast.success('Produit supprimé');
    }
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Gestion des Produits"
        description="Gérez votre catalogue de produits et services"
        breadcrumbs={[
          { label: 'Accueil', path: '/' },
          { label: 'Produits' },
        ]}
        action={{
          label: '+ AJOUTER PRODUIT',
          onClick: () => handleOpenForm(),
          variant: 'primary',
        }}
      />

      <div className="max-w-7xl mx-auto w-full p-4 md:p-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
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
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Toutes les catégories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Products Table/List */}
        <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Nom
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Catégorie
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Prix
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Seuil
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Aucun produit trouvé
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900">
                        {product.nom}
                      </div>
                      {product.description && (
                        <p className="text-xs text-gray-600">
                          {product.description}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {product.categorie}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {product.prix_vente_XOF.toLocaleString()} XOF
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                          getProductStock(product._id) <
                          product.seuil_alerte_stock
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {getProductStock(product._id)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {product.seuil_alerte_stock}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleOpenForm(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Form */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-center">
            <div className="bg-white w-full md:max-w-md rounded-t-2xl md:rounded-lg p-6 space-y-4 md:max-h-96 overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? 'Modifier Produit' : 'Ajouter Produit'}
              </h2>

              <input
                type="text"
                placeholder="Nom du produit"
                value={formData.nom}
                onChange={(e) =>
                  setFormData({ ...formData, nom: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                placeholder="Description (optionnel)"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <select
                value={formData.categorie}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    categorie: e.target.value as any,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="0"
                placeholder="Prix de vente (XOF)"
                value={formData.prix_vente_XOF}
                onChange={(e) =>
                  setFormData({ ...formData, prix_vente_XOF: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="number"
                min="1"
                placeholder="Seuil d'alerte"
                value={formData.seuil_alerte_stock}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    seuil_alerte_stock: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 font-semibold hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                >
                  {editingId ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
