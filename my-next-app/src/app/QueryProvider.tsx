'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a new QueryClient instance
// It's good practice to create it outside the component so it's not recreated on every render.
// Default options can be configured here if needed, e.g., for staleTime, cacheTime.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      // gcTime: 1000 * 60 * 10, // 10 minutes (gcTime was renamed to gcTime in v5, cacheTime in v4)
      // cacheTime: 1000 * 60 * 10, // For React Query v4, use cacheTime. For v5, it's gcTime.
      // Assuming v5 or later, gcTime is the correct term if we want to adjust garbage collection time.
      // However, the default gcTime is 5 minutes, so explicit setting might not be needed unless different.
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* React Query Devtools can be optionally added here for development */}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
};

export default QueryProvider;
