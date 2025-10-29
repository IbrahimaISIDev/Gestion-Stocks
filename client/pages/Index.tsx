import React from 'react';
import { Link } from 'react-router-dom';
import { useStock } from '@/lib/context';
import {
  ShoppingCart,
  Package,
  AlertTriangle,
  Plus,
} from 'lucide-react';

export default function Index() {
  const { products, getLowStockProducts, getProductStock } = useStock();
  const lowStockProducts = getLowStockProducts();

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      {/* Low Stock Alerts */}
      {lowStockProducts.length > 0 && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 md:p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-red-600 flex-shrink-0 mt-1" size={20} />
            <div className="flex-1">
              <h2 className="text-lg font-bold text-red-900 mb-3">
                {lowStockProducts.length} Article(s) en Stock Bas
              </h2>
              <div className="space-y-2">
                {lowStockProducts.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white p-3 rounded text-sm md:text-base"
                  >
                    <div className="font-semibold text-gray-900">
                      {product.nom}
                    </div>
                    <div className="text-gray-700">
                      Stock actuel: <span className="font-bold">{product.stock}</span> /
                      Seuil: <span className="font-bold">{product.seuil_alerte_stock}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          Actions Rapides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionButton
            to="/vendre"
            icon={<ShoppingCart size={40} />}
            label="VENDRE"
            color="success"
          />
          <ActionButton
            to="/approvisionnement"
            icon={<Plus size={40} />}
            label="AJOUTER STOCK"
            color="primary"
          />
          <ActionButton
            to="/produits"
            icon={<Package size={40} />}
            label="GÉRER ARTICLES"
            color="neutral"
          />
        </div>
      </div>

      {/* Stock Summary */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          Résumé des Stocks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => {
            const stock = getProductStock(product._id);
            const isLowStock = stock < product.seuil_alerte_stock;
            return (
              <div
                key={product._id}
                className={`p-4 rounded-lg border-2 ${
                  isLowStock
                    ? 'bg-red-50 border-red-200'
                    : 'bg-green-50 border-green-200'
                }`}
              >
                <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-2">
                  {product.nom}
                </h3>
                <p className="text-xs text-gray-600 mb-3">{product.categorie}</p>
                <div className="flex items-baseline justify-between">
                  <div>
                    <p
                      className={`text-2xl md:text-3xl font-bold ${
                        isLowStock ? 'text-red-600' : 'text-green-600'
                      }`}
                    >
                      {stock}
                    </p>
                    <p className="text-xs text-gray-600">
                      Seuil: {product.seuil_alerte_stock}
                    </p>
                  </div>
                  {isLowStock && (
                    <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                      Bas!
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface ActionButtonProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  color: 'success' | 'primary' | 'neutral';
}

const ActionButton: React.FC<ActionButtonProps> = ({
  to,
  icon,
  label,
  color,
}) => {
  const colorMap = {
    success: 'bg-green-600 hover:bg-green-700 text-white',
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    neutral: 'bg-gray-600 hover:bg-gray-700 text-white',
  };

  return (
    <Link
      to={to}
      className={`${colorMap[color]} rounded-lg p-6 flex flex-col items-center justify-center gap-3 h-32 transition font-semibold`}
    >
      {icon}
      <span className="text-base md:text-lg">{label}</span>
    </Link>
  );
};
