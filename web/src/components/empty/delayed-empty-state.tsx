import { cn } from '@/lib/utils';
import type { Key, PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';

type DelayedEmptyStateProps = PropsWithChildren<{
  className?: string;
  delayMs?: number;
  resetKey?: Key;
}>;

export function DelayedEmptyState({
  children,
  className,
  delayMs = 300,
  resetKey,
}: DelayedEmptyStateProps) {
  const [visible, setVisible] = useState(delayMs <= 0);

  useEffect(() => {
    setVisible(false);
    const timer = window.setTimeout(() => {
      setVisible(true);
    }, delayMs);

    return () => window.clearTimeout(timer);
  }, [delayMs, resetKey]);

  if (!visible) {
    return null;
  }

  return (
    <div className={cn('empty-state-float-in', className)}>{children}</div>
  );
}
