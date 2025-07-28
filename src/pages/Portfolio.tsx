import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, TrendingUp, TrendingDown, Wallet, DollarSign, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useCryptoData, useSearchCrypto } from '@/hooks/useCryptoData';
import { toast } from 'sonner';

interface PortfolioItem {
  id: string;
  crypto_id: string;
  crypto_name: string;
  crypto_symbol: string;
  amount: number;
  purchase_price: number;
  purchase_date: string;
  current_price?: number;
  current_value?: number;
  profit_loss?: number;
  profit_loss_percentage?: number;
}

export function Portfolio() {
  const { user } = useAuth();
  const { cryptoData } = useCryptoData();
  const { searchResults, searchCrypto } = useSearchCrypto();
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [amount, setAmount] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      fetchPortfolio();
    }
  }, [user]);

  useEffect(() => {
    if (portfolio.length > 0 && cryptoData.length > 0) {
      updatePortfolioValues();
    }
  }, [cryptoData, portfolio]);

  const fetchPortfolio = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPortfolio(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch portfolio: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updatePortfolioValues = () => {
    const updatedPortfolio = portfolio.map(item => {
      const currentData = cryptoData.find(crypto => crypto.id === item.crypto_id);
      if (currentData) {
        const currentValue = item.amount * currentData.price;
        const investedValue = item.amount * item.purchase_price;
        const profitLoss = currentValue - investedValue;
        const profitLossPercentage = ((profitLoss / investedValue) * 100);

        return {
          ...item,
          current_price: currentData.price,
          current_value: currentValue,
          profit_loss: profitLoss,
          profit_loss_percentage: profitLossPercentage
        };
      }
      return item;
    });
    setPortfolio(updatedPortfolio);
  };

  const addToPortfolio = async () => {
    if (!selectedCrypto || !amount || !purchasePrice) {
      toast.error('Please fill all fields');
      return;
    }

    const crypto = searchResults.find(c => c.id === selectedCrypto) || 
                   cryptoData.find(c => c.id === selectedCrypto);
    
    if (!crypto) {
      toast.error('Selected cryptocurrency not found');
      return;
    }

    try {
      const { error } = await supabase
        .from('portfolio')
        .insert({
          user_id: user?.id,
          crypto_id: crypto.id,
          crypto_name: crypto.name,
          crypto_symbol: crypto.symbol,
          amount: parseFloat(amount),
          purchase_price: parseFloat(purchasePrice)
        });

      if (error) throw error;

      toast.success('Added to portfolio successfully!');
      setIsDialogOpen(false);
      setSelectedCrypto('');
      setAmount('');
      setPurchasePrice('');
      setSearchQuery('');
      fetchPortfolio();
    } catch (error: any) {
      toast.error('Failed to add to portfolio: ' + error.message);
    }
  };

  const removeFromPortfolio = async (id: string) => {
    try {
      const { error } = await supabase
        .from('portfolio')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Removed from portfolio');
      fetchPortfolio();
    } catch (error: any) {
      toast.error('Failed to remove from portfolio: ' + error.message);
    }
  };

  const totalValue = portfolio.reduce((sum, item) => sum + (item.current_value || 0), 0);
  const totalInvested = portfolio.reduce((sum, item) => sum + (item.amount * item.purchase_price), 0);
  const totalProfitLoss = totalValue - totalInvested;
  const totalProfitLossPercentage = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      searchCrypto(query);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading portfolio...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Portfolio</h1>
          <p className="text-muted-foreground">Track your cryptocurrency investments</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Add Asset
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Cryptocurrency to Portfolio</DialogTitle>
              <DialogDescription>
                Add a new cryptocurrency holding to track its performance
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="crypto-search">Search Cryptocurrency</Label>
                <Input
                  id="crypto-search"
                  placeholder="Type to search cryptocurrencies..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
                {(searchResults.length > 0 || cryptoData.length > 0) && (
                  <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cryptocurrency" />
                    </SelectTrigger>
                    <SelectContent>
                      {(searchResults.length > 0 ? searchResults : cryptoData.slice(0, 20)).map((crypto) => (
                        <SelectItem key={crypto.id} value={crypto.id}>
                          <div className="flex items-center gap-2">
                            <img 
                              src={crypto.icon} 
                              alt={crypto.name}
                              className="w-4 h-4"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder.svg';
                              }}
                            />
                            {crypto.name} ({crypto.symbol})
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchase-price">Purchase Price (USD)</Label>
                <Input
                  id="purchase-price"
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                />
              </div>
              <Button onClick={addToPortfolio} className="w-full">
                Add to Portfolio
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalInvested.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
            {totalProfitLoss >= 0 ? (
              <TrendingUp className="h-4 w-4 text-success" />
            ) : (
              <TrendingDown className="h-4 w-4 text-destructive" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalProfitLoss >= 0 ? 'text-success' : 'text-destructive'}`}>
              ${Math.abs(totalProfitLoss).toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </div>
            <p className={`text-xs ${totalProfitLoss >= 0 ? 'text-success' : 'text-destructive'}`}>
              {totalProfitLoss >= 0 ? '+' : '-'}{Math.abs(totalProfitLossPercentage).toFixed(2)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Holdings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolio.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Holdings</CardTitle>
          <CardDescription>
            Track the performance of your cryptocurrency investments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {portfolio.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No holdings yet</p>
              <Button onClick={() => setIsDialogOpen(true)} variant="outline">
                Add your first cryptocurrency
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {portfolio.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <img 
                      src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${item.crypto_id}.png`}
                      alt={item.crypto_name}
                      className="w-10 h-10"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                    <div>
                      <div className="font-medium">{item.crypto_name}</div>
                      <div className="text-sm text-muted-foreground">{item.crypto_symbol}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{item.amount} {item.crypto_symbol}</div>
                    <div className="text-sm text-muted-foreground">
                      ${(item.current_value || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                    </div>
                    {item.profit_loss !== undefined && (
                      <Badge 
                        variant={item.profit_loss >= 0 ? "default" : "destructive"}
                        className={item.profit_loss >= 0 ? "bg-success text-success-foreground" : ""}
                      >
                        {item.profit_loss >= 0 ? '+' : ''}
                        ${item.profit_loss.toFixed(2)} ({item.profit_loss_percentage?.toFixed(2)}%)
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeFromPortfolio(item.id)}
                    className="ml-4"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}