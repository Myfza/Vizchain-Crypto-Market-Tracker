import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Newspaper, ExternalLink, Clock, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface NewsArticle {
  id: string;
  title: string;
  url: string;
  published_at: string;
  source: string;
  summary: string;
  currencies: string[];
}

export function News() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('crypto-news', {
        body: { limit: 50 }
      });

      if (error) throw error;

      setNews(data.results || []);
    } catch (error: any) {
      toast.error('Failed to fetch news: ' + error.message);
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading crypto news...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Newspaper className="h-8 w-8 text-primary" />
            Crypto News & Insights
          </h1>
          <p className="text-muted-foreground">Stay updated with the latest cryptocurrency news</p>
        </div>
        <Button onClick={fetchNews} variant="outline">
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Market Headlines
            </CardTitle>
            <CardDescription>
              Latest cryptocurrency news and market updates
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {news.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No news available</p>
            <Button onClick={fetchNews} variant="outline">
              Try refreshing
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((article) => (
            <Card key={article.id} className="hover:shadow-card transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg line-clamp-3 group-hover:text-primary transition-colors">
                    {article.title}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatDate(article.published_at)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{article.source}</Badge>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => window.open(article.url, '_blank')}
                    className="hover:bg-primary hover:text-primary-foreground"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Read more
                  </Button>
                </div>
                
                {article.currencies && article.currencies.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {article.currencies.slice(0, 3).map((currency) => (
                      <Badge key={currency} variant="outline" className="text-xs">
                        {currency}
                      </Badge>
                    ))}
                    {article.currencies.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{article.currencies.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Market Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Get expert insights and technical analysis from crypto professionals
            </p>
            <Button variant="outline" className="w-full mt-4">
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">DeFi Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Stay informed about the latest developments in decentralized finance
            </p>
            <Button variant="outline" className="w-full mt-4">
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Regulatory News</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Track regulatory changes and their impact on the crypto market
            </p>
            <Button variant="outline" className="w-full mt-4">
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}