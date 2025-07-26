import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, DollarSign } from 'lucide-react';
import { useLendingStore } from '@/hooks/useLendingStore';
import { useToast } from '@/hooks/use-toast';

export const CreateLoanForm = () => {
  const { customers, createLoan, calculateLoanDetails } = useLendingStore();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    customer_id: '',
    loan_amount: '',
    loan_period_years: '',
    interest_rate_yearly: ''
  });
  
  const [preview, setPreview] = useState<{
    total_interest: number;
    total_amount: number;
    monthly_emi: number;
  } | null>(null);

  const handleInputChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);

    if (newData.loan_amount && newData.loan_period_years && newData.interest_rate_yearly) {
      const details = calculateLoanDetails(
        parseFloat(newData.loan_amount),
        parseFloat(newData.loan_period_years),
        parseFloat(newData.interest_rate_yearly)
      );
      setPreview(details);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customer_id || !formData.loan_amount || !formData.loan_period_years || !formData.interest_rate_yearly) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await createLoan({
        customer_id: formData.customer_id,
        loan_amount: parseFloat(formData.loan_amount),
        loan_period_years: parseFloat(formData.loan_period_years),
        interest_rate_yearly: parseFloat(formData.interest_rate_yearly)
      });

      toast({
        title: "Loan Created Successfully",
        description: `Loan ID: ${result.loan_id} - Monthly EMI: $${result.monthly_emi.toFixed(2)}`,
        variant: "success",
      });

      setFormData({
        customer_id: '',
        loan_amount: '',
        loan_period_years: '',
        interest_rate_yearly: ''
      });
      setPreview(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create loan. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-primary" />
            Create New Loan
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="customer">Customer</Label>
              <Select value={formData.customer_id} onValueChange={(value) => handleInputChange('customer_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map(customer => (
                    <SelectItem key={customer.customer_id} value={customer.customer_id}>
                      {customer.name} ({customer.customer_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="loan_amount">Loan Amount ($)</Label>
              <Input
                id="loan_amount"
                type="number"
                placeholder="100000"
                value={formData.loan_amount}
                onChange={(e) => handleInputChange('loan_amount', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="loan_period">Loan Period (Years)</Label>
              <Input
                id="loan_period"
                type="number"
                placeholder="2"
                value={formData.loan_period_years}
                onChange={(e) => handleInputChange('loan_period_years', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interest_rate">Interest Rate (% per year)</Label>
              <Input
                id="interest_rate"
                type="number"
                step="0.1"
                placeholder="10.5"
                value={formData.interest_rate_yearly}
                onChange={(e) => handleInputChange('interest_rate_yearly', e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" size="lg">
              Create Loan
            </Button>
          </form>
        </CardContent>
      </Card>

      {preview && (
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-accent/10 to-accent/5">
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-6 w-6 text-accent" />
              Loan Calculation Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Principal Amount</p>
                <p className="text-2xl font-bold text-primary">
                  ${parseFloat(formData.loan_amount).toLocaleString()}
                </p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Total Interest</p>
                <p className="text-2xl font-bold text-warning">
                  ${preview.total_interest.toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="text-center p-4 bg-accent-light rounded-lg">
              <p className="text-sm text-accent">Total Amount Payable</p>
              <p className="text-3xl font-bold text-accent">
                ${preview.total_amount.toLocaleString()}
              </p>
            </div>
            
            <div className="text-center p-4 bg-primary-light rounded-lg">
              <p className="text-sm text-primary">Monthly EMI</p>
              <p className="text-3xl font-bold text-primary">
                ${preview.monthly_emi.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};