import React, { useState, useMemo } from 'react';
import { useStock } from '@/lib/context';
import { PageHeader } from '@/components/PageHeader';
import {
  generateReport,
  filterMovementsByDateRange,
  filterMovementsByProduct,
  filterMovementsByCategory,
  PeriodType,
} from '@/lib/reports';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Download,
  Filter,
  TrendingUp,
  DollarSign,
  Package,
  ShoppingCart,
} from 'lucide-react';
import { toast } from 'sonner';

const COLORS = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#EC4899',
];

const CATEGORIES = [
  'Électronique',
  'Papeterie',
  'Cosmétiques',
  'Chaussures',
  'Fournitures',
  'Services',
];

const PERIODS: { value: PeriodType; label: string }[] = [
  { value: 'daily', label: 'Quotidien' },
  { value: 'weekly', label: 'Hebdomadaire' },
  { value: 'monthly', label: 'Mensuel' },
  { value: 'quarterly', label: 'Trimestriel' },
  { value: 'semiannual', label: 'Semestriel' },
  { value: 'annual', label: 'Annuel' },
];

export default function Rapports() {
  const { products, movements } = useStock();
  
  const [periodType, setPeriodType] = useState<PeriodType>('monthly');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const filteredMovements = useMemo(() => {
    let filtered = filterMovementsByDateRange(
      movements,
      new Date(startDate),
      new Date(endDate + 'T23:59:59')
    );

    if (selectedProduct) {
      filtered = filterMovementsByProduct(filtered, selectedProduct);
    } else if (selectedCategory) {
      filtered = filterMovementsByCategory(filtered, products, selectedCategory);
    }

    return filtered;
  }, [movements, startDate, endDate, selectedProduct, selectedCategory, products]);

  const report = useMemo(() => {
    return generateReport(filteredMovements, products, periodType);
  }, [filteredMovements, products, periodType]);

  const handleExportPDF = () => {
    toast.success('Export PDF en développement');
  };

  const handleExportCSV = () => {
    const headers = [
      'Période',
      'Ventes (XOF)',
      'Quantité',
      'Profit (XOF)',
      'Transactions',
    ];
    const rows = report.chartData.map((d) => [
      d.period,
      d.sales.toString(),
      d.quantity.toString(),
      d.profit.toString(),
      d.movementsCount.toString(),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((r) => r.join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport-${periodType}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Rapport exporté en CSV');
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Rapports et Statistiques"
        description="Analysez les performances de votre stock et ventes"
        breadcrumbs={[
          { label: 'Accueil', path: '/' },
          { label: 'Rapports' },
        ]}
      />

      <div className="max-w-7xl mx-auto w-full p-4 md:p-6 space-y-8">
        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} className="text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">Filtres</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Period Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Période
              </label>
              <select
                value={periodType}
                onChange={(e) => setPeriodType(e.target.value as PeriodType)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {PERIODS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Date Début
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Date Fin
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Product Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Produit
              </label>
              <select
                value={selectedProduct}
                onChange={(e) => {
                  setSelectedProduct(e.target.value);
                  setSelectedCategory('');
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tous les produits</option>
                {products.filter((p) => p.actif).map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.nom}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Catégorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedProduct('');
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Toutes les catégories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            icon={<DollarSign size={24} className="text-blue-600" />}
            label="Chiffre d'Affaires"
            value={report.totalRevenue.toLocaleString()}
            suffix="XOF"
            color="blue"
          />
          <SummaryCard
            icon={<Package size={24} className="text-green-600" />}
            label="Quantité Vendue"
            value={report.totalQuantity.toString()}
            color="green"
          />
          <SummaryCard
            icon={<TrendingUp size={24} className="text-purple-600" />}
            label="Profit Estimé"
            value={report.totalProfit.toLocaleString()}
            suffix="XOF"
            color="purple"
          />
          <SummaryCard
            icon={<ShoppingCart size={24} className="text-orange-600" />}
            label="Transactions"
            value={report.totalTransactions.toString()}
            color="orange"
          />
        </div>

        {/* Charts Section */}
        <div className="space-y-6">
          {/* Revenue & Quantity Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Évolution des Ventes
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={report.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" angle={-45} textAnchor="end" height={80} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip
                  formatter={(value) => value.toLocaleString()}
                  contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="sales"
                  stroke="#3B82F6"
                  name="Ventes (XOF)"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="quantity"
                  stroke="#10B981"
                  name="Quantité"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Profit Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Profit par Période
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={report.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip
                  formatter={(value) => value.toLocaleString()}
                  contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
                />
                <Bar dataKey="profit" fill="#8B5CF6" name="Profit (XOF)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          {report.categoryStats.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Distribution par Catégorie
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={report.categoryStats}
                      dataKey="totalSales"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {report.categoryStats.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => value.toLocaleString()}
                      contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Category Stats Table */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Statistiques par Catégorie
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {report.categoryStats.map((cat, index) => (
                    <div
                      key={cat.category}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor:
                                COLORS[index % COLORS.length],
                            }}
                          />
                          <span className="font-semibold text-gray-900">
                            {cat.category}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-gray-600">Ventes</p>
                          <p className="font-bold text-gray-900">
                            {cat.totalSales.toLocaleString()} XOF
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Quantité</p>
                          <p className="font-bold text-gray-900">
                            {cat.quantitySold}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Profit</p>
                          <p className="font-bold text-green-600">
                            {cat.profit.toLocaleString()} XOF
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Top Products */}
          {report.topProducts.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Top 5 Produits
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-4 font-semibold text-gray-900">
                        Produit
                      </th>
                      <th className="text-right py-2 px-4 font-semibold text-gray-900">
                        Quantité
                      </th>
                      <th className="text-right py-2 px-4 font-semibold text-gray-900">
                        Revenu
                      </th>
                      <th className="text-right py-2 px-4 font-semibold text-gray-900">
                        Profit
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.topProducts.map((prod) => (
                      <tr
                        key={prod.productId}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <span className="font-semibold text-gray-900">
                            {prod.productName}
                          </span>
                        </td>
                        <td className="text-right py-3 px-4 text-gray-600">
                          {prod.quantitySold}
                        </td>
                        <td className="text-right py-3 px-4 font-semibold text-gray-900">
                          {prod.revenue.toLocaleString()} XOF
                        </td>
                        <td className="text-right py-3 px-4 font-semibold text-green-600">
                          {prod.profit.toLocaleString()} XOF
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Export Section */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Exporter le Rapport
              </h3>
              <p className="text-gray-600">
                Téléchargez les données en CSV ou PDF
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                <Download size={20} />
                CSV
              </button>
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-semibold"
              >
                <Download size={20} />
                PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SummaryCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  suffix?: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  icon,
  label,
  value,
  suffix,
  color,
}) => {
  const bgColor = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
    orange: 'bg-orange-50 border-orange-200',
  }[color];

  return (
    <div className={`${bgColor} border rounded-lg p-6`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-600">{label}</h3>
        {icon}
      </div>
      <p className="text-3xl font-bold text-gray-900">
        {value}
        {suffix && <span className="text-lg ml-1 text-gray-600">{suffix}</span>}
      </p>
    </div>
  );
};
