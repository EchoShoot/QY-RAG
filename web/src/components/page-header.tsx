import { PropsWithChildren } from 'react';

export function PageHeader({ children }: PropsWithChildren) {
  return (
    <header className="flex justify-between items-center px-5 py-3">
      {children}
    </header>
  );
}
