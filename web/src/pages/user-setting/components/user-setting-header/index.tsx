import Spotlight from '@/components/spotlight';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PropsWithChildren } from 'react';

export function Title({ children }: PropsWithChildren) {
  return <span className="font-bold text-xl">{children}</span>;
}

type ProfileSettingWrapperCardProps = {
  header: React.ReactNode;
} & PropsWithChildren;

export function ProfileSettingWrapperCard({
  header,
  children,
}: ProfileSettingWrapperCardProps) {
  return (
    <Card
      as="article"
      className="relative w-full h-full bg-bg-base border-0 shadow-none rounded-3xl flex flex-col overflow-hidden"
    >
      <CardHeader className="flex-0 p-5">
        {header}
      </CardHeader>

      <CardContent className="flex-1 h-0 p-0">{children}</CardContent>

      <Spotlight />
    </Card>
  );
}
