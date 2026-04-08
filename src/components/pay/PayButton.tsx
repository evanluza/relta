'use client';

import { useCallback, useState } from 'react';
import { useAccount } from 'wagmi';
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusLabel,
  TransactionStatusAction,
} from '@coinbase/onchainkit/transaction';
import { encodeFunctionData, parseUnits } from 'viem';
import { USDC_ADDRESS, USDC_ABI, USDC_DECIMALS, BASE_CHAIN_ID } from '@/lib/constants';
import type { ContractFunctionParameters } from 'viem';

interface PayButtonProps {
  amount: number;
  recipientAddress: `0x${string}`;
  linkId: string;
  onSuccess: (result: { downloadUrl?: string }) => void;
}

export function PayButton({ amount, recipientAddress, linkId, onSuccess }: PayButtonProps) {
  const { address } = useAccount();
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');

  const calls = [
    {
      to: USDC_ADDRESS as `0x${string}`,
      data: encodeFunctionData({
        abi: USDC_ABI,
        functionName: 'transfer',
        args: [recipientAddress, parseUnits(amount.toString(), USDC_DECIMALS)],
      }),
    },
  ];

  const handleSuccess = useCallback(async (response: { transactionReceipts: Array<{ transactionHash: string }> }) => {
    const txHash = response.transactionReceipts?.[0]?.transactionHash;
    if (!txHash) return;

    setVerifying(true);
    setError('');

    try {
      const res = await fetch('/api/transactions/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          txHash,
          linkId,
          buyerWallet: address,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onSuccess({ downloadUrl: data.downloadUrl });
      } else {
        setError(data.error || 'Verification failed');
      }
    } catch {
      setError('Failed to verify transaction');
    } finally {
      setVerifying(false);
    }
  }, [address, linkId, onSuccess]);

  if (amount <= 0) {
    return <p className="text-center text-muted text-sm">Enter an amount to continue</p>;
  }

  return (
    <div>
      {verifying ? (
        <div className="flex items-center justify-center gap-2 py-3">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-muted">Verifying payment...</span>
        </div>
      ) : (
        <Transaction
          chainId={BASE_CHAIN_ID}
          calls={calls as unknown as ContractFunctionParameters[]}
          onSuccess={handleSuccess}
        >
          <TransactionButton text={`Pay $${amount.toFixed(2)} USDC`} />
          <TransactionStatus>
            <TransactionStatusLabel />
            <TransactionStatusAction />
          </TransactionStatus>
        </Transaction>
      )}
      {error && <p className="text-danger text-sm text-center mt-2">{error}</p>}
    </div>
  );
}
