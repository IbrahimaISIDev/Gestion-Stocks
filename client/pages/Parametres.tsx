import React from 'react';
import { useStock } from '@/lib/context';
import { Download, Upload, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { loadData } from '@/lib/db';
import { PageHeader } from '@/components/PageHeader';

export default function Parametres() {
  const { movements } = useStock();

  const handleExport = () => {
    try {
      const data = loadData();
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `stock-app-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Données exportées');
    } catch (error) {
      toast.error('Erreur lors de l\'export');
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          if (!data.products || !data.suppliers || !data.movements) {
            throw new Error('Format invalide');
          }
          localStorage.setItem('stock_app_data', JSON.stringify(data));
          toast.success('Données importées. Veuillez recharger la page.');
          setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
          toast.error('Erreur lors de l\'import');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleClearAll = () => {
    if (
      window.confirm(
        'Êtes-vous sûr? Cette action supprimera TOUTES les données.'
      )
    ) {
      localStorage.removeItem('stock_app_data');
      toast.success('Toutes les données ont été supprimées. Recharger la page...');
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  const unsyncedCount = movements.filter((m) => !m.synchronise).length;

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Paramètres"
        description="Configurez l'application et gérez vos données"
        breadcrumbs={[
          { label: 'Accueil', path: '/' },
          { label: 'Paramètres' },
        ]}
      />

      <div className="max-w-3xl mx-auto w-full p-4 md:p-6 space-y-8">
        {/* Application Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Informations de l'Application
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Version:</span>
              <span className="font-semibold text-gray-900">1.0 (MVP)</span>
            </div>
            <div className="flex justify-between py-2 border-t border-gray-200">
              <span className="text-gray-600">Statut:</span>
              <span className="font-semibold text-green-600">
                Production
              </span>
            </div>
            <div className="flex justify-between py-2 border-t border-gray-200">
              <span className="text-gray-600">Langue:</span>
              <span className="font-semibold text-gray-900">Français</span>
            </div>
          </div>
        </div>

        {/* Local Data Management */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Gestion des Données
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Exportez ou importez vos données au format JSON. Vous pouvez également
            supprimer toutes les données locales.
          </p>
          <div className="space-y-3">
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
            >
              <Download size={20} />
              Exporter les Données
            </button>
            <button
              onClick={handleImport}
              className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition"
            >
              <Upload size={20} />
              Importer les Données
            </button>
            <button
              onClick={handleClearAll}
              className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition"
            >
              <Trash2 size={20} />
              Supprimer Toutes les Données
            </button>
          </div>
        </div>

        {/* Offline Mode */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Mode Hors Ligne
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Transactions en attente:</span>
              <span className="font-semibold text-gray-900">{unsyncedCount}</span>
            </div>
            <button
              disabled={unsyncedCount === 0}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <RefreshCw size={20} />
              Synchroniser Maintenant
            </button>
            <p className="text-xs text-gray-600">
              Les transactions sont automatiquement synchronisées quand la
              connexion revient.
            </p>
          </div>
        </div>

        {/* About */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            À Propos
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Application de Gestion de Stocks (MVP) - Version 1.0
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            Une application Progressive Web App (PWA) conçue pour digitialiser la
            gestion des stocks pour les multi-services sénégalais.
          </p>
          <div className="pt-4 border-t border-blue-200">
            <p className="text-xs text-gray-600">
              Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
