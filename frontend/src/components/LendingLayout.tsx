import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Banknote, CreditCard, FileText, User } from 'lucide-react';
import { CreateLoanForm } from '@/components/CreateLoanForm';
import { PaymentForm } from '@/components/PaymentForm';
import { LoanLedger } from '@/components/LoanLedger';
import { CustomerOverview } from '@/components/CustomerOverview';

export const LendingLayout = () => {
  const [activeTab, setActiveTab] = useState('lend');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary-light/10 p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6 bg-gradient-to-r from-primary to-primary-light text-primary-foreground shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-3xl font-bold flex items-center gap-3">
              <Banknote className="h-8 w-8" />
              Lendly Bank - Bank Lending System
            </CardTitle>
            <p className="text-primary-foreground/90 text-lg">
              Manage loans, payments, and customer accounts with ease
            </p>
          </CardHeader>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-14 bg-card shadow-lg">
            <TabsTrigger 
              value="lend" 
              className="flex items-center gap-2 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Banknote className="h-5 w-5" />
              Create Loan
            </TabsTrigger>
            <TabsTrigger 
              value="payment" 
              className="flex items-center gap-2 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <CreditCard className="h-5 w-5" />
              Record Payment
            </TabsTrigger>
            <TabsTrigger 
              value="ledger" 
              className="flex items-center gap-2 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <FileText className="h-5 w-5" />
              Loan Ledger
            </TabsTrigger>
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <User className="h-5 w-5" />
              Customer Overview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lend" className="space-y-4">
            <CreateLoanForm />
          </TabsContent>

          <TabsContent value="payment" className="space-y-4">
            <PaymentForm />
          </TabsContent>

          <TabsContent value="ledger" className="space-y-4">
            <LoanLedger />
          </TabsContent>

          <TabsContent value="overview" className="space-y-4">
            <CustomerOverview />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};