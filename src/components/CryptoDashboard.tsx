import React from 'react';
import { useCryptoData } from '@/hooks/useCryptoData';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, BarChart3, DollarSign, Activity, Zap } from 'lucide-react';

interface MarketStat {
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon: React.ComponentType<any>;
}

export function CryptoDashboard() {
  const { cryptoData, loading } = useCryptoData();

  if (loading) {
    return (
      <div className="w-full space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-6 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  const topCryptos = cryptoData.slice(0, 10);
  const totalMarketCap = topCryptos.reduce((sum, crypto) => sum + crypto.marketCap, 0);
  const averageChange = topCryptos.reduce((sum, crypto) => sum + crypto.change24h, 0) / topCryptos.length;
  
  const marketStats: MarketStat[] = [
    {
      label: "Market Cap",
      value: `$${(totalMarketCap / 1e12).toFixed(2)}T`,
      change: `${averageChange > 0 ? '+' : ''}${averageChange.toFixed(2)}%`,
      isPositive: averageChange > 0,
      icon: BarChart3
    },
    {
      label: "CMC100",
      value: "$242.03",
      change: "-1.90%",
      isPositive: false,
      icon: DollarSign
    },
    {
      label: "DexScan Trending",
      value: "Active",
      icon: Activity
    },
    {
      label: "Fear & Greed",
      value: "63",
      change: "Greed",
      isPositive: true,
      icon: TrendingUp
    },
    {
      label: "Altcoin Season",
      value: "40/100",
      icon: Zap
    },
    {
      label: "Satoshi Club",
      value: "14 hours",
      icon: Activity
    }
  ];

  return (
    <div className="w-full space-y-6">
      {/* Market Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {marketStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-card transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-bold">{stat.value}</div>
                {stat.change && (
                  <div className={`text-xs flex items-center gap-1 ${
                    stat.isPositive ? 'text-success' : 'text-destructive'
                  }`}>
                    {stat.isPositive ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {stat.change}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trending Coins and Market Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trending Coins */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Trending Coins</h3>
              <Badge variant="secondary">Live</Badge>
            </div>
            <div className="space-y-4">
              {topCryptos.slice(0, 5).map((crypto, index) => (
                <div key={crypto.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-4">{index + 1}</span>
                    <img 
                      src={crypto.icon} 
                      alt={crypto.name}
                      className="w-6 h-6 rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = `https://via.placeholder.com/24/cccccc/ffffff?text=${crypto.symbol.charAt(0)}`;
                      }}
                    />
                    <div>
                      <div className="font-medium text-sm">{crypto.symbol}</div>
                      <div className="text-xs text-muted-foreground">{crypto.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      ${crypto.price.toLocaleString('en-US', { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 6 
                      })}
                    </div>
                    <div className={`text-xs ${
                      crypto.change24h > 0 ? 'text-success' : 'text-destructive'
                    }`}>
                      {crypto.change24h > 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Market Table */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Market Overview</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline">All Crypto</Badge>
                <Badge variant="secondary">Top 100</Badge>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-medium text-muted-foreground pb-2">#</th>
                    <th className="text-left text-xs font-medium text-muted-foreground pb-2">Name</th>
                    <th className="text-right text-xs font-medium text-muted-foreground pb-2">Price</th>
                    <th className="text-right text-xs font-medium text-muted-foreground pb-2">24h %</th>
                    <th className="text-right text-xs font-medium text-muted-foreground pb-2">Market Cap</th>
                  </tr>
                </thead>
                <tbody>
                  {topCryptos.slice(0, 8).map((crypto) => (
                    <tr key={crypto.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-3 text-sm text-muted-foreground">{crypto.rank}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <img 
                            src={crypto.icon} 
                            alt={crypto.name}
                            className="w-5 h-5 rounded-full"
                            onError={(e) => {
                              e.currentTarget.src = `https://via.placeholder.com/20/cccccc/ffffff?text=${crypto.symbol.charAt(0)}`;
                            }}
                          />
                          <div>
                            <div className="font-medium text-sm">{crypto.name}</div>
                            <div className="text-xs text-muted-foreground">{crypto.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-right text-sm font-medium">
                        ${crypto.price.toLocaleString('en-US', { 
                          minimumFractionDigits: 2, 
                          maximumFractionDigits: 6 
                        })}
                      </td>
                      <td className={`py-3 text-right text-sm ${
                        crypto.change24h > 0 ? 'text-success' : 'text-destructive'
                      }`}>
                        {crypto.change24h > 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%
                      </td>
                      <td className="py-3 text-right text-sm text-muted-foreground">
                        ${(crypto.marketCap / 1e9).toFixed(2)}B
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}