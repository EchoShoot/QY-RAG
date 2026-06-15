import { RAGFlowAvatar } from '@/components/ragflow-avatar';
import { Card } from '@/components/ui/card';
import { formatDate } from '@/utils/date';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface IProps {
  data: {
    name: string;
    description?: string;
    avatar?: string;
    update_time?: string | number;
    release_time?: number;
  };
  onClick?: () => void;
  moreDropdown: React.ReactNode;
  sharedBadge?: ReactNode;
  icon?: React.ReactNode;
  testId?: string;
  showReleaseTime?: boolean;
  extra?: ReactNode;
}

function Time({ time }: { time: string | number | undefined }) {
  return (
    <span className="text-xs text-text-secondary whitespace-nowrap">
      {formatDate(time)}
    </span>
  );
}
export function HomeCard({
  data,
  onClick,
  moreDropdown,
  sharedBadge,
  icon,
  testId,
  showReleaseTime = false,
  extra,
}: IProps) {
  const { t } = useTranslation();

  return (
    <Card
      as="article"
      data-testid={testId}
      data-agent-name={data.name}
      onClick={() => onClick?.()}
      tabIndex={0}
      className="flex flex-col p-5 gap-4 h-full w-full cursor-pointer group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-primary hover:shadow-raised hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.985] active:shadow-surface focus-visible:shadow-focus"
    >
      {/* 顶部：头像 + 名称 + more 按钮 */}
      <div className="flex items-center gap-3">
        <RAGFlowAvatar
          className="size-10 rounded-xl shrink-0"
          avatar={data.avatar}
          name={data.name}
        />
        <h3
          className="flex-1 text-[15px] font-semibold leading-tight truncate text-text-primary"
          data-testid="agent-name"
        >
          {data.name}
          {icon && <span className="ml-1 inline-flex">{icon}</span>}
        </h3>
        <div
          className="shrink-0 opacity-0 group-hover:opacity-100 motion-pop"
          onClick={(e) => e.stopPropagation()}
        >
          {moreDropdown}
        </div>
      </div>

      {/* 中部：描述 tag */}
      <div className="flex-1 flex flex-col gap-2">
        {data.description && (
          <span className="self-start inline-flex items-center px-2.5 py-1 rounded-full bg-bg-card text-xs text-text-secondary font-medium">
            {data.description}
          </span>
        )}
        {extra}
      </div>

      {/* 底部：时间 + shared badge */}
      <div className="flex items-center justify-between">
        {showReleaseTime ? (
          <div className="text-xs text-text-secondary space-y-0.5">
            <div>
              {`${t('flow.lastSavedAt')}: `}
              <Time time={data.update_time} />
            </div>
            {data.release_time && (
              <div>
                {`${t('flow.publishedAt')}: `}
                <Time time={data.release_time} />
              </div>
            )}
          </div>
        ) : (
          <Time time={data.update_time} />
        )}
        {sharedBadge}
      </div>
    </Card>
  );
}
