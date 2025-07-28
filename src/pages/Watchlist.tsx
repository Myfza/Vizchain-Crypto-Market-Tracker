import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Star, TrendingUp, TrendingDown, Trash2, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useCryptoData, useSearchCrypto, CryptoData } from '@/hooks/useCryptoData';
import { toast } from 'sonner';

interface WatchlistItem {
  id: string;
  crypto_id: string;
  crypto_name: string;
  crypto_symbol: string;
  created_at: string;
}

export function Watchlist() {
  const { user } = useAuth();
  const { cryptoData } = useCryptoData();
  const { searchResults, searchCrypto } = useSearchCrypto();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [watchlistWithData, setWatchlistWithData] = useState<(WatchlistItem & CryptoData)[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      fetchWatchlist();
    }
  }, [user]);

  useEffect(() => {
    if (watchlist.length > 0 && cryptoData.length > 0) {
      updateWatchlistData();
    }
  }, [cryptoData, watchlist]);

  const fetchWatchlist = async () => {
    try {
      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWatchlist(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch watchlist: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateWatchlistData = () => {
    const updatedWatchlist = watchlist.map(item => {
      const currentData = cryptoData.find(crypto => crypto.id === item.crypto_id);
      if (currentData) {
        return {
          ...item,
          ...currentData
        };
      }
      return {
        ...item,
        name: item.crypto_name,
        symbol: item.crypto_symbol,
        price: 0,
        change24h: 0,
        marketCap: 0,
        volume: 0,
        icon: `https://s2.coinmarketcap.com/static/img/coins/64x64/${item.crypto_id}.png`,
        rank: 0
      };
    });
    setWatchlistWithData(updatedWatchlist);
  };

  const addToWatchlist = async () => {
    if (!selectedCrypto) {
      toast.error('Please select a cryptocurrency');
      return;
    }

    const crypto = searchResults.find(c => c.id === selectedCrypto) || 
                   cryptoData.find(c => c.id === selectedCrypto);
    
    if (!crypto) {
      toast.error('Selected cryptocurrency not found');
      return;
    }

    // Check if already in watchlist
    const exists = watchlist.find(item => item.crypto_id === crypto.id);
    if (exists) {
      toast.error('This cryptocurrency is already in your watchlist');
      return;
    }

    try {
      const { error } = await supabase
        .from('watchlist')
        .insert({
          user_id: user?.id,
          crypto_id: crypto.id,
          crypto_name: crypto.name,
          crypto_symbol: crypto.symbol
        });

      if (error) throw error;

      toast.success('Added to watchlist successfully!');
      setIsDialogOpen(false);
      setSelectedCrypto('');
      setSearchQuery('');
      fetchWatchlist();
    } catch (error: any) {
      toast.error('Failed to add to watchlist: ' + error.message);
    }
  };

  const removeFromWatchlist = async (id: string) => {
    try {
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Removed from watchlist');
      fetchWatchlist();
    } catch (error: any) {
      toast.error('Failed to remove from watchlist: ' + error.message);
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      searchCrypto(query);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading watchlist...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Watchlist</h1>
          <p className="text-muted-foreground">Monitor your favorite cryptocurrencies</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Add to Watchlist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Cryptocurrency to Watchlist</DialogTitle>
              <DialogDescription>
                Add a cryptocurrency to monitor its price and performance
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search cryptocurrencies..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {(searchResults.length > 0 || cryptoData.length > 0) && (
                  <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cryptocurrency" />
                    </SelectTrigger>
                    <SelectContent>
                      {(searchResults.length > 0 ? searchResults : cryptoData.slice(0, 50)).map((crypto) => (
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
              <Button onClick={addToWatchlist} className="w-full">
                Add to Watchlist
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Your Watchlist
          </CardTitle>
          <CardDescription>
            {watchlist.length} cryptocurrencies in your watchlist
          </CardDescription>
        </CardHeader>
        <CardContent>
          {watchlistWithData.length === 0 ? (
            <div className="text-center py-8">
              <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Your watchlist is empty</p>
              <Button onClick={() => setIsDialogOpen(true)} variant="outline">
                Add your first cryptocurrency
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {watchlistWithData.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <img 
                      src={item.icon}
                      alt={item.name}
                      className="w-10 h-10"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">{item.symbol}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium">
                        ${item.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        MCap: ${(item.marketCap / 1000000000).toFixed(2)}B
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={item.change24h >= 0 ? "default" : "destructive"}
                        className={`${item.change24h >= 0 ? "bg-success text-success-foreground" : ""} flex items-center gap-1`}
                      >
                        {item.change24h >= 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {item.change24h >= 0 ? '+' : ''}{item.change24h.toFixed(2)}%
                      </Badge>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFromWatchlist(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {watchlistWithData.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Top Performer</CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const topPerformer = watchlistWithData.reduce((prev, current) => 
                  (prev.change24h > current.change24h) ? prev : current
                );
                return (
                  <div className="flex items-center gap-3">
                    <img 
                      src={topPerformer.icon}
                      alt={topPerformer.name}
                      className="w-8 h-8"
                    />
                    <div>
                      <div className="font-medium">{topPerformer.symbol}</div>
                      <Badge className="bg-success text-success-foreground">
                        +{topPerformer.change24h.toFixed(2)}%
                      </Badge>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Biggest Loser</CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const biggestLoser = watchlistWithData.reduce((prev, current) => 
                  (prev.change24h < current.change24h) ? prev : current
                );
                return (
                  <div className="flex items-center gap-3">
                    <img 
                      src={biggestLoser.icon}
                      alt={biggestLoser.name}
                      className="w-8 h-8"
                    />
                    <div>
                      <div className="font-medium">{biggestLoser.symbol}</div>
                      <Badge variant="destructive">
                        {biggestLoser.change24h.toFixed(2)}%
                      </Badge>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Most Valuable</CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const mostValuable = watchlistWithData.reduce((prev, current) => 
                  (prev.price > current.price) ? prev : current
                );
                return (
                  <div className="flex items-center gap-3">
                    <img 
                      src={mostValuable.icon}
                      alt={mostValuable.name}
                      className="w-8 h-8"
                    />
                    <div>
                      <div className="font-medium">{mostValuable.symbol}</div>
                      <div className="text-sm text-muted-foreground">
                        ${mostValuable.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}