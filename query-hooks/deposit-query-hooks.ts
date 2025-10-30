// src/query-hooks/deposit-query-hooks.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import sendApiRequest from '@/api/send-api-request';

// Match your Nest route; adjust if your controller path differs
const postDeposit = (data: {
  txHash: string;
  expectedAmount: number; // integer cents
  token: 'USDT';
}) => sendApiRequest('deposit', 'POST', undefined, data); 

export function useDeposit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postDeposit,
    onSuccess: () => {
      // Invalidate things that should refresh when a deposit posts
      queryClient.invalidateQueries({ queryKey: ['transactions', 'all'] });
      queryClient.invalidateQueries({ queryKey: ['landingPageData'] });
    },
  });
}
