import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import CheckoutProcessPage from "./pages/CheckoutProcessPage";
import CustomizerPage from "./pages/CustomizerPage";
import GalleryPage from "./pages/GalleryPage";
import Homepage from "./pages/Homepage";
import UserAccountPage from "./pages/UserAccountPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();


const App = () => (
<QueryClientProvider client={queryClient}>
    <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
        <Routes>


          <Route path="/" element={<Homepage />} />
          <Route path="/checkout-process" element={<CheckoutProcessPage />} />
          <Route path="/customizer" element={<CustomizerPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/user-account" element={<UserAccountPage />} />
          {/* catch-all */}
          <Route path="*" element={<NotFound />} />


        </Routes>
    </BrowserRouter>
    </TooltipProvider>
</QueryClientProvider>
);

export default App;
