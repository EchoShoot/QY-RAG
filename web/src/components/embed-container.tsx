import { PropsWithChildren } from 'react';
import { RAGFlowAvatar } from './ragflow-avatar';

type EmbedContainerProps = {
  title: string;
  avatar?: string;
} & PropsWithChildren;

export function EmbedContainer({
  title,
  avatar,
  children,
}: EmbedContainerProps) {
  return (
    <section className="flex min-h-dvh bg-app-page p-0 md:p-3">
      <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-bg-base md:rounded-3xl">
        <div className="relative flex shrink-0 items-center justify-between px-4 py-3 md:px-5 md:py-4">
          <div className="absolute left-1/2 flex min-w-0 max-w-[70%] -translate-x-1/2 items-center gap-3 md:static md:left-auto md:max-w-none md:translate-x-0">
            <RAGFlowAvatar
              avatar={avatar}
              name={title}
              isPerson
              className="size-9 rounded-2xl md:size-11"
            />
            <div className="truncate text-base font-medium text-text-primary md:text-lg">
              {title}
            </div>
          </div>
          <div className="flex md:hidden w-10" aria-hidden="true" />
          <div className="flex w-10" aria-hidden="true" />
        </div>
        {children}
      </div>
    </section>
  );
}
