import { PageHeader } from '@/components/page-header';
import { PropsWithChildren } from 'react';

export function UserSettingBreadcrumb({ label }: { label: string }) {
  return (
    <PageHeader>
      <span className="text-sm font-medium text-text-primary">{label}</span>
    </PageHeader>
  );
}

export function UserSettingPageWrapper({ children }: PropsWithChildren) {
  return (
    <section className="size-full flex flex-col bg-app-page overflow-hidden">
      {children}
    </section>
  );
}
