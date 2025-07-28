import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CryptoCard } from "@/components/CryptoCard"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  Activity,
  Plus
} from "lucide-react"

export default function Dashboard() {
  // Mock data untuk demonstrasi
  const marketStats = {
    totalMarketCap: "$2.1T",
    marketCapChange: 2.5,
    volume24h: "$68.2B",
    volumeChange: -5.3,
    dominance: "Bitcoin 42.1%",
    dominanceChange: 0.8
  }

  const topCryptos = [
    {
      name: "Bitcoin",
      symbol: "BTC",
      price: "$42,350.00",
      change24h: 2.15,
      marketCap: "$829.5B",
      volume: "$15.2B"
    },
    {
      name: "Ethereum", 
      symbol: "ETH",
      price: "$2,845.80",
      change24h: -0.85,
      marketCap: "$342.1B",
      volume: "$8.9B"
    },
    {
      name: "Cardano",
      symbol: "ADA",
      price: "$0.485",
      change24h: 5.32,
      marketCap: "$17.2B",
      volume: "$654M"
    },
    {
      name: "Solana",
      symbol: "SOL", 
      price: "$98.45",
      change24h: -2.47,
      marketCap: "$43.8B",
      volume: "$1.2B"
    }
  ]

  const portfolioData = {
    totalValue: "$25,847.32",
    totalChange: 8.45,
    totalChangeValue: "$2,018.65"
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Selamat datang kembali! Pantau performa crypto Anda hari ini.</p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" />
          Tambah ke Watchlist
        </Button>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-card transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Market Cap</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marketStats.totalMarketCap}</div>
            <div className="flex items-center space-x-1 text-sm">
              {marketStats.marketCapChange >= 0 ? (
                <TrendingUp className="h-3 w-3 text-success" />
              ) : (
                <TrendingDown className="h-3 w-3 text-destructive" />
              )}
              <span className={marketStats.marketCapChange >= 0 ? "text-success" : "text-destructive"}>
                {marketStats.marketCapChange >= 0 ? '+' : ''}{marketStats.marketCapChange}%
              </span>
              <span className="text-muted-foreground">24h</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-card transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volume 24h</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marketStats.volume24h}</div>
            <div className="flex items-center space-x-1 text-sm">
              {marketStats.volumeChange >= 0 ? (
                <TrendingUp className="h-3 w-3 text-success" />
              ) : (
                <TrendingDown className="h-3 w-3 text-destructive" />
              )}
              <span className={marketStats.volumeChange >= 0 ? "text-success" : "text-destructive"}>
                {marketStats.volumeChange >= 0 ? '+' : ''}{marketStats.volumeChange}%
              </span>
              <span className="text-muted-foreground">24h</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-card transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">BTC Dominance</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marketStats.dominance}</div>
            <div className="flex items-center space-x-1 text-sm">
              {marketStats.dominanceChange >= 0 ? (
                <TrendingUp className="h-3 w-3 text-success" />
              ) : (
                <TrendingDown className="h-3 w-3 text-destructive" />
              )}
              <span className={marketStats.dominanceChange >= 0 ? "text-success" : "text-destructive"}>
                {marketStats.dominanceChange >= 0 ? '+' : ''}{marketStats.dominanceChange}%
              </span>
              <span className="text-muted-foreground">24h</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Overview */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Portfolio Overview</CardTitle>
            <Badge 
              variant={portfolioData.totalChange >= 0 ? "default" : "destructive"}
              className={`flex items-center space-x-1 ${
                portfolioData.totalChange >= 0 
                  ? "bg-success-light text-success border-success/20" 
                  : "bg-destructive-light text-destructive border-destructive/20"
              }`}
            >
              {portfolioData.totalChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span>{portfolioData.totalChange >= 0 ? '+' : ''}{portfolioData.totalChange}%</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="text-3xl font-bold text-foreground">{portfolioData.totalValue}</div>
              <div className="flex items-center space-x-2 text-sm">
                <span className={portfolioData.totalChange >= 0 ? "text-success" : "text-destructive"}>
                  {portfolioData.totalChange >= 0 ? '+' : ''}{portfolioData.totalChangeValue}
                </span>
                <span className="text-muted-foreground">today</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Total Holdings</div>
                <div className="text-lg font-semibold">4 Assets</div>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Best Performer</div>
                <div className="text-lg font-semibold text-success">ADA +5.32%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Cryptocurrencies */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Top Cryptocurrencies</h2>
          <Button variant="outline">Lihat Semua</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topCryptos.map((crypto, index) => (
            <CryptoCard
              key={index}
              name={crypto.name}
              symbol={crypto.symbol}
              price={crypto.price}
              change24h={crypto.change24h}
              marketCap={crypto.marketCap}
              volume={crypto.volume}
            />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center space-y-2">
              <Plus className="h-6 w-6" />
              <span>Add to Portfolio</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center space-y-2">
              <TrendingUp className="h-6 w-6" />
              <span>View Analytics</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center space-y-2">
              <BarChart3 className="h-6 w-6" />
              <span>Market Research</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}