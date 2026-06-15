import { PageHeader } from '@/components/page-header';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { useNavigatePage } from '@/hooks/logic-hooks/navigate-hooks';
import { useFetchUserInfo } from '@/hooks/use-user-setting-request';
import { Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  ISearchAppDetailProps,
  useFetchSearchDetail,
} from '../next-searches/hooks';
import { useCheckSettings } from './hooks';
import './index.less';
import SearchHome from './search-home';
import { SearchSetting } from './search-setting';
import SearchingPage from './searching';

export default function SearchPage() {
  const [isSearching, setIsSearching] = useState(false);
  const { data: SearchData } = useFetchSearchDetail();
  const { navigateToSearchList } = useNavigatePage();

  const [openSetting, setOpenSetting] = useState(false);
  const [searchText, setSearchText] = useState('');
  const { data: userInfo } = useFetchUserInfo();
  const searchName = (SearchData as ISearchAppDetailProps)?.name;
  const { openSetting: checkOpenSetting } = useCheckSettings(
    SearchData as ISearchAppDetailProps,
  );
  useEffect(() => {
    setOpenSetting(checkOpenSetting);
  }, [checkOpenSetting]);

  useEffect(() => {
    if (isSearching) {
      setOpenSetting(false);
    }
  }, [isSearching]);

  return (
    <section
      className="size-full flex-1 relative flex flex-col bg-app-page"
      data-testid="search-detail"
    >
      <PageHeader>
        <Breadcrumb>
          <BreadcrumbList>
            {searchName ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink onClick={navigateToSearchList}>
                    搜索
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{searchName}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : (
              <BreadcrumbItem>
                <BreadcrumbPage>搜索</BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </BreadcrumbList>
        </Breadcrumb>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setOpenSetting(!openSetting)}
        >
          <Settings className="text-text-secondary" />
        </Button>
      </PageHeader>
      <div className="flex gap-3 flex-1 min-h-0 px-3 pb-3">
        <div className="relative flex-1 min-w-0 bg-bg-base rounded-3xl overflow-hidden">
          {!isSearching && (
            <div className="absolute inset-0 animate-fade-in-down">
              <SearchHome
                setIsSearching={setIsSearching}
                isSearching={isSearching}
                searchText={searchText}
                setSearchText={setSearchText}
                userInfo={userInfo}
                canSearch={!checkOpenSetting}
              />
            </div>
          )}
          {isSearching && (
            <div className="animate-fade-in-up h-full">
              <SearchingPage
                setIsSearching={setIsSearching}
                searchText={searchText}
                setSearchText={setSearchText}
                data={SearchData as ISearchAppDetailProps}
              />
            </div>
          )}
        </div>
        {openSetting && (
          <SearchSetting
            open={openSetting}
            setOpen={setOpenSetting}
            data={SearchData as ISearchAppDetailProps}
          />
        )}
      </div>
    </section>
  );
}
