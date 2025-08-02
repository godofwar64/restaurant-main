import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import Breakfast from "./pages/Breakfast";
import Lunch from "./pages/Lunch";
import Dinner from "./pages/Dinner";
import Dessert from "./pages/Dessert";
import Booking from "./pages/Booking";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <LanguageProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="breakfast" element={<Breakfast />} />
              <Route path="dinner" element={<Dinner />} />
              <Route path="lunch" element={<Lunch />} />
              <Route path="dessert" element={<Dessert />} />
              <Route path="booking" element={<Booking />} />
            </Route>
            {/* Checkout Route - Separate from main layout */}
            <Route path="/checkout" element={<Checkout />} />
            {/* Orders Route - Separate from main layout */}
            <Route path="/orders" element={<Orders />} />
            {/* Admin Routes - Separate from main layout */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <NotificationProvider>
                <AdminDashboard />
              </NotificationProvider>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </LanguageProvider>
);

export default App;
