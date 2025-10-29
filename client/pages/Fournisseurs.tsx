import React, { useState, useMemo } from 'react';
import { useStock } from '@/lib/context';
import { Search, Trash2, Edit, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/PageHeader';

export default function Fournisseurs() {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } =
    useStock();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nom: '',
    contact_principal: '',
    telephone: '',
    email: '',
    adresse: '',
  });

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) => {
      const matchSearch = s.nom
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchSearch && s.actif;
    });
  }, [searchTerm, suppliers]);

  const handleOpenForm = (supplier?: typeof suppliers[0]) => {
    if (supplier) {
      setEditingId(supplier._id);
      setFormData({
        nom: supplier.nom,
        contact_principal: supplier.contact_principal || '',
        telephone: supplier.telephone,
        email: supplier.email || '',
        adresse: supplier.adresse || '',
      });
    } else {
      setEditingId(null);
      setFormData({
        nom: '',
        contact_principal: '',
        telephone: '',
        email: '',
        adresse: '',
      });
    }
    setIsFormOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.nom) {
      toast.error('Veuillez entrer un nom');
      return;
    }
    if (!formData.telephone) {
      toast.error('Veuillez entrer un téléphone');
      return;
    }

    if (editingId) {
      updateSupplier(editingId, {
        nom: formData.nom,
        contact_principal: formData.contact_principal || undefined,
        telephone: formData.telephone,
        email: formData.email || undefined,
        adresse: formData.adresse || undefined,
      } as any);
      toast.success('Fournisseur mis à jour');
    } else {
      addSupplier({
        nom: formData.nom,
        contact_principal: formData.contact_principal || undefined,
        telephone: formData.telephone,
        email: formData.email || undefined,
        adresse: formData.adresse || undefined,
        actif: true,
      });
      toast.success('Fournisseur créé');
    }

    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    if (
      window.confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur?')
    ) {
      deleteSupplier(id);
      toast.success('Fournisseur supprimé');
    }
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Gestion des Fournisseurs"
        description="Gérez les contacts et informations de vos fournisseurs"
        breadcrumbs={[
          { label: 'Accueil', path: '/' },
          { label: 'Fournisseurs' },
        ]}
        action={{
          label: '+ AJOUTER FOURNISSEUR',
          onClick: () => handleOpenForm(),
          variant: 'primary',
        }}
      />

      <div className="max-w-7xl mx-auto w-full p-4 md:p-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Rechercher un fournisseur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Suppliers Table/Cards */}
        <div className="space-y-4">
          {filteredSuppliers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Aucun fournisseur trouvé
            </div>
          ) : (
            filteredSuppliers.map((supplier) => (
              <div
                key={supplier._id}
                className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 hover:border-blue-500 transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {supplier.nom}
                    </h3>
                    {supplier.contact_principal && (
                      <p className="text-sm text-gray-600 mb-1">
                        Contact: {supplier.contact_principal}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Phone size={16} />
                      <a href={`tel:${supplier.telephone}`} className="hover:text-blue-600">
                        {supplier.telephone}
                      </a>
                    </div>
                    {supplier.email && (
                      <p className="text-sm text-gray-600 mb-1">
                        Email: {supplier.email}
                      </p>
                    )}
                    {supplier.adresse && (
                      <p className="text-sm text-gray-600">
                        Adresse: {supplier.adresse}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 self-end md:self-auto">
                    <button
                      onClick={() => handleOpenForm(supplier)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(supplier._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Form */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-center">
            <div className="bg-white w-full md:max-w-md rounded-t-2xl md:rounded-lg p-6 space-y-4 md:max-h-96 overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? 'Modifier Fournisseur' : 'Ajouter Fournisseur'}
              </h2>

              <input
                type="text"
                placeholder="Nom du fournisseur"
                value={formData.nom}
                onChange={(e) =>
                  setFormData({ ...formData, nom: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                placeholder="Contact principal (optionnel)"
                value={formData.contact_principal}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact_principal: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="tel"
                placeholder="Téléphone"
                value={formData.telephone}
                onChange={(e) =>
                  setFormData({ ...formData, telephone: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="email"
                placeholder="Email (optionnel)"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                placeholder="Adresse (optionnel)"
                value={formData.adresse}
                onChange={(e) =>
                  setFormData({ ...formData, adresse: e.target.value })
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
