import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Test helper: wraps hooks in a QueryClientProvider with retries disabled so
// error paths resolve immediately and tests stay fast/deterministic.
export function createQueryWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return { wrapper, queryClient };
}
