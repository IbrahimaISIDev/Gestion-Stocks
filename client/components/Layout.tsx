import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useStock } from "@/lib/context";
import {
  Home,
  Package,
  Users,
  Settings,
  AlertCircle,
  Menu,
  X,
  BarChart3,
  MessageSquare,
  ShoppingCart,
  Plus,
} from "lucide-react";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  shortLabel?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isOnline } = useStock();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      path: "/",
      label: "Tableau de Bord",
      icon: <Home size={20} />,
      shortLabel: "Accueil",
    },
    {
      path: "/vendre",
      label: "Vendre",
      icon: <ShoppingCart size={20} />,
      shortLabel: "Vendre",
    },
    {
      path: "/approvisionnement",
      label: "Approvisionnement",
      icon: <Plus size={20} />,
      shortLabel: "Stock",
    },
    {
      path: "/commandes",
      label: "Commandes",
      icon: <MessageSquare size={20} />,
      shortLabel: "Commandes",
    },
    {
      path: "/produits",
      label: "Produits",
      icon: <Package size={20} />,
      shortLabel: "Produits",
    },
    {
      path: "/fournisseurs",
      label: "Fournisseurs",
      icon: <Users size={20} />,
      shortLabel: "Fournisseurs",
    },
    {
      path: "/rapports",
      label: "Rapports",
      icon: <BarChart3 size={20} />,
      shortLabel: "Rapports",
    },
    {
      path: "/parametres",
      label: "Paramètres",
      icon: <Settings size={20} />,
      shortLabel: "Paramètres",
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <Package size={24} />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-bold text-gray-900">
                Gestion de Stocks
              </h1>
              <p className="text-xs text-gray-500">MVP v1.0</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                  isActive(item.path)
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Online Status */}
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                isOnline
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  isOnline ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="hidden sm:inline font-medium">
                {isOnline ? "En ligne" : "Hors ligne"}
              </span>
              <span className="sm:hidden font-medium">
                {isOnline ? "●" : "●"}
              </span>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <nav className="flex flex-col">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={`px-4 py-3 text-sm font-medium border-l-4 transition ${
                    isActive(item.path)
                      ? "bg-blue-50 border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {item.icon}
                    {item.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-4 pb-20 md:pt-6 md:pb-8">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed md:hidden bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex justify-around items-stretch">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 border-t-2 transition ${
                isActive(item.path)
                  ? "border-blue-600 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {item.icon}
              <span className="text-xs font-medium">{item.shortLabel}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};
