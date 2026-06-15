import { CardContainer } from '@/components/card-container';
import { EmptyCardType } from '@/components/empty/constant';
import { DelayedEmptyState } from '@/components/empty/delayed-empty-state';
import { EmptyAppCard } from '@/components/empty/empty';
import ListFilterBar from '@/components/list-filter-bar';
import { RenameDialog } from '@/components/rename-dialog';
import { Button } from '@/components/ui/button';
import { RAGFlowPagination } from '@/components/ui/ragflow-pagination';
import { Spin } from '@/components/ui/spin';
import { useFetchChatList } from '@/hooks/use-chat-request';
import { pick } from 'lodash';
import { Plus } from 'lucide-react';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { ChatCard } from './chat-card';
import { useCreateChatDialog } from './hooks/use-create-chat';
import { useRenameChat } from './hooks/use-rename-chat';

export default function ChatList() {
  const {
    data,
    loading,
    setPagination,
    pagination,
    handleInputChange,
    searchString,
  } = useFetchChatList();
  const { t } = useTranslation();
  const {
    initialChatName,
    chatRenameVisible,
    showChatRenameModal,
    hideChatRenameModal,
    onChatRenameOk,
    chatRenameLoading,
  } = useRenameChat();
  const {
    createChatVisible,
    showCreateChatModal,
    hideCreateChatModal,
    onCreateChatOk,
    createChatLoading,
  } = useCreateChatDialog();

  const handlePageChange = useCallback(
    (page: number, pageSize?: number) => {
      setPagination({ page, pageSize });
    },
    [setPagination],
  );

  const handleShowCreateModal = useCallback(() => {
    showCreateChatModal();
  }, [showCreateChatModal]);

  const [searchParams, setSearchParams] = useSearchParams();
  const isCreate = searchParams.get('isCreate') === 'true';
  useEffect(() => {
    if (isCreate) {
      handleShowCreateModal();
      searchParams.delete('isCreate');
      setSearchParams(searchParams);
    }
  }, [isCreate, handleShowCreateModal, searchParams, setSearchParams]);

  const renameDialogProps = useMemo(() => {
    if (chatRenameVisible) {
      return {
        hideModal: hideChatRenameModal,
        onOk: onChatRenameOk,
        initialName: initialChatName,
        loading: chatRenameLoading,
        title: initialChatName,
      };
    }
    if (createChatVisible) {
      return {
        hideModal: hideCreateChatModal,
        onOk: onCreateChatOk,
        initialName: '',
        loading: createChatLoading,
        title: t('chat.createChat'),
      };
    }
    return null;
  }, [
    chatRenameVisible,
    createChatVisible,
    hideChatRenameModal,
    onChatRenameOk,
    initialChatName,
    chatRenameLoading,
    hideCreateChatModal,
    onCreateChatOk,
    createChatLoading,
    t,
  ]);

  const hasChats = Boolean(data.chats?.length);
  const showInitialLoading = loading && !hasChats;

  return (
    <>
      <article
        className="size-full flex flex-col bg-app-page"
        data-testid="chats-list"
      >
        <header className="px-6 pt-6 pb-4">
          <ListFilterBar
            title={t('chat.chatApps')}
            icon="chats"
            onSearchChange={handleInputChange}
            searchString={searchString}
          >
            <Button data-testid="create-chat" onClick={handleShowCreateModal}>
              <Plus className="size-[1em]" />
              {t('chat.createChat')}
            </Button>
          </ListFilterBar>
        </header>

        {hasChats ? (
          <CardContainer className="flex-1 min-h-0 overflow-auto px-6 py-5">
            {data.chats.map((x) => (
              <ChatCard
                key={x.id}
                data={x}
                showChatRenameModal={showChatRenameModal}
              />
            ))}
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
                  type={EmptyCardType.Chat}
                  onClick={handleShowCreateModal}
                  testId="chats-empty-create"
                />
              </DelayedEmptyState>
            )}
          </div>
        )}

        {hasChats && (
          <footer className="px-6 py-4">
            <RAGFlowPagination
              {...pick(pagination, 'current', 'pageSize')}
              total={pagination.total}
              onChange={handlePageChange}
            />
          </footer>
        )}
      </article>

      {renameDialogProps && (
        <RenameDialog {...renameDialogProps}></RenameDialog>
      )}
    </>
  );
}
