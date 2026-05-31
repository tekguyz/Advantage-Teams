// hooks/use-survey-dispatch.ts
'use client';

import { useState } from 'react';

interface UseSurveyDispatchOpts {
  onLogMessage: (msg: string) => void;
  refreshState: () => Promise<void>;
}

export function useSurveyDispatch({
  onLogMessage,
  refreshState,
}: UseSurveyDispatchOpts) {
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [successBannerMsg, setSuccessBannerMsg] = useState<string | null>(null);
  const [errorBannerMsg, setErrorBannerMsg] = useState<string | null>(null);

  // Manual override action labeled "Force Batch Dispatch Now"
  const handleForceBatchDispatch = async () => {
    setIsDispatching(true);
    setSuccessBannerMsg(null);
    setErrorBannerMsg(null);
    onLogMessage("Initiating manual trigger bypass: Force Outbound Batch Dispatch sequence triggered.");

    try {
      const res = await fetch('/api/surveys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'dispatch' }),
      });

      const data = await res.json();
      if (res.ok && data.status === 'success') {
        onLogMessage(`[BATCH FLUSHED] ${data.message}`);
        setSuccessBannerMsg(data.message);
        
        // Revalidate the list instantly
        await refreshState();
        
        setTimeout(() => {
          setSuccessBannerMsg(null);
        }, 5000);
      } else {
        const errMessage = data.message || "Manual survey batch dispatch failed.";
        setErrorBannerMsg(errMessage);
        onLogMessage(`[BATCH FAILURE] Server aborted dispatch: ${errMessage}`);
      }
    } catch (err: any) {
      const errMessage = err.message || "Network transaction failure.";
      setErrorBannerMsg(errMessage);
      onLogMessage(`[BATCH CRITICAL ERROR] Pipeline failed: ${errMessage}`);
    } finally {
      setIsDispatching(false);
    }
  };

  return {
    isDispatching,
    successBannerMsg,
    setSuccessBannerMsg,
    errorBannerMsg,
    setErrorBannerMsg,
    handleForceBatchDispatch,
  };
}
