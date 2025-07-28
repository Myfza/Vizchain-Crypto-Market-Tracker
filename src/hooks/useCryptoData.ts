import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume: number;
  icon: string;
  rank: number;
}

export function useCryptoData() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCryptoData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('crypto-data', {
        body: { limit: 100 }
      });

      if (error) throw error;

      const formattedData: CryptoData[] = data.data.map((crypto: any) => ({
        id: crypto.id.toString(),
        name: crypto.name,
        symbol: crypto.symbol,
        price: crypto.quote.USD.price,
        change24h: crypto.quote.USD.percent_change_24h,
        marketCap: crypto.quote.USD.market_cap,
        volume: crypto.quote.USD.volume_24h,
        icon: `https://s2.coinmarketcap.com/static/img/coins/64x64/${crypto.id}.png`,
        rank: crypto.cmc_rank
      }));

      setCryptoData(formattedData);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching crypto data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchCryptoData, 30000);
    return () => clearInterval(interval);
  }, []);

  return { cryptoData, loading, error, refetch: fetchCryptoData };
}

export function useSearchCrypto() {
  const [searchResults, setSearchResults] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(false);

  const searchCrypto = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('search-crypto', {
        body: { query: query.trim() }
      });

      if (error) throw error;

      const formattedData: CryptoData[] = data.data.map((crypto: any) => ({
        id: crypto.id.toString(),
        name: crypto.name,
        symbol: crypto.symbol,
        price: 0, // Search doesn't return price data
        change24h: 0,
        marketCap: 0,
        volume: 0,
        icon: `https://s2.coinmarketcap.com/static/img/coins/64x64/${crypto.id}.png`,
        rank: crypto.rank || 0
      }));

      setSearchResults(formattedData);
    } catch (err: any) {
      console.error('Error searching crypto:', err);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return { searchResults, loading, searchCrypto };
}