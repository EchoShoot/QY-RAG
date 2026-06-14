import { RAGFlowAvatar } from '@/components/ragflow-avatar';
import { Button } from '@/components/ui/button';
import { useSecondPathName } from '@/hooks/route-hook';
import { cn } from '@/lib/utils';
import { Routes } from '@/routes';
import { formatPureDate } from '@/utils/date';
import { MemoryStick, Settings } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchMemoryBaseConfiguration } from '../hooks/use-memory-setting';
import { useHandleMenuClick } from './hooks';

export function SideBar() {
  const pathName = useSecondPathName();
  const { handleMenuClick } = useHandleMenuClick();
  // refreshCount: be for avatar img sync update on top left
  const { data } = useFetchMemoryBaseConfiguration();
  const { t } = useTranslation();

  const items = useMemo(() => {
    const list = [
      {
        icon: <MemoryStick className="size-4" />,
        label: t(`memory.sideBar.messages`),
        key: Routes.MemoryMessage,
      },
      {
        icon: <Settings className="size-4" />,
        label: t(`memory.sideBar.configuration`),
        key: Routes.MemorySetting,
      },
    ];
    return list;
  }, [t]);

  return (
    <aside className="relative p-4 space-y-6 bg-bg-component rounded-3xl w-64 shrink-0">
      <div className="flex flex-col items-center gap-3 pt-2">
        <RAGFlowAvatar
          avatar={data.avatar}
          name={data.name}
          className="size-14 rounded-2xl"
        />
        <div className="text-center space-y-0.5 overflow-hidden w-full">
          <h3 className="text-sm font-semibold truncate text-text-primary px-1">
            {data.name}
          </h3>
          <div className="text-xs text-text-secondary truncate px-1">
            {data.description}
          </div>
          <div className="text-xs text-text-secondary">
            {t('knowledgeDetails.created')} {formatPureDate(data.create_time)}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {items.map((item, itemIdx) => {
          const active = '/' + pathName === item.key;
          return (
            <Button
              key={itemIdx}
              variant="ghost"
              className={cn(
                'w-full justify-start gap-2.5 px-3 h-9 text-sm font-medium rounded-2xl',
                active
                  ? 'bg-accent-primary text-bg-base hover:bg-accent-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-card',
              )}
              onClick={handleMenuClick(item.key)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Button>
          );
        })}
      </div>
    </aside>
  );
}
