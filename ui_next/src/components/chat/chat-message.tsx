"use client";

import { extractText, extractThinking } from "@/lib/message-extract";
import { extractToolCards } from "@/lib/tool-cards";
import { formatReasoningMarkdown } from "@/lib/message-extract";
import { Card } from "@/components/ui/card";

interface ChatMessageProps {
  role: string;
  content: unknown;
  timestamp?: number;
  showThinking?: boolean;
  isStreaming?: boolean;
  className?: string;
}

/**
 * 聊天消息组件
 * 显示用户和助手的消息
 */
export function ChatMessage({
  role,
  content,
  timestamp,
  showThinking = false,
  isStreaming = false,
  className = "",
}: ChatMessageProps) {
  const text = extractText({ role, content });
  const thinking = extractThinking({ role, content });
  const toolCards = extractToolCards({ role, content });

  const isUser = role.toLowerCase() === "user";
  const isAssistant = role.toLowerCase() === "assistant";
  const isSystem = role.toLowerCase() === "system";

  if (isSystem) {
    return (
      <div className={`flex justify-center my-4 ${className}`}>
        <div className="bg-muted px-4 py-2 rounded-full text-sm text-muted-foreground">
          {text || "System message"}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex mb-4 ${isUser ? "justify-end" : "justify-start"} ${className}`}
    >
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
          {/* 思考过程 */}
          {isAssistant && showThinking && thinking && (
            <details className="mb-3 text-sm border-l-2 border-accent pl-3">
              <summary className="cursor-pointer font-medium text-accent">
                Reasoning
              </summary>
              <div className="mt-2 text-muted-foreground whitespace-pre-wrap">
                {formatReasoningMarkdown(thinking)}
              </div>
            </details>
          )}

          {/* 工具调用卡片 */}
          {isAssistant && toolCards.length > 0 && (
            <div className="space-y-2 mb-3">
              {toolCards.map((card, index) => (
                <ToolCard key={index} card={card} />
              ))}
            </div>
          )}

          {/* 消息文本 */}
          {text ? (
            <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap break-words">
              {text}
            </div>
          ) : (
            <div className="text-muted-foreground italic">
              {isStreaming ? "..." : "Empty message"}
            </div>
          )}

          {/* 时间戳 */}
          {timestamp && !isStreaming && (
            <div className="text-xs text-muted-foreground mt-2">
              {new Date(timestamp).toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* 用户头像（可选） */}
        {isUser && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium">
            U
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 工具调用卡片组件
 */
function ToolCard({ card }: { card: { kind: "call" | "result"; name: string; args?: unknown; text?: string } }) {
  const isCall = card.kind === "call";

  return (
    <Card variant="outlined" className="p-3 text-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-2 h-2 rounded-full ${isCall ? "bg-blue-500" : "bg-green-500"}`} />
        <span className="font-medium">{card.name}</span>
        <span className="text-xs text-muted-foreground">
          {isCall ? "calling..." : "result"}
        </span>
      </div>

      {isCall && card.args != null && (
        <div className="bg-muted p-2 rounded text-xs font-mono overflow-x-auto">
          <pre className="whitespace-pre-wrap">{String(JSON.stringify(card.args, null, 2))}</pre>
        </div>
      )}

      {!isCall && card.text && (
        <div className="bg-muted p-2 rounded text-xs whitespace-pre-wrap max-h-32 overflow-y-auto">
          {card.text}
        </div>
      )}
    </Card>
  );
}
