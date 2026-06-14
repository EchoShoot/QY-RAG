import { isEmpty } from 'lodash';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  LucideFolderOpen,
  LucideLogs,
  LucideSettings,
  LucideTextSearch,
} from 'lucide-react';

import { IconFontFill } from '@/components/icon-font';
import { RAGFlowAvatar } from '@/components/ragflow-avatar';
import { Button } from '@/components/ui/button';
import { useSecondPathName } from '@/hooks/route-hook';
import { useFetchKnowledgeGraph } from '@/hooks/use-knowledge-request';
import { cn, formatBytes } from '@/lib/utils';
import { Routes } from '@/routes';
import { formatPureDate } from '@/utils/date';

import { IDataset } from '@/interfaces/database/dataset';
import { useParams } from 'react-router';

type PropType = {
  refreshCount?: number;
  dataset: IDataset;
};

export function SideBar({ dataset: data }: PropType) {
  const pathName = useSecondPathName();
  const { id } = useParams();
  const { data: routerData } = useFetchKnowledgeGraph();
  const { t } = useTranslation();

  const items = useMemo(() => {
    const list = [
      {
        icon: <LucideFolderOpen className="size-[1em]" />,
        label: t(`knowledgeDetails.subbarFiles`),
        key: Routes.Files,
      },
      {
        icon: <LucideTextSearch className="size-[1em]" />,
        label: t(`knowledgeDetails.testing`),
        key: Routes.DatasetTesting,
      },
      {
        icon: <LucideLogs className="size-[1em]" />,
        label: t(`knowledgeDetails.overview`),
        key: Routes.DataSetOverview,
      },
      {
        icon: <LucideSettings className="size-[1em]" />,
        label: t(`knowledgeDetails.configuration`),
        key: Routes.DataSetSetting,
      },
    ];

    if (!isEmpty(routerData?.graph)) {
      list.push({
        icon: <IconFontFill name="knowledgegraph" className="size-[1em]" />,
        label: t(`knowledgeDetails.knowledgeGraph`),
        key: Routes.KnowledgeGraph,
      });
    }

    return list;
  }, [t, routerData]);

  return (
    <aside className="flex flex-col w-64 bg-bg-component rounded-3xl shrink-0">
      <header className="px-4 pt-4 pb-3 flex flex-col items-center gap-3">
        <RAGFlowAvatar
          avatar={data.avatar}
          name={data.name}
          className="size-14 rounded-2xl"
        />
        <div className="text-center space-y-0.5 w-full overflow-hidden">
          <h3 className="text-sm font-semibold truncate text-text-primary px-1">
            {data.name}
          </h3>
          <div className="text-xs text-text-secondary overflow-hidden px-1">
            <div className="flex justify-center gap-2">
              <span>{data.document_count} {t('knowledgeDetails.files')}</span>
              <span>{data.size ? formatBytes(data.size) : ''}</span>
            </div>
            <div>{t('knowledgeDetails.created')} {formatPureDate(data.create_time)}</div>
          </div>
        </div>
      </header>

      <nav className="px-3 pt-1 pb-3 overflow-y-auto">
        <ul className="space-y-1">
          {items.map((item) => {
            const active = '/' + pathName === item.key;

            return (
              <li key={item.key}>
                <Button
                  asLink
                  block
                  variant="ghost"
                  className={cn(
                    'justify-start gap-2.5 px-3 relative h-9 text-sm font-medium rounded-2xl',
                    active
                      ? 'bg-accent-primary text-bg-base hover:bg-accent-primary'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-card',
                  )}
                  to={`${Routes.DatasetBase}${item.key}/${id}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
