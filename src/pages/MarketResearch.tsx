import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useSearchCrypto } from '@/hooks/useCryptoData'
import { Search, TrendingUp, TrendingDown, Plus, Star } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'

export default function MarketResearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const { searchResults, loading, searchCrypto } = useSearchCrypto()
  const { user } = useAuth()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      searchCrypto(searchQuery.trim())
    }
  }

  const addToWatchlist = async (crypto: any) => {
    if (!user) {
      toast.error('Please sign in to add to watchlist')
      return
    }

    try {
      const { error } = await supabase
        .from('watchlist')
        .insert([{
          user_id: user.id,
          crypto_id: crypto.id.toString(),
          crypto_symbol: crypto.symbol,
          crypto_name: crypto.name
        }])

      if (error) {
        if (error.code === '23505') {
          toast.error('Already in your watchlist')
        } else {
          throw error
        }
      } else {
        toast.success(`${crypto.symbol} added to watchlist!`)
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error)
      toast.error('Failed to add to watchlist')
    }
  }

  const addToPortfolio = async (crypto: any) => {
    if (!user) {
      toast.error('Please sign in to add to portfolio')
      return
    }

    try {
      const { error } = await supabase
        .from('portfolio')
        .insert([{
          user_id: user.id,
          crypto_id: crypto.id.toString(),
          crypto_symbol: crypto.symbol,
          crypto_name: crypto.name,
          amount: 1, // Default amount
          purchase_price: 0, // Default price
          purchase_date: new Date().toISOString()
        }])

      if (error) throw error

      toast.success(`${crypto.symbol} added to portfolio!`)
    } catch (error) {
      console.error('Error adding to portfolio:', error)
      toast.error('Failed to add to portfolio')
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Market Research</h1>
        <p className="text-muted-foreground">Search and discover cryptocurrencies in real-time</p>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Cryptocurrencies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Search by symbol (e.g., BTC, ETH, ADA)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {searchResults.map((crypto) => (
                <div
                  key={crypto.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {crypto.symbol.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold">{crypto.name}</div>
                      <div className="text-sm text-muted-foreground">{crypto.symbol}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-semibold">
                        Search to see prices
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Real-time data
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addToWatchlist(crypto)}
                      >
                        <Star className="h-4 w-4 mr-1" />
                        Watch
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => addToPortfolio(crypto)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Search Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Popular Searches:</h4>
              <div className="flex flex-wrap gap-2">
                {['BTC', 'ETH', 'ADA', 'SOL', 'DOT', 'MATIC'].map((symbol) => (
                  <Badge
                    key={symbol}
                    variant="outline"
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => {
                      setSearchQuery(symbol)
                      searchCrypto(symbol)
                    }}
                  >
                    {symbol}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">How to Search:</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• Use cryptocurrency symbols (BTC, ETH, etc.)</li>
                <li>• Search is case-insensitive</li>
                <li>• Results show real-time market data</li>
                <li>• Click to add to portfolio or watchlist</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}