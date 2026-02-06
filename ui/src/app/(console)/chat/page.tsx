"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useGateway } from "@/contexts/gateway-context";
import { useChatStore, type ChatMessage } from "@/store/use-chat-store";

export default function ChatPage() {
  const { connected, request } = useGateway();
  const {
    messages,
    stream,
    loading,
    sending,
    draft,
    setMessages,
    setLoading,
    setSending,
    setDraft,
    addMessage,
  } = useChatStore();

  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, stream]);

  // Load chat history on mount
  useEffect(() => {
    if (!connected) return;

    const loadHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await request<{
          messages?: ChatMessage[];
        }>("chat.history", {
          limit: 200,
        });
        if (result.messages) {
          setMessages(result.messages);
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
        setError("加载聊天历史失败");
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [connected, request, setLoading, setMessages]);

  // Adjust textarea height
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, []);

  const handleSend = async () => {
    if (!connected || sending) return;

    const text = draft.trim();
    if (!text) return;

    setSending(true);
    setError(null);
    setDraft("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      // Send user message
      addMessage({
        id: `user-${Date.now()}`,
        role: "user",
        content: text,
        timestamp: Date.now(),
      });

      // Request assistant response
      await request("chat.send", {
        text,
        stream: true,
      });
    } catch (err) {
      console.error("Failed to send message:", err);
      setError("发送消息失败");
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter") return;
    if (e.nativeEvent.isComposing) return;
    if (e.shiftKey) return; // Allow Shift+Enter for line breaks

    e.preventDefault();
    if (connected && !sending) {
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraft(e.target.value);
    adjustTextareaHeight();
  };

  const formatMessage = (message: ChatMessage) => {
    if (message.role === "tool") {
      return (
        <div className="chat-message-tool">
          <strong>工具调用: {message.toolName || "Unknown"}</strong>
          {message.toolInput != null && (
            <pre>{String(JSON.stringify(message.toolInput, null, 2))}</pre>
          )}
        </div>
      );
    }

    if (message.role === "toolresult") {
      return (
        <div className="chat-message-tool-result">
          <strong>工具结果: {message.toolName || "Unknown"}</strong>
          {message.toolResult != null && (
            <pre>{String(JSON.stringify(message.toolResult, null, 2))}</pre>
          )}
        </div>
      );
    }

    return <div className="chat-message-content">{message.content}</div>;
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1>聊天</h1>
        <p style={{ color: "var(--text-secondary)" }}>
          {connected ? "Gateway 已连接" : "Gateway 未连接"}
        </p>
      </div>

      {error && (
        <div
          style={{
            padding: "1rem",
            marginBottom: "1rem",
            backgroundColor: "var(--error)",
            color: "white",
            borderRadius: "0.375rem",
          }}
        >
          {error}
        </div>
      )}

      {/* Messages */}
      <div
        style={{
          marginBottom: "2rem",
          minHeight: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {loading ? (
          <div style={{ color: "var(--text-secondary)" }}>正在加载聊天…</div>
        ) : messages.length === 0 ? (
          <div style={{ color: "var(--text-secondary)" }}>开始新的对话…</div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              style={{
                display: "flex",
                justifyContent: message.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "70%",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  backgroundColor:
                    message.role === "user" ? "var(--accent)" : "var(--bg-secondary)",
                  color: message.role === "user" ? "white" : "var(--text)",
                }}
              >
                {formatMessage(message)}
              </div>
            </div>
          ))
        )}

        {/* Streaming message */}
        {stream && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div
              style={{
                maxWidth: "70%",
                padding: "0.75rem 1rem",
                borderRadius: "0.5rem",
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text)",
              }}
            >
              {stream}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>消息</span>
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            disabled={!connected}
            placeholder={
              connected ? "消息内容（回车发送，Shift+回车换行）" : "连接网关后即可开始对话…"
            }
            style={{
              width: "100%",
              minHeight: "80px",
              padding: "0.75rem",
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text)",
              border: "1px solid var(--border)",
              borderRadius: "0.375rem",
              resize: "none",
              fontFamily: "inherit",
              fontSize: "inherit",
            }}
          />
        </label>
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
          <button
            onClick={handleSend}
            disabled={!connected || sending || !draft.trim()}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor:
                connected && !sending && draft.trim() ? "var(--accent)" : "var(--bg-tertiary)",
              color: connected && !sending && draft.trim() ? "white" : "var(--text-tertiary)",
              border: "none",
              borderRadius: "0.375rem",
              cursor: connected && !sending && draft.trim() ? "pointer" : "not-allowed",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            {sending ? "发送中…" : "发送"}
          </button>
        </div>
      </div>
    </div>
  );
}
