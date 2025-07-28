import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

interface CryptoCardProps {
  name: string
  symbol: string
  price: string
  change24h: number
  marketCap: string
  volume: string
  icon?: string
}

export function CryptoCard({ name, symbol, price, change24h, marketCap, volume, icon }: CryptoCardProps) {
  const isPositive = change24h >= 0

  return (
    <Card className="hover:shadow-card transition-all duration-200 cursor-pointer group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
              {icon || symbol.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {name}
              </h3>
              <p className="text-sm text-muted-foreground uppercase">{symbol}</p>
            </div>
          </div>
          <Badge 
            variant={isPositive ? "default" : "destructive"}
            className={`flex items-center space-x-1 ${
              isPositive 
                ? "bg-success-light text-success border-success/20" 
                : "bg-destructive-light text-destructive border-destructive/20"
            }`}
          >
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span>{isPositive ? '+' : ''}{change24h.toFixed(2)}%</span>
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div>
            <p className="text-2xl font-bold text-foreground">{price}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Market Cap</p>
              <p className="font-medium text-foreground">{marketCap}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Volume 24h</p>
              <p className="font-medium text-foreground">{volume}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}