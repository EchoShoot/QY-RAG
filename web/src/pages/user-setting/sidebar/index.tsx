import { IconFontFill } from '@/components/icon-font';
import { RAGFlowAvatar } from '@/components/ragflow-avatar';
import ThemeSwitch from '@/components/theme-switch';
import { Button } from '@/components/ui/button';
import { Domain } from '@/constants/common';
import { useLogout } from '@/hooks/use-login-request';
import {
  useFetchSystemVersion,
  useFetchUserInfo,
} from '@/hooks/use-user-setting-request';
import { cn } from '@/lib/utils';
import { Routes } from '@/routes';
import { TFunction } from 'i18next';
import {
  LucideBox,
  LucideServer,
  LucideUnplug,
  LucideUser,
  LucideUsers,
} from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHandleMenuClick } from './hooks';

const menuItems = (t: TFunction) => [
  {
    icon: <LucideServer className="size-[1em]" />,
    label: t('setting.dataSources'),
    key: Routes.DataSource,
  },
  {
    icon: <LucideBox className="size-[1em]" />,
    label: t('setting.model'),
    key: Routes.Model,
    'data-testid': 'settings-nav-model-providers',
  },
  {
    icon: <IconFontFill name="mcp" className="size-[1em]" />,
    label: 'MCP',
    key: Routes.Mcp,
  },
  {
    icon: <LucideUsers className="size-[1em]" />,
    label: t('setting.team'),
    key: Routes.Team,
  },
  {
    icon: <LucideUser className="size-[1em]" />,
    label: t('setting.profile'),
    key: Routes.Profile,
  },
  {
    icon: <LucideUnplug className="size-[1em]" />,
    label: t('setting.api'),
    key: Routes.Api,
  },
  // {
  //   icon: MessageSquareQuote,
  //   label: 'Prompt Templates',
  //   key: Routes.Profile,
  // },
  // { icon: TextSearch, label: 'Retrieval Templates', key: Routes.Profile },
  // { icon: Cog, label: t('setting.system'), key: Routes.System },
  // { icon: Banknote, label: 'Plan', key: Routes.Plan },
];

export function SideBar() {
  const { data: userInfo } = useFetchUserInfo();
  const { handleMenuClick, active: activeItemKey } = useHandleMenuClick();
  const { version, fetchSystemVersion } = useFetchSystemVersion();
  const { t } = useTranslation();
  useEffect(() => {
    if (location.host !== Domain) {
      fetchSystemVersion();
    }
  }, [fetchSystemVersion]);
  const { logout } = useLogout();

  return (
    <aside className="w-[303px] bg-bg-base rounded-3xl shadow-none flex flex-col overflow-hidden">
      <header className="px-6 pt-5 pb-4">
        <div className="flex gap-3 items-center">
          <RAGFlowAvatar
            avatar={userInfo?.avatar}
            name={userInfo?.nickname}
            isPerson
            className="size-9"
          />
          <div className="flex flex-col min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">{userInfo?.nickname}</p>
            <p className="text-xs text-text-secondary truncate">{userInfo?.email}</p>
          </div>
        </div>
      </header>

      <nav className="flex-1 overflow-auto p-3">
        <ul className="flex flex-col gap-1">
          {menuItems(t).map((item) => {
            const { key, icon, label, ...rest } = item;

            return (
              <li key={key}>
                <Button
                  {...rest}
                  block
                  variant="ghost"
                  className={cn(
                    'justify-start gap-3 px-3 relative h-9 text-sm font-medium rounded-lg',
                    activeItemKey === key
                      ? 'bg-accent-primary text-bg-base hover:bg-accent-primary'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-card',
                  )}
                  onClick={handleMenuClick(key)}
                >
                  {icon}
                  <span>{label}</span>
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>

      <footer className="px-3 pb-3 pt-2">
        <div className="flex items-center gap-2 mb-2 px-3 justify-between">
          <span className="text-xs text-text-secondary">{version}</span>
          <ThemeSwitch />
        </div>

        <Button block size="sm" variant="ghost" className="text-text-secondary hover:text-text-primary" onClick={() => logout()}>
          {t('setting.logout')}
        </Button>
      </footer>
    </aside>
  );
}
