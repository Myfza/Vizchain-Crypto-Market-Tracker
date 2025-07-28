import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { limit = 20 } = await req.json()

    // Using CryptoPanic API for crypto news
    const response = await fetch(
      `https://cryptopanic.com/api/free/v1/posts/?auth_token=demo&public=true&kind=news&filter=hot&limit=${limit}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`CryptoPanic API error: ${response.status}`)
    }

    const data = await response.json()

    // Transform the data to match our expected format
    const transformedData = {
      results: data.results.map((article: any) => ({
        id: article.id,
        title: article.title,
        url: article.url,
        published_at: article.published_at,
        source: article.source?.title || 'Unknown',
        summary: article.title, // CryptoPanic doesn't provide summary in free tier
        currencies: article.currencies?.map((c: any) => c.code) || []
      }))
    }

    return new Response(
      JSON.stringify(transformedData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})