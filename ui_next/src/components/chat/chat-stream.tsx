"use client";

import { useEffect, useRef, useState } from "react";

interface ChatStreamProps {
  stream: string | null;
  startedAt: number | null;
  className?: string;
}

/**
 * 流式响应显示组件
 * 显示 AI 正在生成的响应
 */
export function ChatStream({
  stream,
  startedAt,
  className = "",
}: ChatStreamProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayedText, setDisplayedText] = useState("");

  // 自动滚动到底部
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollTop = container.scrollHeight;
  }, [stream]);

  // 当有新的流式内容时，平滑更新显示
  useEffect(() => {
    if (stream !== null) {
      setDisplayedText(stream);
    }
  }, [stream]);

  if (!stream) return null;

  const elapsed = startedAt ? Date.now() - startedAt : 0;

  return (
    <div
      ref={containerRef}
      className={`flex mb-4 justify-start ${className}`}
    >
      <div className="flex max-w-[80%] gap-3">
        {/* AI 头像 */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-sm font-medium relative">
          AI
          {/* 流式指示器 */}
          <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
          </span>
        </div>

        {/* 流式内容 */}
        <div className="rounded-lg rounded-bl-sm px-4 py-3 bg-muted text-foreground">
          {/* 内容 */}
          {displayedText ? (
            <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap break-words">
              {displayedText}
              {/* 光标 */}
              <span className="inline-block w-1 h-4 bg-accent ml-0.5 animate-pulse" />
            </div>
          ) : (
            <div className="flex items-center gap-1">
              {/* 加载动画 */}
              <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" />
            </div>
          )}

          {/* 时间信息 */}
          <div className="text-xs text-muted-foreground mt-2 flex items-center gap-2">
            <span>Streaming...</span>
            {elapsed > 0 && (
              <span>
                {elapsed < 1000
                  ? `${elapsed}ms`
                  : `${(elapsed / 1000).toFixed(1)}s`}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 正在输入指示器
 */
export function TypingIndicator({ className = "" }: { className?: string }) {
  return (
    <div className={`flex mb-4 justify-start ${className}`}>
      <div className="flex gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-sm font-medium">
          AI
        </div>
        <div className="rounded-lg rounded-bl-sm px-4 py-3 bg-muted">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}
