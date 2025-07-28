import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CryptoCard } from "@/components/CryptoCard"
import { TrendingUp, TrendingDown, Filter } from "lucide-react"

export default function TopMovers() {
  const gainers = [
    {
      name: "Cardano",
      symbol: "ADA", 
      price: "$0.485",
      change24h: 15.32,
      marketCap: "$17.2B",
      volume: "$654M"
    },
    {
      name: "Polygon",
      symbol: "MATIC",
      price: "$0.892",
      change24h: 12.45,
      marketCap: "$8.9B", 
      volume: "$428M"
    },
    {
      name: "Chainlink",
      symbol: "LINK",
      price: "$14.67",
      change24h: 9.88,
      marketCap: "$8.2B",
      volume: "$312M"
    },
    {
      name: "Avalanche",
      symbol: "AVAX",
      price: "$36.24",
      change24h: 8.76,
      marketCap: "$13.8B",
      volume: "$589M"
    }
  ]

  const losers = [
    {
      name: "Solana",
      symbol: "SOL",
      price: "$98.45", 
      change24h: -8.47,
      marketCap: "$43.8B",
      volume: "$1.2B"
    },
    {
      name: "Polkadot",
      symbol: "DOT",
      price: "$5.89",
      change24h: -6.23,
      marketCap: "$7.8B",
      volume: "$245M"
    },
    {
      name: "Litecoin",
      symbol: "LTC", 
      price: "$73.12",
      change24h: -5.91,
      marketCap: "$5.4B",
      volume: "$387M"
    },
    {
      name: "Bitcoin Cash",
      symbol: "BCH",
      price: "$245.67",
      change24h: -4.88,
      marketCap: "$4.8B",
      volume: "$198M"
    }
  ]

  const trending = [
    {
      name: "Ethereum",
      symbol: "ETH",
      price: "$2,845.80",
      change24h: 3.25,
      marketCap: "$342.1B", 
      volume: "$8.9B"
    },
    {
      name: "Bitcoin",
      symbol: "BTC",
      price: "$42,350.00",
      change24h: 2.15,
      marketCap: "$829.5B",
      volume: "$15.2B"
    },
    {
      name: "Binance Coin",
      symbol: "BNB",
      price: "$308.45",
      change24h: 1.89,
      marketCap: "$47.2B",
      volume: "$892M"
    },
    {
      name: "XRP",
      symbol: "XRP",
      price: "$0.615",
      change24h: 1.34,
      marketCap: "$33.4B",
      volume: "$1.1B"
    }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Top Movers</h1>
          <p className="text-muted-foreground">Cryptocurrency dengan pergerakan harga paling signifikan dalam 24 jam terakhir</p>
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Market Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-card transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Biggest Gainer</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">ADA</div>
            <div className="flex items-center space-x-1 text-sm">
              <span className="text-success">+15.32%</span>
              <span className="text-muted-foreground">$0.485</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-card transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Biggest Loser</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">SOL</div>
            <div className="flex items-center space-x-1 text-sm">
              <span className="text-destructive">-8.47%</span>
              <span className="text-muted-foreground">$98.45</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-card transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Active</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">BTC</div>
            <div className="flex items-center space-x-1 text-sm">
              <span className="text-muted-foreground">Volume:</span>
              <span className="text-foreground">$15.2B</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different categories */}
      <Tabs defaultValue="gainers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="gainers" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Top Gainers</span>
          </TabsTrigger>
          <TabsTrigger value="losers" className="flex items-center space-x-2">
            <TrendingDown className="h-4 w-4" />
            <span>Top Losers</span>
          </TabsTrigger>
          <TabsTrigger value="trending" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Trending</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gainers" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Top Gainers (24h)</h2>
            <Badge variant="secondary" className="bg-success-light text-success">
              <TrendingUp className="h-3 w-3 mr-1" />
              4 coins up {'>'}5%
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {gainers.map((crypto, index) => (
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
        </TabsContent>

        <TabsContent value="losers" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Top Losers (24h)</h2>
            <Badge variant="secondary" className="bg-destructive-light text-destructive">
              <TrendingDown className="h-3 w-3 mr-1" />
              4 coins down {'>'}4%
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {losers.map((crypto, index) => (
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
        </TabsContent>

        <TabsContent value="trending" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Trending Cryptocurrencies</h2>
            <Badge variant="secondary" className="bg-accent text-accent-foreground">
              Most searched
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trending.map((crypto, index) => (
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
        </TabsContent>
      </Tabs>

      {/* Additional Market Insights */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Market Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Momentum Analysis</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Coins in green:</span>
                  <span className="text-success font-medium">67%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Coins in red:</span>
                  <span className="text-destructive font-medium">33%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Market sentiment:</span>
                  <Badge variant="secondary" className="bg-success-light text-success">Bullish</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Volume Analysis</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total volume 24h:</span>
                  <span className="font-medium">$68.2B</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Volume change:</span>
                  <span className="text-destructive font-medium">-5.3%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Top by volume:</span>
                  <span className="font-medium">BTC</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}