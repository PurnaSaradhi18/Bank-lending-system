import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, DollarSign } from 'lucide-react';
import { useLendingStore } from '@/hooks/useLendingStore';
import { useToast } from '@/hooks/use-toast';

export const PaymentForm = () => {
  const { loans, recordPayment } = useLendingStore();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    loan_id: '',
    amount: '',
    payment_type: '' as 'EMI' | 'LUMP_SUM' | ''
  });

  const selectedLoan = loans.find(loan => loan.loan_id === formData.loan_id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.loan_id || !formData.amount || !formData.payment_type) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await recordPayment(formData.loan_id, {
        amount: parseFloat(formData.amount),
        payment_type: formData.payment_type
      });

      toast({
        title: "Payment Recorded Successfully",
        description: `Payment ID: ${result.payment_id} - Remaining Balance: $${result.remaining_balance.toFixed(2)}`,
        variant: "success",
      });

      setFormData({
        loan_id: '',
        amount: '',
        payment_type: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const activeLoans = loans.filter(loan => loan.status === 'ACTIVE');

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />
            Record Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="loan_id">Select Loan</Label>
              <Select value={formData.loan_id} onValueChange={(value) => setFormData(prev => ({ ...prev, loan_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a loan" />
                </SelectTrigger>
                <SelectContent>
                  {activeLoans.map(loan => (
                    <SelectItem key={loan.loan_id} value={loan.loan_id}>
                      {loan.loan_id} - ${loan.total_amount.toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_type">Payment Type</Label>
              <Select value={formData.payment_type} onValueChange={(value) => setFormData(prev => ({ ...prev, payment_type: value as 'EMI' | 'LUMP_SUM' }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EMI">EMI Payment</SelectItem>
                  <SelectItem value="LUMP_SUM">Lump Sum Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Payment Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder={selectedLoan ? `EMI: $${selectedLoan.monthly_emi.toFixed(2)}` : "Enter amount"}
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              />
              {selectedLoan && (
                <p className="text-sm text-muted-foreground">
                  Suggested EMI: ${selectedLoan.monthly_emi.toFixed(2)}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" size="lg">
              Record Payment
            </Button>
          </form>
        </CardContent>
      </Card>

      {selectedLoan && (
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-accent/10 to-accent/5">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-accent" />
              Loan Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Loan ID</p>
                <p className="text-lg font-semibold">{selectedLoan.loan_id}</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="text-lg font-semibold">{selectedLoan.customer_id}</p>
              </div>
            </div>
            
            <div className="text-center p-4 bg-primary-light rounded-lg">
              <p className="text-sm text-primary">Total Amount</p>
              <p className="text-2xl font-bold text-primary">
                ${selectedLoan.total_amount.toLocaleString()}
              </p>
            </div>
            
            <div className="text-center p-4 bg-accent-light rounded-lg">
              <p className="text-sm text-accent">Monthly EMI</p>
              <p className="text-2xl font-bold text-accent">
                ${selectedLoan.monthly_emi.toFixed(2)}
              </p>
            </div>

            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Interest Rate</p>
              <p className="text-lg font-semibold">{selectedLoan.interest_rate}% per year</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};