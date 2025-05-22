'use client';

import React from 'react';

// Define the structure of a news article based on MarketAux API
// This should ideally be in a shared types file if used in multiple places.
export interface NewsArticle {
  uuid: string;
  title: string;
  description: string;
  url: string;
  image_url: string | null; // Image URL can be null
  published_at: string;    // Date string from API
  source: string;
  // snippet: string; // MarketAux uses description, snippet might be redundant or from a different field
  // language: string;
  // relevance_score: number | null;
  // entities: any[]; // Define more specific types if used
  // similar: any[]; // Define more specific types if used
}

interface NewsArticleCardProps {
  article: NewsArticle;
}

const NewsArticleCard: React.FC<NewsArticleCardProps> = ({ article }) => {
  // Function to format the date string
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        // second: '2-digit', // Optional: include seconds
        // timeZoneName: 'short' // Optional: include timezone
      });
    } catch (e) {
      console.error("Failed to parse date:", dateString, e);
      return "Invalid date"; // Fallback for invalid date strings
    }
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Hide the image or replace with a placeholder if it fails to load
    event.currentTarget.style.display = 'none';
    // Optionally, you can set a placeholder background or text on the parent div
  };

  return (
    // Removed m-4, grid gap will handle spacing. Added flex flex-col to ensure footer (Read More) stays at bottom if description is short.
    <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 ease-in-out w-full flex flex-col">
      {article.image_url ? (
        <img
          src={article.image_url}
          alt={`Image for ${article.title}`}
          className="w-full h-48 object-cover"
          onError={handleImageError}
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
          No Image Available
        </div>
      )}
      {/* Added flex-grow to make this section take available space, pushing button to bottom */}
      <div className="p-6 flex-grow"> 
        <h2 className="text-xl lg:text-2xl font-bold mb-2 text-gray-800">{article.title}</h2>
        <div className="text-xs lg:text-sm text-gray-600 mb-3">
          <span>Source: {article.source}</span>
          <span className="mx-1">|</span>
          <span>Published: {formatDate(article.published_at)}</span>
        </div>
        <p className="text-gray-700 mb-4 text-sm lg:text-base leading-relaxed">{article.description}</p>
      </div>
      {/* Ensure button is part of its own div for better layout control if needed, or stick to card padding */}
      <div className="p-6 pt-0"> {/* pt-0 to avoid double padding with the above div's p-6 */}
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-300"
        >
          Read More
        </a>
      </div>
    </div>
  );
};

export default NewsArticleCard;
