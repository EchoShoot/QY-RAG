import { cn } from '@/lib/utils';
import { PropsWithChildren } from 'react';

type CardContainerProps = { className?: string } & PropsWithChildren;

export function CardContainer({ children, className }: CardContainerProps) {
  return (
    <div
      className={cn(
        'grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 auto-rows-[172px] content-start',
        className,
      )}
    >
      {children}
    </div>
  );
}
