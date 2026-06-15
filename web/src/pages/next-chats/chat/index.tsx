import EmbedDialog from '@/components/embed-dialog';
import { useShowEmbedModal } from '@/components/embed-dialog/use-show-embed-dialog';
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { SharedFrom } from '@/constants/chat';
import { useSetModalState } from '@/hooks/common-hooks';
import { useNavigatePage } from '@/hooks/logic-hooks/navigate-hooks';
import {
  useFetchSessionList,
  useFetchSessionManually,
  useGetChatSearchParams,
} from '@/hooks/use-chat-request';
import { IClientConversation } from '@/interfaces/database/chat';
import { useMount } from 'ahooks';
import { isEmpty } from 'lodash';
import {
  LucideArrowBigLeft,
  LucideArrowUpRight,
  LucideSend,
  LucideSettings,
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useHandleClickConversationCard } from '../hooks/use-click-card';
import { ChatSettings } from './app-settings/chat-settings';
import { MultipleChatBox } from './chat-box/next-multiple-chat-box';
import { SingleChatBox } from './chat-box/single-chat-box';
import { Sessions } from './sessions';
import { useAddChatBox } from './use-add-box';
import { useSwitchDebugMode } from './use-switch-debug-mode';

export default function Chat() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { navigateToChatList } = useNavigatePage();
  const [currentConversation, setCurrentConversation] =
    useState<IClientConversation>({} as IClientConversation);

  const { fetchSessionManually } = useFetchSessionManually();

  const { handleConversationCardClick, controller, stopOutputMessage } =
    useHandleClickConversationCard();

  const { isDebugMode, switchDebugMode } = useSwitchDebugMode();
  const { removeChatBox, addChatBox, chatBoxIds, hasSingleChatBox } =
    useAddChatBox(isDebugMode);
  const { visible: settingVisible, switchVisible: switchSettingVisible } =
    useSetModalState(false);
  const { showEmbedModal, hideEmbedModal, embedVisible, beta } =
    useShowEmbedModal();

  const { conversationId, isNew } = useGetChatSearchParams();

  const { data: dialogList } = useFetchSessionList();

  const currentConversationName = useMemo(() => {
    return (
      dialogList.find((x) => x.id === conversationId)?.name ||
      t('chat.newConversation')
    );
  }, [conversationId, dialogList, t]);

  const fetchConversation: typeof handleConversationCardClick = useCallback(
    async (conversationId, isNew) => {
      if (conversationId && !isNew) {
        const conversation = await fetchSessionManually(conversationId);
        if (!isEmpty(conversation)) {
          setCurrentConversation(conversation);
        }
      }
    },
    [fetchSessionManually],
  );

  const handleSessionClick: typeof handleConversationCardClick = useCallback(
    (conversationId, isNew) => {
      handleConversationCardClick(conversationId, isNew);
      fetchConversation(conversationId, isNew);
    },
    [fetchConversation, handleConversationCardClick],
  );

  useMount(() => {
    fetchConversation(conversationId, isNew === 'true');
  });

  if (isDebugMode) {
    return (
      <section
        className="size-full overflow-hidden flex flex-col bg-app-page"
        data-testid="chat-detail-multimodel-root"
      >
        <PageHeader>
          <Button
            variant="ghost"
            onClick={switchDebugMode}
            data-testid="chat-detail-multimodel-back"
          >
            <LucideArrowBigLeft />
            <span>{t('common.back')}</span>
          </Button>
          <span className="text-sm font-medium text-text-secondary">
            {t('chat.multipleModels')} ({chatBoxIds.length}/3)
          </span>
        </PageHeader>

        <MultipleChatBox
          chatBoxIds={chatBoxIds}
          controller={controller}
          removeChatBox={removeChatBox}
          addChatBox={addChatBox}
          stopOutputMessage={stopOutputMessage}
          conversation={currentConversation}
        ></MultipleChatBox>
      </section>
    );
  }

  return (
    <div className="size-full overflow-hidden flex flex-col bg-app-page">
      <PageHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={navigateToChatList}>对话</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{currentConversationName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={switchDebugMode}
            data-testid="chat-detail-multimodel-toggle"
          >
            <LucideArrowUpRight />
            {t('chat.multipleModels')}
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={showEmbedModal}
                variant="ghost"
                size="icon-sm"
                data-testid="chat-detail-embed-open"
              >
                <LucideSend className="text-text-secondary" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('common.embedIntoSite')}</TooltipContent>
          </Tooltip>
          <Button
            onClick={switchSettingVisible}
            disabled={!hasSingleChatBox}
            variant="ghost"
            size="icon-sm"
            data-testid="chat-settings"
          >
            <LucideSettings className="text-text-secondary" />
          </Button>
        </div>
      </PageHeader>
      <EmbedDialog
        visible={embedVisible}
        hideModal={hideEmbedModal}
        token={id!}
        from={SharedFrom.Chat}
        beta={beta}
        isAgent={false}
      />
      <section
        className="flex flex-1 min-h-0 flex-col"
        data-testid="chat-detail"
      >
        <article className="flex flex-1 min-h-0 gap-3 px-3 pb-3">
          <Sessions handleConversationCardClick={handleSessionClick}></Sessions>

          <div className="flex-1 min-w-0 bg-bg-base rounded-3xl overflow-hidden flex flex-col h-full">
            <div className="flex flex-col flex-1 min-h-0">
              <div className="px-5 py-4 flex items-center">
                <span className="text-base font-medium truncate text-text-primary">
                  {currentConversationName}
                </span>
              </div>
              <div className="flex-1 min-h-0">
                <SingleChatBox
                  controller={controller}
                  stopOutputMessage={stopOutputMessage}
                  conversation={currentConversation}
                />
              </div>
            </div>
          </div>
          <ChatSettings
            settingVisible={settingVisible}
            switchSettingVisible={switchSettingVisible}
          ></ChatSettings>
        </article>
      </section>
    </div>
  );
}
