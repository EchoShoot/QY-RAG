import { CardContainer } from '@/components/card-container';
import { EmptyCardType } from '@/components/empty/constant';
import { DelayedEmptyState } from '@/components/empty/delayed-empty-state';
import { EmptyAppCard } from '@/components/empty/empty';
import ListFilterBar from '@/components/list-filter-bar';
import { RenameDialog } from '@/components/rename-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { RAGFlowPagination } from '@/components/ui/ragflow-pagination';
import { Spin } from '@/components/ui/spin';
import { useNavigatePage } from '@/hooks/logic-hooks/navigate-hooks';
import { useFetchAgentListByPage } from '@/hooks/use-agent-request';
import { Routes } from '@/routes';
import { t } from 'i18next';
import { pick } from 'lodash';
import { Clipboard, ClipboardPlus, FileInput, Plus } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { AgentCard } from './agent-card';
import { CreateAgentDialog } from './create-agent-dialog';
import { useCreateAgentOrPipeline } from './hooks/use-create-agent';
import { useSelectFilters } from './hooks/use-selelct-filters';
import { UploadAgentDialog } from './upload-agent-dialog';
import { useHandleImportJsonFile } from './use-import-json';
import { useRenameAgent } from './use-rename-agent';

export default function Agents() {
  const {
    data,
    pagination,
    setPagination,
    searchString,
    handleInputChange,
    filterValue,
    handleFilterSubmit,
    loading: agentListLoading,
  } = useFetchAgentListByPage();

  const { navigateToAgentTemplates } = useNavigatePage();

  const {
    agentRenameLoading,
    initialAgentName,
    onAgentRenameOk,
    agentRenameVisible,
    hideAgentRenameModal,
    showAgentRenameModal,
  } = useRenameAgent();

  const {
    creatingVisible,
    hideCreatingModal,
    showCreatingModal,
    loading: creatingLoading,
    handleCreateAgentOrPipeline,
  } = useCreateAgentOrPipeline();

  const {
    handleImportJson,
    fileUploadVisible,
    onFileUploadOk,
    hideFileUploadModal,
  } = useHandleImportJsonFile();

  const filters = useSelectFilters();

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
      showCreatingModal();
      searchUrl.delete('isCreate');
      setSearchUrl(searchUrl);
    }
  }, [isCreate, showCreatingModal, searchUrl, setSearchUrl]);

  const hasAgents = data.length > 0;
  const showInitialLoading = agentListLoading && !hasAgents;
  const emptyActionList = (
    <ul className="flex flex-col gap-y-5 text-text-secondary text-sm pt-5">
      <li data-testid="agents-empty-create">
        <Button variant="static" size="auto" onClick={showCreatingModal}>
          <Clipboard className="size-[1em]" />
          {t('flow.createFromBlank')}
        </Button>
      </li>

      <li>
        <Button asLink variant="static" size="auto" to={Routes.AgentTemplates}>
          <ClipboardPlus className="size-[1em]" />
          {t('flow.createFromTemplate')}
        </Button>
      </li>

      <li>
        <Button variant="static" size="auto" onClick={handleImportJson}>
          <FileInput className="size-[1em]" />
          {t('flow.importJsonFile')}
        </Button>
      </li>
    </ul>
  );

  return (
    <>
      <article
        className="size-full flex flex-col bg-app-page"
        data-testid="agents-list"
      >
        <header className="px-6 pt-6 pb-4">
          <ListFilterBar
            title={t('flow.agents')}
            searchString={searchString}
            onSearchChange={handleInputChange}
            icon="agents"
            filters={filters}
            onChange={handleFilterSubmit}
            value={filterValue}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild data-testid="create-agent">
                <Button>
                  <Plus className="size-[1em]" />
                  {t('flow.createGraph')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent data-testid="agent-create-menu">
                <DropdownMenuItem
                  justifyBetween={false}
                  onClick={showCreatingModal}
                >
                  <Clipboard />
                  {t('flow.createFromBlank')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  justifyBetween={false}
                  onClick={() => navigateToAgentTemplates()}
                >
                  <ClipboardPlus />
                  {t('flow.createFromTemplate')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  data-testid="agent-import-json"
                  justifyBetween={false}
                  onClick={handleImportJson}
                >
                  <FileInput />
                  {t('flow.importJsonFile')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ListFilterBar>
        </header>

        {hasAgents ? (
          <CardContainer className="flex-1 min-h-0 overflow-auto px-6 py-5">
            {data.map((x) => {
              return (
                <AgentCard
                  key={x.id}
                  data={x}
                  showAgentRenameModal={showAgentRenameModal}
                />
              );
            })}
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
                  className="w-[480px] p-14 !cursor-default"
                  isSearch={Boolean(searchString)}
                  type={EmptyCardType.Agent}
                  tabIndex={-1}
                >
                  {!searchString && emptyActionList}
                </EmptyAppCard>
              </DelayedEmptyState>
            )}
          </div>
        )}

        {hasAgents && (
          <footer className="px-6 py-4">
            <RAGFlowPagination
              {...pick(pagination, 'current', 'pageSize')}
              total={pagination.total}
              onChange={handlePageChange}
            />
          </footer>
        )}
      </article>

      {agentRenameVisible && (
        <RenameDialog
          hideModal={hideAgentRenameModal}
          onOk={onAgentRenameOk}
          initialName={initialAgentName}
          loading={agentRenameLoading}
        ></RenameDialog>
      )}
      {creatingVisible && (
        <CreateAgentDialog
          loading={creatingLoading}
          visible={creatingVisible}
          hideModal={hideCreatingModal}
          shouldChooseAgent
          onOk={handleCreateAgentOrPipeline}
        ></CreateAgentDialog>
      )}
      {fileUploadVisible && (
        <UploadAgentDialog
          hideModal={hideFileUploadModal}
          onOk={onFileUploadOk}
        ></UploadAgentDialog>
      )}
    </>
  );
}
