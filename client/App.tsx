import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StockProvider } from "@/lib/context";
import { Layout } from "@/components/Layout";

import Index from "./pages/Index";
import Vendre from "./pages/Vendre";
import Approvisionnement from "./pages/Approvisionnement";
import Commandes from "./pages/Commandes";
import Produits from "./pages/Produits";
import Fournisseurs from "./pages/Fournisseurs";
import Rapports from "./pages/Rapports";
import Parametres from "./pages/Parametres";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <StockProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/vendre" element={<Vendre />} />
              <Route path="/approvisionnement" element={<Approvisionnement />} />
              <Route path="/commandes" element={<Commandes />} />
              <Route path="/produits" element={<Produits />} />
              <Route path="/fournisseurs" element={<Fournisseurs />} />
              <Route path="/rapports" element={<Rapports />} />
              <Route path="/parametres" element={<Parametres />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </StockProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
