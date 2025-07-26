import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { CreateLoanForm } from "./components/CreateLoanForm";
import { PaymentForm } from "./components/PaymentForm";
import { LoanLedger } from "./components/LoanLedger";
import { CustomerOverview } from "./components/CustomerOverview";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/api/vi/loans" element={<CreateLoanForm />} />
            <Route path="/api/vi/payment" element={<PaymentForm />} />
            <Route path="/api/vi/ledger" element={<LoanLedger />} />
            <Route path="/api/vi/overview" element={<CustomerOverview />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
