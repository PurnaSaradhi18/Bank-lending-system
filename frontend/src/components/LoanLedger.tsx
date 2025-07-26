import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye, DollarSign, Calendar } from 'lucide-react';
import { useLendingStore } from '@/hooks/useLendingStore';
import { useToast } from '@/hooks/use-toast';
import { LoanLedger as LoanLedgerType } from '@/types/lending';

export const LoanLedger = () => {
  const { loans, getLoanLedger } = useLendingStore();
  const { toast } = useToast();
  
  const [selectedLoanId, setSelectedLoanId] = useState('');
  const [ledgerData, setLedgerData] = useState<LoanLedgerType | null>(null);
  const [loading, setLoading] = useState(false);

  const handleViewLedger = async () => {
    if (!selectedLoanId) {
      toast({
        title: "Validation Error",
        description: "Please select a loan to view its ledger.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const data = await getLoanLedger(selectedLoanId);
      setLedgerData(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch loan ledger. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedLoanId) {
      handleViewLedger();
    }
  }, [selectedLoanId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Loan Ledger
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Select Loan</label>
              <Select value={selectedLoanId} onValueChange={setSelectedLoanId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a loan to view ledger" />
                </SelectTrigger>
                <SelectContent>
                  {loans.map(loan => (
                    <SelectItem key={loan.loan_id} value={loan.loan_id}>
                      {loan.loan_id} - {loan.customer_id} (${loan.total_amount.toLocaleString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleViewLedger} disabled={!selectedLoanId || loading}>
              <Eye className="h-4 w-4 mr-2" />
              {loading ? 'Loading...' : 'View Ledger'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {ledgerData && (
        <>
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="shadow-lg">
              <CardContent className="p-6 text-center">
                <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Principal</p>
                <p className="text-2xl font-bold text-primary">
                  ${ledgerData.principal.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="p-6 text-center">
                <DollarSign className="h-8 w-8 text-warning mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold text-warning">
                  ${ledgerData.total_amount.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="p-6 text-center">
                <DollarSign className="h-8 w-8 text-success mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Amount Paid</p>
                <p className="text-2xl font-bold text-success">
                  ${ledgerData.amount_paid.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="p-6 text-center">
                <DollarSign className="h-8 w-8 text-destructive mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className="text-2xl font-bold text-destructive">
                  ${ledgerData.balance_amount.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-accent/10 to-accent/5">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-accent" />
                Payment History
              </CardTitle>
              <div className="flex gap-4 text-sm">
                <span>Monthly EMI: <strong>${ledgerData.monthly_emi.toFixed(2)}</strong></span>
                <span>EMIs Left: <strong>{ledgerData.emis_left}</strong></span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {ledgerData.transactions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ledgerData.transactions.map((transaction) => (
                      <TableRow key={transaction.transaction_id}>
                        <TableCell className="font-medium">
                          {transaction.transaction_id}
                        </TableCell>
                        <TableCell>{formatDate(transaction.date)}</TableCell>
                        <TableCell>
                          <Badge variant={transaction.type === 'EMI' ? 'default' : 'secondary'}>
                            {transaction.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-success">
                          ${transaction.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No payments recorded yet for this loan.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};