'use client';

import { useMemo } from 'react'; // Import useMemo
import { useQuery } from '@tanstack/react-query'; // Import useQuery
// Import the NewsArticleCard component and its type
import NewsArticleCard, { NewsArticle as ArticleCardType } from '@/components/NewsArticleCard';

interface Article {
  uuid: string;
  title: string;
  description: string;
  url: string;
  image_url: string | null; // Align with NewsArticleCard's image_url type
  published_at: string; // The original string from API
  publishedDateObj?: Date; // Parsed Date object for sorting
  source: string;
  // Add any other relevant fields from the API response
}

// Define the structure of the API response from MarketAux
interface MarketAuxResponse {
  data: Article[]; // Expect 'data' to be an array of Article
  // meta?: any; // Optional: if MarketAux includes metadata
  // errors?: any[]; // Optional: if MarketAux includes error details
}

// TODO: Replace YOUR_MARKETAUX_API_KEY_PLACEHOLDER with a real API key
const apiKey = 'YOUR_MARKETAUX_API_KEY_PLACEHOLDER'; // IMPORTANT: This needs to be replaced with a real key for the API to work.
const countries = 'us,gb,ca'; // For English news from major markets

// Define the asynchronous fetch function for TanStack Query
const fetchFinancialNews = async (): Promise<Article[]> => {
  const apiUrl = `https://api.marketaux.com/v1/news/all?api_token=${apiKey}&countries=${countries}&language=en`;
  
  const response = await fetch(apiUrl);
  if (!response.ok) {
    let errorMessage = `Error: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      // MarketAux specific error structure, adjust if necessary
      if (errorData && errorData.errors && errorData.errors.length > 0 && errorData.errors[0].message) {
        errorMessage = errorData.errors[0].message;
      } else if (errorData && errorData.message) {
        errorMessage = errorData.message;
      }
    } catch (_parseError) { // eslint-disable-line @typescript-eslint/no-unused-vars
      // Ignore if error response is not JSON or cannot be parsed
    }
    throw new Error(errorMessage);
  }

  const data: MarketAuxResponse = await response.json();
  
  // Ensure data.data exists and is an array, otherwise return empty array or throw specific error
  if (data && Array.isArray(data.data)) {
    return data.data; // Return only the array of articles
  } else {
    console.warn('No articles found or unexpected API response structure:', data);
    return []; // Or throw new Error('Unexpected API response structure');
  }
};


const FinancialNewsPage = () => {
  const { 
    data: rawArticles, 
    isLoading, 
    isError, 
    error 
  } = useQuery<Article[], Error>({ // Specify types for data and error
    queryKey: ['financialNews', countries], // Query key includes dependencies like countries
    queryFn: fetchFinancialNews,
    // staleTime and gcTime (cacheTime in v4) can be configured here or in QueryClient defaults
  });

  // Process and sort articles using useMemo
  const sortedArticles = useMemo(() => {
    if (!rawArticles) return [];

    return rawArticles
      .map(article => ({
        ...article,
        publishedDateObj: new Date(article.published_at)
      }))
      .filter(article => article.publishedDateObj && !isNaN(article.publishedDateObj.getTime()))
      .sort((a, b) => {
        if (!a.publishedDateObj || !b.publishedDateObj) return 0;
        return a.publishedDateObj.getTime() - b.publishedDateObj.getTime();
      });
  }, [rawArticles]);

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-gray-500">Loading news...</p>
        {/* Optional: Add a spinner here */}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-red-500">Error fetching news: {error?.message || 'An unknown error occurred'}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
          Financial News Headlines
        </h1>
        <h2 className="text-lg md:text-xl text-gray-600">
          Showing oldest articles first
        </h2>
      </header>
      
      {sortedArticles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-stretch">
          {sortedArticles.map((article) => (
            <NewsArticleCard article={article as ArticleCardType} key={article.uuid} />
          ))}
        </div>
      )}
      
      {sortedArticles.length === 0 && !isLoading && !isError && (
        <div className="text-center text-gray-500 mt-12">
          <p className="text-2xl">No news articles found at the moment.</p>
          <p>Try adjusting your search criteria or check back later.</p>
        </div>
      )}
    </div>
  );
};

export default FinancialNewsPage;
