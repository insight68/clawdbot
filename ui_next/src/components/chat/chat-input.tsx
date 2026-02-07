"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import type { ChatAttachment } from "@/hooks/use-chat";

interface ChatInputProps {
  draft: string;
  onDraftChange: (draft: string) => void;
  onSend: () => void;
  onAbort?: () => void;
  sending?: boolean;
  canAbort?: boolean;
  disabled?: boolean;
  disabledReason?: string;
  attachments?: ChatAttachment[];
  onAttachmentsChange?: (attachments: ChatAttachment[]) => void;
  className?: string;
}

/**
 * 聊天输入组件
 * 支持文本输入、附件上传、发送和中止
 */
export function ChatInput({
  draft,
  onDraftChange,
  onSend,
  onAbort,
  sending = false,
  canAbort = false,
  disabled = false,
  disabledReason,
  attachments = [],
  onAttachmentsChange,
  className = "",
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isComposing, setIsComposing] = useState(false);

  // 自动调整文本框高度
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const newHeight = Math.min(textarea.scrollHeight, 200);
    textarea.style.height = `${newHeight}px`;
  }, []);

  // 当 draft 内容变化时调整高度
  useEffect(() => {
    adjustHeight();
  }, [draft, adjustHeight]);

  // 处理键盘事件
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Enter 发送，Shift+Enter 换行
      if (e.key === "Enter" && !e.shiftKey && !isComposing) {
        e.preventDefault();
        if (draft.trim() || attachments.length > 0) {
          onSend();
        }
      }
    },
    [draft, attachments.length, onSend, isComposing],
  );

  // 处理文件选择
  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || !onAttachmentsChange) return;

      const newAttachments: ChatAttachment[] = [];

      for (const file of Array.from(files)) {
        // 只支持图片
        if (!file.type.startsWith("image/")) continue;

        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          if (dataUrl) {
            const attachment: ChatAttachment = {
              id: crypto.randomUUID(),
              dataUrl,
              mimeType: file.type,
            };

            onAttachmentsChange([...attachments, attachment]);
          }
        };
        reader.readAsDataURL(file);
      }

      // 清空输入以便下次选择同一文件
      e.target.value = "";
    },
    [attachments, onAttachmentsChange],
  );

  // 移除附件
  const removeAttachment = useCallback(
    (id: string) => {
      if (!onAttachmentsChange) return;
      onAttachmentsChange(attachments.filter((a) => a.id !== id));
    },
    [attachments, onAttachmentsChange],
  );

  const isDisabled = disabled || sending;
  const showAttachments = attachments.length > 0;
  const canSendMessage = !sending && (draft.trim() || showAttachments);

  return (
    <div className={`border-t border-border bg-background p-4 ${className}`}>
      {/* 附件预览 */}
      {showAttachments && (
        <div className="flex flex-wrap gap-2 mb-3">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="relative group w-16 h-16 rounded-lg overflow-hidden border border-border"
            >
              <img
                src={attachment.dataUrl}
                alt="Attachment"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeAttachment(attachment.id)}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                disabled={sending}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 禁用原因提示 */}
      {disabled && disabledReason && (
        <div className="mb-2 text-sm text-muted-foreground flex items-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {disabledReason}
        </div>
      )}

      {/* 输入区域 */}
      <div className="flex items-end gap-2">
        {/* 附件按钮 */}
        {!sending && onAttachmentsChange && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isDisabled}
            className="px-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
          </Button>
        )}

        {/* 文本输入框 */}
        <Textarea
          ref={textareaRef}
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
          disabled={isDisabled}
          className="flex-1 resize-none min-h-[44px] max-h-[200px] overflow-y-auto"
          rows={1}
        />

        {/* 发送/中止按钮 */}
        {sending && canAbort ? (
          <Button type="button" variant="danger" size="sm" onClick={onAbort}>
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
              />
            </svg>
            Stop
          </Button>
        ) : (
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onSend}
            disabled={!canSendMessage}
          >
            {sending ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Sending...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                Send
              </>
            )}
          </Button>
        )}

        {/* 隐藏的文件输入 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          disabled={isDisabled}
        />
      </div>

      {/* 提示文本 */}
      <div className="mt-2 text-xs text-muted-foreground">
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  );
}
