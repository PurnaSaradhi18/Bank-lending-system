import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { User, Eye, DollarSign, CreditCard, TrendingUp } from 'lucide-react';
import { useLendingStore } from '@/hooks/useLendingStore';
import { useToast } from '@/hooks/use-toast';
import { CustomerOverview as CustomerOverviewType } from '@/types/lending';

export const CustomerOverview = () => {
  const { customers, getCustomerOverview } = useLendingStore();
  const { toast } = useToast();
  
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [overviewData, setOverviewData] = useState<CustomerOverviewType | null>(null);
  const [loading, setLoading] = useState(false);

  const handleViewOverview = async () => {
    if (!selectedCustomerId) {
      toast({
        title: "Validation Error",
        description: "Please select a customer to view their overview.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const data = await getCustomerOverview(selectedCustomerId);
      setOverviewData(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch customer overview. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCustomerId) {
      handleViewOverview();
    }
  }, [selectedCustomerId]);

  const selectedCustomer = customers.find(c => c.customer_id === selectedCustomerId);

  const totals = overviewData?.loans.reduce((acc, loan) => ({
    totalPrincipal: acc.totalPrincipal + loan.principal,
    totalAmount: acc.totalAmount + loan.total_amount,
    totalInterest: acc.totalInterest + loan.total_interest,
    totalPaid: acc.totalPaid + loan.amount_paid,
    totalEmiAmount: acc.totalEmiAmount + loan.emi_amount
  }), {
    totalPrincipal: 0,
    totalAmount: 0,
    totalInterest: 0,
    totalPaid: 0,
    totalEmiAmount: 0
  });

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
          <CardTitle className="flex items-center gap-2">
            <User className="h-6 w-6 text-primary" />
            Customer Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Select Customer</label>
              <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a customer to view overview" />
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
            <Button onClick={handleViewOverview} disabled={!selectedCustomerId || loading}>
              <Eye className="h-4 w-4 mr-2" />
              {loading ? 'Loading...' : 'View Overview'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {overviewData && selectedCustomer && (
        <>
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-accent/10 to-accent/5">
              <CardTitle className="flex items-center gap-2">
                <User className="h-6 w-6 text-accent" />
                {selectedCustomer.name}
              </CardTitle>
              <p className="text-muted-foreground">
                Customer ID: {overviewData.customer_id} • Total Loans: {overviewData.total_loans}
              </p>
            </CardHeader>
          </Card>

          {totals && (
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="shadow-lg">
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Total Principal</p>
                  <p className="text-2xl font-bold text-primary">
                    ${totals.totalPrincipal.toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-warning mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Total Interest</p>
                  <p className="text-2xl font-bold text-warning">
                    ${totals.totalInterest.toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-8 w-8 text-success mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Total Paid</p>
                  <p className="text-2xl font-bold text-success">
                    ${totals.totalPaid.toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardContent className="p-6 text-center">
                  <CreditCard className="h-8 w-8 text-accent mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Monthly EMI Total</p>
                  <p className="text-2xl font-bold text-accent">
                    ${totals.totalEmiAmount.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Loan Portfolio</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Loan ID</TableHead>
                    <TableHead>Principal</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Interest</TableHead>
                    <TableHead>Monthly EMI</TableHead>
                    <TableHead>Amount Paid</TableHead>
                    <TableHead>EMIs Left</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overviewData.loans.map((loan) => (
                    <TableRow key={loan.loan_id}>
                      <TableCell className="font-medium">{loan.loan_id}</TableCell>
                      <TableCell>${loan.principal.toLocaleString()}</TableCell>
                      <TableCell>${loan.total_amount.toLocaleString()}</TableCell>
                      <TableCell>${loan.total_interest.toLocaleString()}</TableCell>
                      <TableCell>${loan.emi_amount.toFixed(2)}</TableCell>
                      <TableCell className="text-success font-semibold">
                        ${loan.amount_paid.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={loan.emis_left === 0 ? 'default' : 'secondary'}>
                          {loan.emis_left} EMIs
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={loan.emis_left === 0 ? 'default' : 'outline'}>
                          {loan.emis_left === 0 ? 'PAID OFF' : 'ACTIVE'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {overviewData && overviewData.loans.length === 0 && (
        <Card className="shadow-lg">
          <CardContent className="p-8 text-center text-muted-foreground">
            <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>This customer has no loans yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};