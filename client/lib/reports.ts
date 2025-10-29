import { Movement, Product } from '@shared/api';

export type PeriodType = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'semiannual' | 'annual';

export interface ReportData {
  period: string;
  sales: number;
  quantity: number;
  profit: number;
  movementsCount: number;
}

export interface ProductStats {
  productId: string;
  productName: string;
  quantitySold: number;
  revenue: number;
  profit: number;
}

export interface CategoryStats {
  category: string;
  totalSales: number;
  quantitySold: number;
  profit: number;
}

export interface ReportSummary {
  totalRevenue: number;
  totalQuantity: number;
  totalProfit: number;
  totalTransactions: number;
  topProducts: ProductStats[];
  categoryStats: CategoryStats[];
  chartData: ReportData[];
}

function getPeriodKey(date: Date, periodType: PeriodType): string {
  const d = new Date(date);
  
  switch (periodType) {
    case 'daily':
      return d.toISOString().split('T')[0];
    
    case 'weekly': {
      const firstDay = new Date(d);
      firstDay.setDate(d.getDate() - d.getDay());
      return `Week of ${firstDay.toLocaleDateString('en-GB')}`;
    }
    
    case 'monthly':
      return d.toLocaleString('en-US', { year: 'numeric', month: 'long' });
    
    case 'quarterly': {
      const quarter = Math.floor(d.getMonth() / 3) + 1;
      return `Q${quarter} ${d.getFullYear()}`;
    }
    
    case 'semiannual': {
      const semester = d.getMonth() < 6 ? 1 : 2;
      return `S${semester} ${d.getFullYear()}`;
    }
    
    case 'annual':
      return d.getFullYear().toString();
    
    default:
      return d.toISOString().split('T')[0];
  }
}

export function filterMovementsByDateRange(
  movements: Movement[],
  startDate: Date,
  endDate: Date
): Movement[] {
  return movements.filter((m) => {
    const mDate = new Date(m.date);
    return mDate >= startDate && mDate <= endDate;
  });
}

export function filterMovementsByProduct(
  movements: Movement[],
  productId: string
): Movement[] {
  return movements.filter((m) => m.id_produit === productId);
}

export function filterMovementsByCategory(
  movements: Movement[],
  products: Product[],
  category: string
): Movement[] {
  const categoryProductIds = products
    .filter((p) => p.categorie === category)
    .map((p) => p._id);
  
  return movements.filter((m) => categoryProductIds.includes(m.id_produit));
}

export function calculateProductStats(
  movements: Movement[],
  products: Product[]
): ProductStats[] {
  const stats = new Map<string, ProductStats>();
  
  movements.forEach((m) => {
    const product = products.find((p) => p._id === m.id_produit);
    if (!product) return;
    
    if (!stats.has(m.id_produit)) {
      stats.set(m.id_produit, {
        productId: m.id_produit,
        productName: product.nom,
        quantitySold: 0,
        revenue: 0,
        profit: 0,
      });
    }
    
    const stat = stats.get(m.id_produit)!;
    
    if (m.type_mouvement === 'SORTIE') {
      stat.quantitySold += m.quantite;
      stat.revenue += m.quantite * m.prix_unitaire_XOF;
    } else {
      // For entries, calculate potential profit
      stat.profit += m.quantite * (product.prix_vente_XOF - m.prix_unitaire_XOF);
    }
  });
  
  return Array.from(stats.values()).sort((a, b) => b.revenue - a.revenue);
}

export function calculateCategoryStats(
  movements: Movement[],
  products: Product[]
): CategoryStats[] {
  const stats = new Map<string, CategoryStats>();
  
  movements.forEach((m) => {
    const product = products.find((p) => p._id === m.id_produit);
    if (!product) return;
    
    const category = product.categorie;
    
    if (!stats.has(category)) {
      stats.set(category, {
        category,
        totalSales: 0,
        quantitySold: 0,
        profit: 0,
      });
    }
    
    const stat = stats.get(category)!;
    
    if (m.type_mouvement === 'SORTIE') {
      stat.quantitySold += m.quantite;
      stat.totalSales += m.quantite * m.prix_unitaire_XOF;
    } else {
      stat.profit += m.quantite * (product.prix_vente_XOF - m.prix_unitaire_XOF);
    }
  });
  
  return Array.from(stats.values()).sort((a, b) => b.totalSales - a.totalSales);
}

export function generateReport(
  movements: Movement[],
  products: Product[],
  periodType: PeriodType
): ReportSummary {
  const salesMovements = movements.filter((m) => m.type_mouvement === 'SORTIE');
  const purchaseMovements = movements.filter((m) => m.type_mouvement === 'ENTREE');
  
  const chartDataMap = new Map<string, ReportData>();
  
  salesMovements.forEach((m) => {
    const key = getPeriodKey(new Date(m.date), periodType);
    const existing = chartDataMap.get(key);
    const saleRevenue = m.quantite * m.prix_unitaire_XOF;
    
    chartDataMap.set(key, {
      period: key,
      sales: (existing?.sales || 0) + saleRevenue,
      quantity: (existing?.quantity || 0) + m.quantite,
      profit: existing?.profit || 0,
      movementsCount: (existing?.movementsCount || 0) + 1,
    });
  });
  
  // Calculate profit based on purchases
  purchaseMovements.forEach((m) => {
    const product = products.find((p) => p._id === m.id_produit);
    if (!product) return;
    
    const key = getPeriodKey(new Date(m.date), periodType);
    const costPerUnit = m.prix_unitaire_XOF;
    const potentialProfit = m.quantite * (product.prix_vente_XOF - costPerUnit);
    
    const existing = chartDataMap.get(key);
    if (existing) {
      existing.profit += potentialProfit;
    }
  });
  
  const chartData = Array.from(chartDataMap.values()).sort(
    (a, b) => new Date(a.period).getTime() - new Date(b.period).getTime()
  );
  
  const totalRevenue = Array.from(chartDataMap.values()).reduce(
    (sum, d) => sum + d.sales,
    0
  );
  const totalQuantity = Array.from(chartDataMap.values()).reduce(
    (sum, d) => sum + d.quantity,
    0
  );
  const totalProfit = Array.from(chartDataMap.values()).reduce(
    (sum, d) => sum + d.profit,
    0
  );
  const totalTransactions = Array.from(chartDataMap.values()).reduce(
    (sum, d) => sum + d.movementsCount,
    0
  );
  
  const productStats = calculateProductStats(salesMovements, products);
  const categoryStats = calculateCategoryStats(movements, products);
  
  return {
    totalRevenue,
    totalQuantity,
    totalProfit,
    totalTransactions,
    topProducts: productStats.slice(0, 5),
    categoryStats,
    chartData,
  };
}
