import { CardContainer } from '@/components/card-container';
import { EmptyCardType } from '@/components/empty/constant';
import { DelayedEmptyState } from '@/components/empty/delayed-empty-state';
import { EmptyAppCard } from '@/components/empty/empty';
import ListFilterBar from '@/components/list-filter-bar';
import { RenameDialog } from '@/components/rename-dialog';
import { Button } from '@/components/ui/button';
import { RAGFlowPagination } from '@/components/ui/ragflow-pagination';
import { Spin } from '@/components/ui/spin';
import { useTranslate } from '@/hooks/common-hooks';
import { pick } from 'lodash';
import { Plus } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useFetchSearchList, useRenameSearch } from './hooks';
import { SearchCard } from './search-card';

export default function SearchList() {
  // const { data } = useFetchFlowList();
  const { t } = useTranslate('search');
  // const [isEdit, setIsEdit] = useState(false);
  const {
    data: list,
    pagination,
    searchString,
    handleInputChange,
    setPagination,
    refetch: refetchList,
    isLoading,
  } = useFetchSearchList();

  const {
    openCreateModal,
    showSearchRenameModal,
    hideSearchRenameModal,
    searchRenameLoading,
    onSearchRenameOk,
    initialSearchName,
  } = useRenameSearch();

  // const handleSearchChange = (value: string) => {
  //   console.log(value);
  // };
  const onSearchRenameConfirm = (name: string) => {
    onSearchRenameOk(name, () => {
      refetchList();
    });
  };
  const openCreateModalFun = useCallback(() => {
    // setIsEdit(false);
    showSearchRenameModal();
  }, [showSearchRenameModal]);
  const handlePageChange = useCallback(
    (page: number, pageSize?: number) => {
      setPagination({ page, pageSize });
    },
    [setPagination],
  );

  const [searchUrl, setSearchUrl] = useSearchParams();
  const isCreate = searchUrl.get('isCreate') === 'true';
  useEffect(() => {
    if (isCreate) {
      openCreateModalFun();
      searchUrl.delete('isCreate');
      setSearchUrl(searchUrl);
    }
  }, [isCreate, openCreateModalFun, searchUrl, setSearchUrl]);

  const searchApps = list?.data?.search_apps ?? [];
  const hasSearchApps = searchApps.length > 0;
  const showInitialLoading = isLoading && !hasSearchApps;

  return (
    <>
      <article
        className="size-full flex flex-col bg-app-page"
        data-testid="search-list"
      >
        <header className="px-6 pt-6 pb-4">
          <ListFilterBar
            icon="searches"
            title={t('searchApps')}
            showFilter={false}
            searchString={searchString}
            onSearchChange={handleInputChange}
          >
            <Button
              data-testid="create-search"
              onClick={() => openCreateModalFun()}
            >
              <Plus className="size-[1em]" />
              {t('createSearch')}
            </Button>
          </ListFilterBar>
        </header>

        {hasSearchApps ? (
          <CardContainer className="flex-1 min-h-0 overflow-auto px-6 py-5">
            {searchApps.map((x) => {
              return (
                <SearchCard
                  key={x.id}
                  data={x}
                  showSearchRenameModal={() => {
                    showSearchRenameModal(x);
                  }}
                />
              );
            })}
          </CardContainer>
        ) : (
          <div className="flex-1 min-h-0 flex items-center justify-center px-6 py-5">
            {showInitialLoading ? (
              <Spin size="large" />
            ) : (
              <DelayedEmptyState resetKey={searchString}>
                <EmptyAppCard
                  showIcon
                  size="large"
                  className="w-[480px] p-14"
                  isSearch={Boolean(searchString)}
                  type={EmptyCardType.Search}
                  onClick={() => openCreateModalFun()}
                  testId="search-empty-create"
                />
              </DelayedEmptyState>
            )}
          </div>
        )}

        {hasSearchApps && (
          <footer className="px-6 py-4">
            <RAGFlowPagination
              {...pick(pagination, 'current', 'pageSize')}
              total={list?.data.total}
              onChange={handlePageChange}
            />
          </footer>
        )}
      </article>
      {openCreateModal && (
        <RenameDialog
          hideModal={hideSearchRenameModal}
          onOk={onSearchRenameConfirm}
          initialName={initialSearchName}
          loading={searchRenameLoading}
          title={initialSearchName || t('createSearch')}
        ></RenameDialog>
      )}
    </>
  );
}
