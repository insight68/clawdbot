"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark" | "system";

interface UIState {
  theme: ThemeMode;
  chatFocusMode: boolean;
  chatShowThinking: boolean;
  splitRatio: number;
  navCollapsed: boolean;
  navGroupsCollapsed: Record<string, boolean>;
  gatewayUrl: string;

  // Actions
  setTheme: (theme: ThemeMode) => void;
  setChatFocusMode: (enabled: boolean) => void;
  setChatShowThinking: (enabled: boolean) => void;
  setSplitRatio: (ratio: number) => void;
  setNavCollapsed: (collapsed: boolean) => void;
  setNavGroupsCollapsed: (groups: Record<string, boolean>) => void;
  toggleNavCollapsed: () => void;
  setGatewayUrl: (url: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: "system",
      chatFocusMode: false,
      chatShowThinking: false,
      splitRatio: 0.4,
      navCollapsed: false,
      navGroupsCollapsed: {},
      gatewayUrl: "ws://localhost:18789",

      setTheme: (theme) => set({ theme }),
      setChatFocusMode: (enabled) => set({ chatFocusMode: enabled }),
      setChatShowThinking: (enabled) => set({ chatShowThinking: enabled }),
      setSplitRatio: (ratio) => set({ splitRatio: Math.max(0.3, Math.min(0.7, ratio)) }),
      setNavCollapsed: (collapsed) => set({ navCollapsed: collapsed }),
      setNavGroupsCollapsed: (groups) => set({ navGroupsCollapsed: groups }),
      toggleNavCollapsed: () => set((state) => ({ navCollapsed: !state.navCollapsed })),
      setGatewayUrl: (url) => set({ gatewayUrl: url }),
    }),
    {
      name: "openclaw-ui-storage",
    },
  ),
);
