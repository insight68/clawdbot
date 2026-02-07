"use client";

import { useEffect, useMemo, useState } from "react";
import { useChat } from "@/hooks/use-chat";
import { useUIStore } from "@/store/use-ui-store";
import { ChatList } from "./chat-list";
import { ChatInput } from "./chat-input";
import { FullPageLoading } from "@/components/ui/loading";
import { normalizeMessage, normalizeRoleForGrouping } from "@/lib/message-normalizer";
import type { ChatItem } from "@/types/chat";

interface ChatContainerProps {
  sessionKey: string;
  className?: string;
}

/**
 * 聊天容器组件
 * 整合聊天功能的主要入口
 */
export function ChatContainer({ sessionKey, className = "" }: ChatContainerProps) {
  const {
    messages,
    stream,
    streamStartedAt,
    loading,
    sending,
    canAbort,
    draft,
    attachments,
    loadHistory,
    sendMessage,
    abortRun,
    handleChatEvent,
    setDraft,
    setAttachments,
    setEventHandlers,
  } = useChat();

  const { chatShowThinking, chatFocusMode } = useUIStore();
  const [error, setError] = useState<string | null>(null);

  // 设置事件处理器
  useEffect(() => {
    setEventHandlers({
      onError: (err) => setError(err),
    });
  }, [setEventHandlers]);

  // 构建 ChatItem 列表
  const chatItems = useMemo((): ChatItem[] => {
    const items: ChatItem[] = [];

    // 添加历史消息
    for (const [index, message] of messages.entries()) {
      const normalized = normalizeMessage(message);
      items.push({
        kind: "message",
        key: `msg-${index}-${normalized.id ?? index}`,
        message: normalized,
      });
    }

    // 添加流式响应
    if (stream) {
      items.push({
        kind: "stream",
        key: "stream",
        text: stream,
        startedAt: streamStartedAt ?? Date.now(),
      });
    }

    return items;
  }, [messages, stream, streamStartedAt]);

  // 处理发送消息
  const handleSend = async () => {
    setError(null);
    const runId = await sendMessage(draft, attachments);
    if (!runId && (draft.trim() || attachments.length > 0)) {
      setError("Failed to send message");
    }
  };

  // 处理中止
  const handleAbort = async () => {
    await abortRun();
  };

  // 加载状态
  if (loading && messages.length === 0) {
    return <FullPageLoading message="Loading chat history..." />;
  }

  return (
    <div className={`flex flex-col h-full bg-background ${className}`}>
      {/* 聊天消息列表 */}
      <ChatList
        items={chatItems}
        showThinking={chatShowThinking}
        className="flex-1"
      />

      {/* 错误提示 */}
      {error && (
        <div className="mx-4 mb-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* 输入区域 */}
      <ChatInput
        draft={draft}
        onDraftChange={setDraft}
        onSend={handleSend}
        onAbort={handleAbort}
        sending={sending}
        canAbort={canAbort}
        attachments={attachments}
        onAttachmentsChange={setAttachments}
        disabled={false}
      />
    </div>
  );
}
