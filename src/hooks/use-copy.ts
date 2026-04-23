import { useCallback, useEffect, useState } from 'react';
import { copyText } from '@/lib/provider-registry';

export function useCopy(resetMs = 2200) {
  const [feedback, setFeedback] = useState<{ key: string; message: string }>({ key: '', message: '' });

  useEffect(() => {
    if (!feedback.key) return;
    const timer = window.setTimeout(() => setFeedback({ key: '', message: '' }), resetMs);
    return () => window.clearTimeout(timer);
  }, [feedback, resetMs]);

  const copy = useCallback(async (text: string, key: string) => {
    const ok = await copyText(text);
    setFeedback({ key, message: ok ? '已复制' : '复制失败，请手动复制' });
  }, []);

  return { feedback, copy };
}
