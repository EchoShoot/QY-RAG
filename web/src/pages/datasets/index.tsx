import { CardContainer } from '@/components/card-container';
import { EmptyCardType } from '@/components/empty/constant';
import { DelayedEmptyState } from '@/components/empty/delayed-empty-state';
import { EmptyAppCard } from '@/components/empty/empty';
import ListFilterBar from '@/components/list-filter-bar';
import { RenameDialog } from '@/components/rename-dialog';
import { Button } from '@/components/ui/button';
import { RAGFlowPagination } from '@/components/ui/ragflow-pagination';
import { Spin } from '@/components/ui/spin';
import { useFetchNextKnowledgeListByPage } from '@/hooks/use-knowledge-request';
import { useQueryClient } from '@tanstack/react-query';
import { pick } from 'lodash';
import { Plus } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { DatasetCard } from './dataset-card';
import { DatasetCreatingDialog } from './dataset-creating-dialog';
import { useSaveKnowledge } from './hooks';
import { useRenameDataset } from './use-rename-dataset';
import { useSelectOwners } from './use-select-owners';

export default function Datasets() {
  const { t } = useTranslation();
  const {
    visible,
    hideModal,
    showModal,
    onCreateOk,
    loading: creatingLoading,
  } = useSaveKnowledge();

  const {
    kbs,
    total_datasets,
    pagination,
    setPagination,
    handleInputChange,
    searchString,
    filterValue,
    handleFilterSubmit,
    loading,
  } = useFetchNextKnowledgeListByPage();

  const owners = useSelectOwners();

  const {
    datasetRenameLoading,
    initialDatasetName,
    onDatasetRenameOk,
    datasetRenameVisible,
    hideDatasetRenameModal,
    showDatasetRenameModal,
  } = useRenameDataset();

  const handlePageChange = useCallback(
    (page: number, pageSize?: number) => {
      setPagination({ page, pageSize });
    },
    [setPagination],
  );
  const [searchUrl, setSearchUrl] = useSearchParams();
  const isCreate = searchUrl.get('isCreate') === 'true';
  const queryClient = useQueryClient();
  useEffect(() => {
    if (isCreate) {
      queryClient.invalidateQueries({ queryKey: ['tenantInfo'] });
      showModal();
      searchUrl.delete('isCreate');
      setSearchUrl(searchUrl);
    }
  }, [isCreate, showModal, searchUrl, setSearchUrl, queryClient]);

  const hasDatasets = Boolean(kbs?.length);
  const showInitialLoading = loading && !hasDatasets;

  return (
    <>
      <article
        className="size-full flex flex-col bg-app-page"
        data-testid="datasets-list"
      >
        <header className="px-6 pt-6 pb-4">
          <ListFilterBar
            title={t('header.dataset')}
            searchString={searchString}
            onSearchChange={handleInputChange}
            value={filterValue}
            filters={owners}
            onChange={handleFilterSubmit}
            icon={'datasets'}
          >
            <Button onClick={showModal}>
              <Plus className="size-[1em]" />
              {t('knowledgeList.createKnowledgeBase')}
            </Button>
          </ListFilterBar>
        </header>

        {hasDatasets ? (
          <CardContainer className="flex-1 min-h-0 overflow-auto px-6 py-5">
            {kbs.map((dataset) => (
              <DatasetCard
                dataset={dataset}
                key={dataset.id}
                showDatasetRenameModal={showDatasetRenameModal}
              />
            ))}
          </CardContainer>
        ) : (
          <div className="flex-1 min-h-0 flex items-center justify-center px-6 py-5">
            {showInitialLoading ? (
              <Spin size="large" />
            ) : (
              <DelayedEmptyState
                resetKey={`${searchString}:${JSON.stringify(filterValue)}`}
              >
                <EmptyAppCard
                  showIcon
                  size="large"
                  className="w-[480px] p-14"
                  isSearch={Boolean(searchString)}
                  type={EmptyCardType.Dataset}
                  onClick={() => showModal()}
                />
              </DelayedEmptyState>
            )}
          </div>
        )}

        {hasDatasets && (
          <footer className="px-6 py-4">
            <RAGFlowPagination
              {...pick(pagination, 'current', 'pageSize')}
              total={total_datasets}
              onChange={handlePageChange}
            />
          </footer>
        )}
      </article>
      {visible && (
        <DatasetCreatingDialog
          hideModal={hideModal}
          onOk={onCreateOk}
          loading={creatingLoading}
        ></DatasetCreatingDialog>
      )}
      {datasetRenameVisible && (
        <RenameDialog
          hideModal={hideDatasetRenameModal}
          onOk={onDatasetRenameOk}
          initialName={initialDatasetName}
          loading={datasetRenameLoading}
        ></RenameDialog>
      )}
    </>
  );
}
