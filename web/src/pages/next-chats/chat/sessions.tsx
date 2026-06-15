import { ConfirmDeleteDialog } from '@/components/confirm-delete-dialog';
import { MoreButton } from '@/components/more-button';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { SearchInput } from '@/components/ui/input';
import { useSetModalState } from '@/hooks/common-hooks';
import {
  useGetChatSearchParams,
  useRemoveSessions,
} from '@/hooks/use-chat-request';
import {
  LucideCopyX,
  LucideListChecks,
  LucidePanelLeftClose,
  LucidePanelLeftOpen,
  LucidePlus,
  LucideSearch,
  LucideTrash2,
  LucideUndo2,
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useChatUrlParams } from '../hooks/use-chat-url';
import { useHandleClickConversationCard } from '../hooks/use-click-card';
import { useSelectDerivedConversationList } from '../hooks/use-select-conversation-list';
import { ConversationDropdown } from './conversation-dropdown';

type SessionProps = Pick<
  ReturnType<typeof useHandleClickConversationCard>,
  'handleConversationCardClick'
>;
export function Sessions({ handleConversationCardClick }: SessionProps) {
  const { t } = useTranslation();
  const {
    list: conversationList,
    addTemporaryConversation,
    removeTemporaryConversation,
    handleInputChange,
    searchString,
  } = useSelectDerivedConversationList();
  const { visible, switchVisible } = useSetModalState(true);
  const { removeSessions } = useRemoveSessions();
  const { setConversationBoth } = useChatUrlParams();
  const { conversationId } = useGetChatSearchParams();

  // Selection mode state
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchVisible, setSearchVisible] = useState(false);

  // Toggle selection mode (click batch delete icon)
  const toggleSelectionMode = useCallback(() => {
    setSelectionMode(true);
    setSelectedIds(new Set());
  }, []);

  // Exit selection mode (click return icon)
  const exitSelectionMode = useCallback(() => {
    setSelectionMode(false);
    setSelectedIds(new Set());
  }, []);

  // Toggle single item selection
  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  // Toggle select all
  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      if (prev.size === conversationList.length) {
        return new Set();
      }
      return new Set(conversationList.map((x) => x.id));
    });
  }, [conversationList]);

  // Batch delete
  const handleBatchDelete = useCallback(async () => {
    if (selectedIds.size === 0) {
      return;
    }

    const selectedIdList = Array.from(selectedIds);
    const currentConversationDeleted = conversationId
      ? selectedIdList.includes(conversationId)
      : false;
    const temporaryIdSet = new Set(
      conversationList.filter((item) => item.is_new).map((item) => item.id),
    );
    const persistedIds: string[] = [];

    selectedIdList.forEach((id) => {
      if (temporaryIdSet.has(id)) {
        removeTemporaryConversation(id);
      } else {
        persistedIds.push(id);
      }
    });

    let removeCode = -1;
    if (persistedIds.length > 0) {
      removeCode = await removeSessions(persistedIds);
    }

    if (currentConversationDeleted && conversationId) {
      const currentIsTemporary = temporaryIdSet.has(conversationId);
      const currentPersistedDeleted =
        persistedIds.includes(conversationId) && removeCode === 0;
      if (currentIsTemporary || currentPersistedDeleted) {
        setConversationBoth('', '');
      }
    }
    exitSelectionMode();
  }, [
    selectedIds,
    conversationId,
    conversationList,
    setConversationBoth,
    removeTemporaryConversation,
    removeSessions,
    exitSelectionMode,
  ]);

  const selectedCount = useMemo(() => selectedIds.size, [selectedIds]);

  if (!visible) {
    return (
      <div className="p-4">
        <Button
          variant="transparent"
          size="icon-sm"
          className="border-0 bg-chat-sidebar rounded-full hover:bg-chat-sidebar-item"
          onClick={switchVisible}
          data-testid="chat-detail-sessions-open"
        >
          <LucidePanelLeftOpen className="size-4 text-text-secondary" />
        </Button>
      </div>
    );
  }

  return (
    <aside
      className="w-[296px] flex flex-col bg-chat-sidebar rounded-3xl shrink-0 overflow-hidden"
      role="complementary"
      data-testid="chat-detail-sessions"
    >
      <header className="flex items-center justify-between gap-3 px-4 pt-5 pb-4">
        <Button
          variant="ghost"
          size="icon-sm"
          className="size-9 rounded-full text-text-secondary hover:bg-chat-sidebar-item"
          onClick={switchVisible}
          data-testid="chat-detail-sessions-close"
        >
          <LucidePanelLeftClose className="size-5" />
        </Button>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            className="size-9 rounded-full text-text-secondary hover:bg-chat-sidebar-item"
            onClick={() => setSearchVisible((value) => !value)}
            data-testid="chat-detail-session-search-toggle"
          >
            <LucideSearch className="size-5" />
          </Button>
        </div>
      </header>

      <div className="px-3">
        <Button
          variant="ghost"
          className="h-12 w-full justify-start gap-3 rounded-full bg-chat-sidebar-item px-4 text-base font-medium text-text-primary hover:bg-surface-floating"
          onClick={addTemporaryConversation}
          data-testid="chat-detail-session-new"
        >
          <LucidePlus className="size-5" />
          {t('chat.newConversation')}
        </Button>
      </div>

      <div className="mt-5 flex items-center justify-between px-4">
        <span className="text-sm font-medium text-text-secondary">
          {t('chat.conversations')}
        </span>

        <div className="flex items-center gap-1">
          {selectionMode ? (
            <Button
              variant="ghost"
              size="icon-xs"
              className="rounded-full text-text-secondary hover:bg-chat-sidebar-item"
              onClick={exitSelectionMode}
              data-testid="chat-detail-session-selection-exit"
            >
              <LucideUndo2 size={16} />
            </Button>
          ) : (
            <data
              className="text-xs text-text-secondary"
              value={conversationList.length}
            >
              {conversationList.length}
            </data>
          )}

          {selectionMode && selectedCount > 0 ? (
            <ConfirmDeleteDialog
              onOk={handleBatchDelete}
              title={t('chat.batchDeleteSessions')}
              content={{
                title: t('chat.deleteSelectedConfirm', {
                  count: selectedCount,
                }),
              }}
              testId="chat-detail-session-batch-delete-dialog"
              confirmButtonTestId="chat-detail-session-batch-delete-confirm"
              cancelButtonTestId="chat-detail-session-batch-delete-cancel"
            >
              <Button
                variant="delete"
                size="icon-xs"
                className="rounded-full"
                data-testid="chat-detail-session-batch-delete"
              >
                <LucideTrash2 />
              </Button>
            </ConfirmDeleteDialog>
          ) : (
            <Button
              variant="ghost"
              size="icon-xs"
              className="rounded-full text-text-secondary hover:bg-chat-sidebar-item"
              onClick={selectionMode ? toggleSelectAll : toggleSelectionMode}
              data-testid={
                selectionMode
                  ? 'chat-detail-session-select-all'
                  : 'chat-detail-session-selection-enable'
              }
            >
              {selectionMode ? <LucideListChecks /> : <LucideCopyX />}
            </Button>
          )}
        </div>
      </div>

      {searchVisible && (
        <div className="px-4 pt-3" role="search">
          <SearchInput
            onChange={handleInputChange}
            value={searchString}
            data-testid="chat-detail-session-search"
          ></SearchInput>
        </div>
      )}

      <div className="flex-1 overflow-auto px-3 pt-3">
        {selectionMode ? (
          <ul className="space-y-1" role="listbox" aria-multiselectable>
            {conversationList.map((x) => (
              <li
                key={x.id}
                className="rounded-xl px-2 py-2 hover:bg-chat-sidebar-item"
                role="option"
                aria-selected={selectedIds.has(x.id)}
                data-session-id={x.id}
              >
                <label className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedIds.has(x.id)}
                    onCheckedChange={() => toggleSelection(x.id)}
                    data-testid="chat-detail-session-checkbox"
                    data-session-id={x.id}
                  />

                  <span className="truncate text-base text-text-primary">
                    {x.name}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <nav aria-label={t('chat.conversations')}>
            <ul className="space-y-1">
              {conversationList.map((x) => (
                <li
                  key={x.id}
                  className="
                      group pr-2 flex items-center gap-1 rounded-full
                      aria-selected:bg-chat-sidebar-active has-[>button:focus-visible]:bg-chat-sidebar-active
                      hover:bg-chat-sidebar-item transition-colors
                    "
                  aria-selected={conversationId === x.id}
                >
                  <button
                    type="button"
                    className="focus-visible:outline-none px-2.5 py-2.5 text-left flex-1 truncate text-base text-text-primary"
                    onClick={() => handleConversationCardClick(x.id, x.is_new)}
                    data-testid="chat-detail-session-item"
                    data-session-id={x.id}
                  >
                    {x.name}
                  </button>

                  <ConversationDropdown
                    conversation={x}
                    removeTemporaryConversation={removeTemporaryConversation}
                  >
                    <MoreButton
                      className="
                        size-8 rounded-full opacity-0 bg-surface-floating
                        text-text-secondary hover:bg-chat-sidebar-item
                        group-hover:opacity-100 group-focus-within:opacity-100
                        aria-expanded:opacity-100 transition-opacity
                      "
                      data-testid="chat-detail-session-actions"
                      data-session-id={x.id}
                    ></MoreButton>
                  </ConversationDropdown>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </aside>
  );
}
