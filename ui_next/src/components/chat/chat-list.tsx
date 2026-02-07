"use client";

import { useEffect, useRef } from "react";
import { ChatMessage } from "./chat-message";
import { ChatStream } from "./chat-stream";
import { TypingIndicator } from "./chat-stream";
import { extractText } from "@/lib/message-extract";
import type { ChatItem } from "@/types/chat";

interface ChatListProps {
  items: ChatItem[];
  showThinking?: boolean;
  className?: string;
}

/**
 * 聊天列表组件
 * 显示消息列表，包括流式响应和阅读指示器
 */
export function ChatList({
  items,
  showThinking = false,
  className = "",
}: ChatListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevItemsLengthRef = useRef(0);

  // 自动滚动到底部
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const itemsLength = items.length;

    // 只有添加新项目时才滚动
    if (itemsLength > prevItemsLengthRef.current) {
      container.scrollTop = container.scrollHeight;
      prevItemsLengthRef.current = itemsLength;
    }
  }, [items]);

  if (items.length === 0) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium mb-2">Start a conversation</p>
          <p className="text-sm">Type a message below to begin chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`flex-1 overflow-y-auto p-4 ${className}`}>
      {items.map((item) => {
        if (item.kind === "message") {
          const message = item.message as Record<string, unknown>;
          return (
            <ChatMessage
              key={item.key}
              role={(message.role as string) ?? "unknown"}
              content={message.content}
              timestamp={message.timestamp as number}
              showThinking={showThinking}
            />
          );
        }

        if (item.kind === "stream") {
          return (
            <ChatStream
              key={item.key}
              stream={item.text}
              startedAt={item.startedAt}
            />
          );
        }

        if (item.kind === "reading-indicator") {
          return <TypingIndicator key={item.key} />;
        }

        return null;
      })}
    </div>
  );
}

/**
 * 消息分组组件
 * 将连续的相同角色消息分组显示
 */
interface MessageGroupProps {
  group: {
    key: string;
    role: string;
    messages: Array<{ message: unknown; key: string }>;
    timestamp: number;
  };
  showThinking?: boolean;
}

export function MessageGroup({
  group,
  showThinking = false,
}: MessageGroupProps) {
  const { role, messages, timestamp } = group;

  // 合并所有消息的文本内容
  const combinedText = messages
    .map((m) => extractText(m.message))
    .filter((t): t is string => t !== null)
    .join("\n");

  const isUser = role.toLowerCase() === "user";

  return (
    <div className={`flex mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex max-w-[80%] gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
      >
        {/* 头像 */}
        {!isUser && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-sm font-medium">
            AI
          </div>
        )}

        {/* 消息内容 */}
        <div
          className={`rounded-lg px-4 py-3 ${
            isUser
              ? "bg-accent text-white rounded-br-sm"
              : "bg-muted text-foreground rounded-bl-sm"
          }`}
        >
          {combinedText ? (
            <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap break-words">
              {combinedText}
            </div>
          ) : (
            <div className="text-muted-foreground italic">Empty message</div>
          )}

          {timestamp && (
            <div className="text-xs text-muted-foreground mt-2">
              {new Date(timestamp).toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* 用户头像 */}
        {isUser && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium">
            U
          </div>
        )}
      </div>
    </div>
  );
}
