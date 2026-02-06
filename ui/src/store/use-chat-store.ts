"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system" | "tool" | "toolresult";
  content: string;
  timestamp?: number;
  toolCallId?: string;
  toolName?: string;
  toolInput?: unknown;
  toolResult?: unknown;
};

export type ChatSession = {
  key: string;
  title?: string;
  createdAt: number;
  updatedAt: number;
  reasoningLevel?: "off" | "low" | "medium" | "high";
};

export type CompactionStatus = {
  active: boolean;
  startedAt: number | null;
  completedAt: number | null;
};

interface ChatState {
  // Session
  sessionKey: string;
  sessions: ChatSession[];

  // Messages
  messages: ChatMessage[];
  toolMessages: ChatMessage[];

  // Streaming
  stream: string | null;
  streamStartedAt: number | null;

  // UI state
  loading: boolean;
  sending: boolean;
  canAbort: boolean;
  compactionStatus: CompactionStatus | null;

  // Input
  draft: string;
  attachments: Array<{ id: string; dataUrl: string; mimeType: string }>;

  // Sidebar
  sidebarOpen: boolean;
  sidebarContent: string | null;
  sidebarError: string | null;

  // Focus mode
  focusMode: boolean;

  // Actions
  setSessionKey: (key: string) => void;
  setSessions: (sessions: ChatSession[]) => void;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  setToolMessages: (messages: ChatMessage[]) => void;
  setStream: (stream: string | null, startedAt?: number) => void;
  setLoading: (loading: boolean) => void;
  setSending: (sending: boolean) => void;
  setCanAbort: (canAbort: boolean) => void;
  setCompactionStatus: (status: CompactionStatus | null) => void;
  setDraft: (draft: string) => void;
  setAttachments: (attachments: Array<{ id: string; dataUrl: string; mimeType: string }>) => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarContent: (content: string | null, error?: string | null) => void;
  setFocusMode: (focusMode: boolean) => void;
  clearStream: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      // Session
      sessionKey: "",
      sessions: [],

      // Messages
      messages: [],
      toolMessages: [],

      // Streaming
      stream: null,
      streamStartedAt: null,

      // UI state
      loading: false,
      sending: false,
      canAbort: false,
      compactionStatus: null,

      // Input
      draft: "",
      attachments: [],

      // Sidebar
      sidebarOpen: false,
      sidebarContent: null,
      sidebarError: null,

      // Focus mode
      focusMode: false,

      // Actions
      setSessionKey: (key) => set({ sessionKey: key }),
      setSessions: (sessions) => set({ sessions }),
      setMessages: (messages) => set({ messages }),
      addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
      setToolMessages: (messages) => set({ toolMessages: messages }),
      setStream: (stream, startedAt) =>
        set({ stream: stream, streamStartedAt: startedAt ?? Date.now() }),
      setLoading: (loading) => set({ loading }),
      setSending: (sending) => set({ sending }),
      setCanAbort: (canAbort) => set({ canAbort }),
      setCompactionStatus: (status) => set({ compactionStatus: status }),
      setDraft: (draft) => set({ draft }),
      setAttachments: (attachments) => set({ attachments }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setSidebarContent: (content, error) =>
        set({ sidebarContent: content, sidebarError: error ?? null }),
      setFocusMode: (focusMode) => set({ focusMode }),
      clearStream: () => set({ stream: null, streamStartedAt: null }),
    }),
    {
      name: "openclaw-chat-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sessionKey: state.sessionKey,
        focusMode: state.focusMode,
      }),
    },
  ),
);
