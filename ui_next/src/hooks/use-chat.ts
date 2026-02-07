"use client";

import { useCallback, useEffect, useRef } from "react";
import { useGateway } from "../contexts/gateway-context";
import { useChatStore, type ChatMessage } from "../store/use-chat-store";

export type ChatAttachment = {
  id: string;
  dataUrl: string;
  mimeType: string;
};

export type ChatEventPayload = {
  runId: string;
  sessionKey: string;
  state: "delta" | "final" | "aborted" | "error";
  message?: unknown;
  errorMessage?: string;
};

/**
 * 聊天功能 Hook
 * 从 ui_lit/src/ui/controllers/chat.ts 迁移
 */
export function useChat() {
  const gateway = useGateway();
  const {
    sessionKey,
    messages,
    stream,
    streamStartedAt,
    loading,
    sending,
    canAbort,
    draft,
    attachments,
    setMessages,
    setStream,
    setLoading,
    setSending,
    setCanAbort,
    setDraft,
    setAttachments,
    clearStream,
  } = useChatStore();

  // 使用 ref 存储回调，避免在每次渲染时重新创建
  const handlersRef = useRef<{
    onDelta?: (text: string) => void;
    onFinal?: () => void;
    onAborted?: () => void;
    onError?: (error: string) => void;
  }>({});

  /**
   * 加载聊天历史
   */
  const loadHistory = useCallback(async () => {
    if (!gateway.client || !gateway.connected) {
      return;
    }

    setLoading(true);
    try {
      const res = (await gateway.client.request("chat.history", {
        sessionKey,
        limit: 200,
      })) as { messages?: unknown[]; thinkingLevel?: string | null };

      setMessages(
        (Array.isArray(res.messages) ? res.messages : []).map(
          (msg, idx) =>
            ({
              id: `msg-${idx}-${Date.now()}`,
              role: (msg as { role?: string })?.role ?? "assistant",
              content: msg,
              timestamp: (msg as { timestamp?: number })?.timestamp ?? Date.now(),
            }) as ChatMessage,
        ),
      );
    } catch (err) {
      console.error("Failed to load chat history:", err);
    } finally {
      setLoading(false);
    }
  }, [gateway.client, gateway.connected, sessionKey, setLoading, setMessages]);

  /**
   * 将 data URL 转换为 base64 格式
   */
  const dataUrlToBase64 = useCallback((dataUrl: string) => {
    const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl);
    if (!match) return null;
    return { mimeType: match[1], content: match[2] };
  }, []);

  /**
   * 发送聊天消息
   */
  const sendMessage = useCallback(
    async (message: string, attachmentsList?: ChatAttachment[]) => {
      if (!gateway.client || !gateway.connected) {
        return null;
      }

      const msg = message.trim();
      const hasAttachments = attachmentsList && attachmentsList.length > 0;
      if (!msg && !hasAttachments) return null;

      const now = Date.now();

      // 构建用户消息内容块
      const contentBlocks: Array<{
        type: string;
        text?: string;
        source?: unknown;
      }> = [];
      if (msg) {
        contentBlocks.push({ type: "text", text: msg });
      }

      // 添加图片预览到消息中用于显示
      if (hasAttachments) {
        for (const att of attachmentsList) {
          contentBlocks.push({
            type: "image",
            source: {
              type: "base64",
              media_type: att.mimeType,
              data: att.dataUrl,
            },
          });
        }
      }

      // 立即添加用户消息到聊天历史
      const userMessage: ChatMessage = {
        id: `user-${now}`,
        role: "user",
        content: contentBlocks,
        timestamp: now,
      };
      setMessages([...messages, userMessage]);

      setSending(true);
      setCanAbort(true);
      setDraft("");
      setAttachments([]);

      const runId = crypto.randomUUID();
      setStream("", now);

      // 将附件转换为 API 格式
      const apiAttachments = hasAttachments
        ? attachmentsList
            .map((att) => {
              const parsed = dataUrlToBase64(att.dataUrl);
              if (!parsed) return null;
              return {
                type: "image",
                mimeType: parsed.mimeType,
                content: parsed.content,
              };
            })
            .filter((a): a is NonNullable<typeof a> => a !== null)
        : undefined;

      try {
        await gateway.client.request("chat.send", {
          sessionKey,
          message: msg,
          deliver: false,
          idempotencyKey: runId,
          attachments: apiAttachments,
        });
        return runId;
      } catch (err) {
        const error = String(err);
        clearStream();
        setCanAbort(false);
        // 添加错误消息到聊天历史
        const errorMsg: ChatMessage = {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: `Error: ${error}`,
          timestamp: Date.now(),
        };
        setMessages([...messages, userMessage, errorMsg]);
        return null;
      } finally {
        setSending(false);
      }
    },
    [
      gateway.client,
      gateway.connected,
      sessionKey,
      messages,
      setMessages,
      setSending,
      setCanAbort,
      setDraft,
      setAttachments,
      setStream,
      clearStream,
      dataUrlToBase64,
    ],
  );

  /**
   * 中止聊天运行
   */
  const abortRun = useCallback(async (): Promise<boolean> => {
    if (!gateway.client || !gateway.connected) return false;

    try {
      await gateway.client.request("chat.abort", {
        sessionKey,
      });
      clearStream();
      setCanAbort(false);
      return true;
    } catch (err) {
      console.error("Failed to abort chat:", err);
      return false;
    }
  }, [gateway.client, gateway.connected, sessionKey, clearStream, setCanAbort]);

  /**
   * 处理聊天事件
   */
  const handleChatEvent = useCallback(
    (payload?: ChatEventPayload) => {
      if (!payload) return null;
      if (payload.sessionKey !== sessionKey) return null;

      const { state, message, errorMessage } = payload;

      if (state === "delta") {
        // 流式更新
        const text = message?.toString() ?? "";
        setStream(text);
        handlersRef.current.onDelta?.(text);
      } else if (state === "final") {
        // 完成
        clearStream();
        setCanAbort(false);
        handlersRef.current.onFinal?.();
        // 刷新历史以获取最终消息
        loadHistory();
      } else if (state === "aborted") {
        // 中止
        clearStream();
        setCanAbort(false);
        handlersRef.current.onAborted?.();
      } else if (state === "error") {
        // 错误
        clearStream();
        setCanAbort(false);
        const error = errorMessage ?? "chat error";
        handlersRef.current.onError?.(error);
      }

      return state;
    },
    [sessionKey, setStream, clearStream, setCanAbort, loadHistory],
  );

  // 设置事件处理器
  const setEventHandlers = useCallback(
    (handlers: {
      onDelta?: (text: string) => void;
      onFinal?: () => void;
      onAborted?: () => void;
      onError?: (error: string) => void;
    }) => {
      handlersRef.current = handlers;
    },
    [],
  );

  // 当 sessionKey 改变时加载历史
  useEffect(() => {
    if (sessionKey && gateway.client && gateway.connected) {
      loadHistory();
    }
  }, [sessionKey, gateway.client, gateway.connected, loadHistory]);

  return {
    // 状态
    sessionKey,
    messages,
    stream,
    streamStartedAt,
    loading,
    sending,
    canAbort,
    draft,
    attachments,

    // 操作
    loadHistory,
    sendMessage,
    abortRun,
    handleChatEvent,
    setEventHandlers,
    setDraft,
    setAttachments,
  };
}
