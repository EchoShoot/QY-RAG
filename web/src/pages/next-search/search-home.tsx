import { Input } from '@/components/originui/input';
import message from '@/components/ui/message';
import { IUserInfo } from '@/interfaces/database/user-setting';
import { Search } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import './index.less';

export default function SearchHome({
  isSearching,
  setIsSearching,
  searchText,
  setSearchText,
  canSearch,
}: {
  isSearching: boolean;
  setIsSearching: Dispatch<SetStateAction<boolean>>;
  searchText: string;
  setSearchText: Dispatch<SetStateAction<string>>;
  userInfo?: IUserInfo;
  canSearch?: boolean;
  showEmbedLogo?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <section className="relative flex size-full items-center justify-center transition-all">
      <div className="relative z-10 w-[780px] px-8">
        <div className="relative w-full">
          <Input
            placeholder={t('search.searchGreeting')}
            className="w-full rounded-full py-7 px-5 pr-16 text-text-primary text-lg bg-bg-base shadow-surface focus-visible:shadow-focus motion-breath"
            value={searchText}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                if (canSearch === false) {
                  message.warning(t('search.chooseDataset'));
                  return;
                }
                setIsSearching(!isSearching);
              }
            }}
            onChange={(e) => {
              if (canSearch === false) {
                message.warning(t('search.chooseDataset'));
                return;
              }
              setSearchText(e.target.value || '');
            }}
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 transform rounded-full bg-text-primary p-2 text-bg-base shadow-surface w-12 motion-breath hover:shadow-raised active:-translate-y-1/2 active:scale-[0.94]"
            onClick={() => {
              if (canSearch === false) {
                message.warning(t('search.chooseDataset'));
                return;
              }
              setIsSearching(!isSearching);
            }}
          >
            <Search size={22} className="m-auto" />
          </button>
        </div>
      </div>
    </section>
  );
}
