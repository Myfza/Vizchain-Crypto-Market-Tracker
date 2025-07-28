import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/ThemeToggle"
import { 
  BarChart3, 
  TrendingUp, 
  Shield, 
  Zap, 
  Globe, 
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  Clock
} from "lucide-react"
import { Link } from "react-router-dom"

export default function Landing() {
  const features = [
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Dapatkan data pasar crypto terkini dengan update setiap detik"
    },
    {
      icon: TrendingUp,
      title: "Portfolio Tracking",
      description: "Lacak performa investasi Anda dengan detail lengkap"
    },
    {
      icon: Shield,
      title: "Data Akurat & Aman",
      description: "Informasi terverifikasi dari sumber terpercaya"
    },
    {
      icon: Zap,
      title: "Interface Cepat",
      description: "Akses instant ke semua fitur dengan UI yang responsif"
    }
  ]

  const benefits = [
    "Update harga realtime dari 5000+ cryptocurrency",
    "Portfolio tracker dengan analisis mendalam", 
    "Watchlist personal untuk monitoring favorit",
    "News & insights dari ahli pasar crypto",
    "Interface mobile-friendly dan desktop"
  ]

  const stats = [
    { value: "5,000+", label: "Cryptocurrencies" },
    { value: "24/7", label: "Real-time Updates" },
    { value: "99.9%", label: "Uptime Guarantee" },
    { value: "150K+", label: "Active Users" }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl">CryptoTracker</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link to="/dashboard">
              <Button variant="outline">Masuk</Button>
            </Link>
            <Link to="/dashboard">
              <Button className="bg-gradient-primary hover:opacity-90">
                Mulai Gratis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <Badge variant="secondary" className="mb-6 bg-accent text-accent-foreground">
            <Star className="h-3 w-3 mr-1" />
            Platform #1 untuk Tracking Crypto
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Pantau Market Crypto Anda,
            <br />Realtime dan Akurat
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Akses data terkini, lacak portfolio, dan dapatkan insight pasar dalam satu tempat. 
            Dirancang khusus untuk investor modern yang menghargai kecepatan dan akurasi.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
            <Link to="/dashboard">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-white px-8 py-4 text-lg">
                Mulai Sekarang Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
              Lihat Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Fitur Unggulan untuk Trader Modern
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk memantau dan menganalisis pasar crypto
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-card transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Mengapa Memilih CryptoTracker?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Platform komprehensif yang dirancang khusus untuk kebutuhan trader dan investor crypto Indonesia.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link to="/dashboard">
                  <Button size="lg" className="bg-gradient-primary hover:opacity-90">
                    Mulai Tracking Sekarang
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <Card className="shadow-glow">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Portfolio Overview</h3>
                      <Badge variant="secondary" className="bg-success-light text-success">
                        +12.5%
                      </Badge>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                            B
                          </div>
                          <div>
                            <div className="font-medium">Bitcoin</div>
                            <div className="text-sm text-muted-foreground">BTC</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">$42,350</div>
                          <div className="text-sm text-success">+2.1%</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                            E
                          </div>
                          <div>
                            <div className="font-medium">Ethereum</div>
                            <div className="text-sm text-muted-foreground">ETH</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">$2,845</div>
                          <div className="text-sm text-destructive">-0.8%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-primary text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Siap Memulai Journey Trading Anda?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Bergabung dengan ribuan trader yang sudah mempercayai platform kami
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/dashboard">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
                Mulai Gratis Sekarang
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center space-x-2 text-white/80">
              <Clock className="h-4 w-4" />
              <span>Setup dalam 2 menit</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-lg">CryptoTracker</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Platform terpercaya untuk monitoring dan analisis pasar cryptocurrency.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Dashboard</div>
                <div>Portfolio Tracker</div>
                <div>Market Analysis</div>
                <div>News & Insights</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Perusahaan</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Tentang Kami</div>
                <div>Karir</div>
                <div>Blog</div>
                <div>Kontak</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Privacy Policy</div>
                <div>Terms of Service</div>
                <div>Disclaimer</div>
                <div>Security</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground text-sm">
            © 2024 CryptoTracker. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}