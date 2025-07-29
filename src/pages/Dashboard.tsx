import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CryptoCard } from "@/components/CryptoCard"
import { CryptoDashboard } from "@/components/CryptoDashboard"
import { useCryptoData } from "@/hooks/useCryptoData"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  Activity,
  Plus,
  Search
} from "lucide-react"
import { useNavigate } from "react-router-dom"

interface PortfolioItem {
  id: string
  crypto_id: string
  crypto_symbol: string
  crypto_name: string
  amount: number
  purchase_price: number
  purchase_date: string
}

export default function Dashboard() {
  const { cryptoData, loading } = useCryptoData()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [portfolioLoading, setPortfolioLoading] = useState(true)
  const [addPortfolioOpen, setAddPortfolioOpen] = useState(false)
  const [addPortfolioForm, setAddPortfolioForm] = useState({
    crypto_id: '',
    crypto_symbol: '',
    crypto_name: '',
    amount: '',
    purchase_price: ''
  })

  // Fetch portfolio data
  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!user) return
      
      try {
        const { data, error } = await supabase
          .from('portfolio')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setPortfolio(data || [])
      } catch (error) {
        console.error('Error fetching portfolio:', error)
      } finally {
        setPortfolioLoading(false)
      }
    }

    fetchPortfolio()
  }, [user])

  // Calculate portfolio stats
  const portfolioStats = portfolio.reduce((acc, item) => {
    const currentCrypto = cryptoData.find(c => c.id.toString() === item.crypto_id)
    if (currentCrypto) {
      const currentValue = item.amount * currentCrypto.price
      const purchaseValue = item.amount * item.purchase_price
      const profit = currentValue - purchaseValue
      
      acc.totalValue += currentValue
      acc.totalProfit += profit
      acc.holdings += 1
    }
    return acc
  }, { totalValue: 0, totalProfit: 0, holdings: 0 })

  const portfolioChangePercent = portfolioStats.totalValue > 0 
    ? (portfolioStats.totalProfit / (portfolioStats.totalValue - portfolioStats.totalProfit)) * 100 
    : 0

  const handleAddToPortfolio = async (crypto: any) => {
    setAddPortfolioForm({
      crypto_id: crypto.id.toString(),
      crypto_symbol: crypto.symbol,
      crypto_name: crypto.name,
      amount: '',
      purchase_price: crypto.price.toString()
    })
    setAddPortfolioOpen(true)
  }

  const submitAddToPortfolio = async () => {
    if (!user || !addPortfolioForm.amount || !addPortfolioForm.purchase_price) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      const { error } = await supabase
        .from('portfolio')
        .insert([{
          user_id: user.id,
          crypto_id: addPortfolioForm.crypto_id,
          crypto_symbol: addPortfolioForm.crypto_symbol,
          crypto_name: addPortfolioForm.crypto_name,
          amount: parseFloat(addPortfolioForm.amount),
          purchase_price: parseFloat(addPortfolioForm.purchase_price),
          purchase_date: new Date().toISOString()
        }])

      if (error) throw error

      toast.success('Added to portfolio successfully!')
      setAddPortfolioOpen(false)
      setAddPortfolioForm({ crypto_id: '', crypto_symbol: '', crypto_name: '', amount: '', purchase_price: '' })
      
      // Refresh portfolio
      const { data } = await supabase
        .from('portfolio')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      setPortfolio(data || [])
    } catch (error) {
      console.error('Error adding to portfolio:', error)
      toast.error('Failed to add to portfolio')
    }
  }

  if (loading || portfolioLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <CryptoDashboard />
        </div>
      </div>
    )
  }

  const topCryptos = cryptoData.slice(0, 8)
  const bestPerformer = portfolio.reduce((best, item) => {
    const currentCrypto = cryptoData.find(c => c.id.toString() === item.crypto_id)
    if (currentCrypto) {
      const changePercent = ((currentCrypto.price - item.purchase_price) / item.purchase_price) * 100
      if (!best || changePercent > best.change) {
        return { symbol: item.crypto_symbol, change: changePercent }
      }
    }
    return best
  }, null as { symbol: string; change: number } | null)

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Monitor your crypto performance today.</p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90" onClick={() => navigate('/watchlist')}>
          <Plus className="h-4 w-4 mr-2" />
          Add to Watchlist
        </Button>
      </div>

      {/* Real-time Crypto Dashboard */}
      <CryptoDashboard />

      {/* Portfolio Overview */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Portfolio Overview</CardTitle>
            <Badge 
              variant={portfolioChangePercent >= 0 ? "default" : "destructive"}
              className={`flex items-center space-x-1 ${
                portfolioChangePercent >= 0 
                  ? "bg-success-light text-success border-success/20" 
                  : "bg-destructive-light text-destructive border-destructive/20"
              }`}
            >
              {portfolioChangePercent >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span>{portfolioChangePercent >= 0 ? '+' : ''}{portfolioChangePercent.toFixed(2)}%</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="text-3xl font-bold text-foreground">
                ${portfolioStats.totalValue.toLocaleString('en-US', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <span className={portfolioStats.totalProfit >= 0 ? "text-success" : "text-destructive"}>
                  {portfolioStats.totalProfit >= 0 ? '+' : ''}${Math.abs(portfolioStats.totalProfit).toLocaleString('en-US', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </span>
                <span className="text-muted-foreground">total</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Total Holdings</div>
                <div className="text-lg font-semibold">{portfolioStats.holdings} Assets</div>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Best Performer</div>
                <div className="text-lg font-semibold text-success">
                  {bestPerformer ? `${bestPerformer.symbol} +${bestPerformer.change.toFixed(2)}%` : 'No holdings'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Cryptocurrencies */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Top Cryptocurrencies</h2>
          <Button variant="outline" onClick={() => navigate('/top-movers')}>View All</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topCryptos.map((crypto) => (
            <div key={crypto.id} className="relative">
              <CryptoCard
                name={crypto.name}
                symbol={crypto.symbol}
                price={`$${crypto.price.toLocaleString('en-US', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 6 
                })}`}
                change24h={crypto.change24h}
                marketCap={`$${(crypto.marketCap / 1e9).toFixed(2)}B`}
                volume={`$${(crypto.volume / 1e9).toFixed(2)}B`}
                icon={crypto.icon}
              />
              <Button
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0"
                onClick={() => handleAddToPortfolio(crypto)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
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
            <Dialog open={addPortfolioOpen} onOpenChange={setAddPortfolioOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center space-y-2">
                  <Plus className="h-6 w-6" />
                  <span>Add to Portfolio</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add to Portfolio</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Cryptocurrency</Label>
                    <Input value={`${addPortfolioForm.crypto_name} (${addPortfolioForm.crypto_symbol})`} disabled />
                  </div>
                  <div>
                    <Label>Amount</Label>
                    <Input 
                      type="number" 
                      placeholder="0.00"
                      value={addPortfolioForm.amount}
                      onChange={(e) => setAddPortfolioForm(prev => ({ ...prev, amount: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Purchase Price (USD)</Label>
                    <Input 
                      type="number" 
                      placeholder="0.00"
                      value={addPortfolioForm.purchase_price}
                      onChange={(e) => setAddPortfolioForm(prev => ({ ...prev, purchase_price: e.target.value }))}
                    />
                  </div>
                  <Button onClick={submitAddToPortfolio} className="w-full">
                    Add to Portfolio
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center space-y-2" onClick={() => navigate('/analytics')}>
              <TrendingUp className="h-6 w-6" />
              <span>View Analytics</span>
            </Button>
            
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center space-y-2" onClick={() => navigate('/market-research')}>
              <Search className="h-6 w-6" />
              <span>Market Research</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}