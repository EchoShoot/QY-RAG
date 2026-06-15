'use client';

import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
  FileUploadTrigger,
  type FileUploadProps,
} from '@/components/file-upload';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { t } from 'i18next';
import {
  ArrowUp,
  Atom,
  BrushCleaning,
  CircleStop,
  Globe,
  Plus,
  Upload,
  X,
} from 'lucide-react';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AudioButton } from '../ui/audio-button';

export type NextMessageInputOnPressEnterParameter = {
  enableThinking: boolean;
  enableInternet: boolean;
};

interface NextMessageInputProps {
  disabled: boolean;
  value: string;
  sendDisabled: boolean;
  sendLoading: boolean;
  conversationId: string;
  uploadMethod?: string;
  isShared?: boolean;
  showUploadIcon?: boolean;
  isUploading?: boolean;
  onPressEnter({
    enableThinking,
    enableInternet,
  }: NextMessageInputOnPressEnterParameter): void;
  onInputChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  createConversationBeforeUploadDocument?(message: string): Promise<any>;
  stopOutputMessage?(): void;
  onUpload?: NonNullable<FileUploadProps['onUpload']>;
  removeFile?(file: File): void;
  onClearMessages?(): void;
  showReasoning?: boolean;
  showInternet?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export function NextMessageInput({
  isUploading = false,
  value,
  sendDisabled,
  sendLoading,
  disabled,
  showUploadIcon = true,
  resize = 'none',
  onUpload,
  onInputChange,
  onClearMessages,
  stopOutputMessage,
  onPressEnter,
  removeFile,
  showReasoning = false,
  showInternet = false,
}: NextMessageInputProps) {
  const [files, setFiles] = React.useState<File[]>([]);
  const [audioInputValue, setAudioInputValue] = React.useState<string | null>(
    null,
  );

  const [enableThinking, setEnableThinking] = useState(false);
  const [enableInternet, setEnableInternet] = useState(false);

  const handleThinkingToggle = useCallback(() => {
    setEnableThinking((prev) => !prev);
  }, []);

  const handleInternetToggle = useCallback(() => {
    setEnableInternet((prev) => !prev);
  }, []);

  const pressEnter = useCallback(() => {
    onPressEnter({
      enableThinking,
      enableInternet: showInternet ? enableInternet : false,
    });
  }, [onPressEnter, enableThinking, enableInternet, showInternet]);

  useEffect(() => {
    if (audioInputValue !== null) {
      onInputChange({
        target: { value: audioInputValue },
      } as React.ChangeEvent<HTMLTextAreaElement>);

      setTimeout(() => {
        pressEnter();
        setAudioInputValue(null);
      }, 0);
    }
  }, [
    audioInputValue,
    onInputChange,
    onPressEnter,
    enableThinking,
    enableInternet,
    showInternet,
    pressEnter,
  ]);

  const onFileReject = React.useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    });
  }, []);

  const submit = React.useCallback(() => {
    if (isUploading) return;
    pressEnter();
    setFiles([]);
  }, [isUploading, pressEnter]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const onSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      submit();
    },
    [submit],
  );

  const handleRemoveFile = React.useCallback(
    (file: File) => () => {
      removeFile?.(file);
    },
    [removeFile],
  );

  return (
    <FileUpload
      value={files}
      onValueChange={setFiles}
      onUpload={onUpload}
      onFileReject={onFileReject}
      className="relative w-full items-center"
      disabled={isUploading || disabled}
    >
      <FileUploadDropzone
        tabIndex={-1}
        // Prevents the dropzone from triggering on click
        onClick={(event) => event.preventDefault()}
        className="absolute top-0 left-0 z-0 flex size-full items-center justify-center rounded-[2rem] border-none bg-bg-base/70 p-0 opacity-0 backdrop-blur transition-opacity duration-200 ease-out data-[dragging]:z-10 data-[dragging]:opacity-100"
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="flex items-center justify-center rounded-full border p-2.5">
            <Upload className="size-6 text-text-secondary" />
          </div>
          <p className="font-medium text-sm">Drag & drop files here</p>
          <p className="text-text-secondary text-xs">
            Upload max 5 files each up to 5MB
          </p>
        </div>
      </FileUploadDropzone>

      <form
        onSubmit={onSubmit}
        className="
          relative flex w-full flex-col gap-2 rounded-[1.375rem]
          bg-bg-base px-5 pb-3 pt-4 shadow-input outline-none
          transition-shadow duration-200 ease-out has-[textarea:focus]:shadow-focus
        "
      >
        <FileUploadList
          orientation="horizontal"
          className="overflow-x-auto px-1 py-1"
        >
          {files.map((file, index) => (
            <FileUploadItem key={index} value={file} className="max-w-52 p-1.5">
              <FileUploadItemPreview className="size-8 [&>svg]:size-5">
                <FileUploadItemProgress variant="fill" />
              </FileUploadItemPreview>
              <FileUploadItemMetadata size="sm" />
              <FileUploadItemDelete asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="-top-1 -right-1 absolute size-4 shrink-0 cursor-pointer rounded-full"
                  onClick={handleRemoveFile(file)}
                >
                  <X className="size-2.5" />
                </Button>
              </FileUploadItemDelete>
            </FileUploadItem>
          ))}
        </FileUploadList>

        <Textarea
          data-testid="chat-textarea"
          value={value}
          onChange={onInputChange}
          placeholder={t('chat.messagePlaceholder')}
          className="
            min-h-11 max-h-40 w-full px-1 py-0.5 overflow-auto text-base leading-7
            !outline-none !border-transparent !bg-transparent !shadow-none !ring-transparent !ring-offset-transparent
          "
          style={{ resize }}
          disabled={isUploading || disabled || sendLoading}
          onKeyDown={handleKeyDown}
          autoSize={{ minRows: 1, maxRows: 8 }}
        />

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {showUploadIcon && (
              <FileUploadTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  variant="transparent"
                  className="size-9 rounded-full border-0 text-text-secondary hover:bg-bg-card"
                  disabled={isUploading || sendLoading}
                  data-testid="chat-detail-attach"
                >
                  <Plus className="size-[22px]" />
                  <span className="sr-only">Attach file</span>
                </Button>
              </FileUploadTrigger>
            )}

            {onClearMessages && (
              <Button
                type="button"
                size="icon"
                variant="transparent"
                className="size-9 rounded-full border-0 text-text-secondary hover:bg-bg-card"
                disabled={isUploading || sendLoading}
                onClick={onClearMessages}
                title={t('common.clear')}
                aria-label={t('common.clear')}
                data-testid="chat-detail-clear-messages"
              >
                <BrushCleaning className="size-[20px]" />
              </Button>
            )}

            {showReasoning && (
              <Button
                type="button"
                size="sm"
                variant={'outline'}
                className={cn(
                  'border-0 h-8 rounded-full text-sm bg-bg-card px-3',
                  {
                    'bg-text-primary text-bg-base': enableThinking,
                  },
                )}
                onClick={handleThinkingToggle}
                data-testid="chat-detail-thinking-toggle"
              >
                <Atom />
                <span>Thinking</span>
              </Button>
            )}

            {showInternet && (
              <Button
                type="button"
                variant={enableInternet ? 'accent' : 'transparent'}
                size="icon"
                className="size-9 rounded-full border-0 text-text-secondary hover:bg-bg-card"
                onClick={handleInternetToggle}
                data-testid="chat-detail-internet-toggle"
              >
                <Globe />
              </Button>
            )}
          </div>

          {sendLoading ? (
            <Button
              data-testid="chat-stream-status"
              onClick={stopOutputMessage}
              size="icon"
              className="size-10 rounded-full"
            >
              <CircleStop />
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <AudioButton
                onOk={(value) => {
                  setAudioInputValue(value);
                }}
                className="size-9"
                buttonClassName="size-9 text-text-secondary hover:bg-bg-card"
                iconClassName="size-5"
                testId="chat-detail-audio-toggle"
              />

              <Button
                size="icon"
                className="size-10 rounded-full bg-accent-primary text-bg-base shadow-surface hover:bg-accent-primary/90 hover:shadow-raised"
                disabled={
                  sendDisabled || isUploading || sendLoading || !value.trim()
                }
                data-testid="chat-detail-send"
              >
                <ArrowUp className="size-5" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          )}
        </div>
      </form>
    </FileUpload>
  );
}
