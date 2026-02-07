"use client";

import { create } from "zustand";
import {
  ChannelsStatusSnapshot,
  WhatsAppStatus,
  TelegramStatus,
  DiscordStatus,
  GoogleChatStatus,
  SlackStatus,
  SignalStatus,
  IMessageStatus,
  NostrStatus,
  MSTeamsStatus,
} from "../types/channels";

type ChannelTab =
  | "whatsapp"
  | "telegram"
  | "discord"
  | "google-chat"
  | "slack"
  | "signal"
  | "imessage"
  | "nostr"
  | "msteams"
  | "cron";

interface ChannelsState {
  // 频道状态快照
  snapshot: ChannelsStatusSnapshot | null;

  // 单个频道状态
  whatsapp: WhatsAppStatus | null;
  telegram: TelegramStatus | null;
  discord: DiscordStatus | null;
  googleChat: GoogleChatStatus | null;
  slack: SlackStatus | null;
  signal: SignalStatus | null;
  imessage: IMessageStatus | null;
  nostr: NostrStatus | null;
  msteams: MSTeamsStatus | null;

  // UI 状态
  selectedTab: ChannelTab;
  isRefreshing: boolean;
  isProbing: boolean;
  probeErrors: Record<string, string | null>;

  // 操作
  setSnapshot: (snapshot: ChannelsStatusSnapshot | null) => void;
  setWhatsApp: (status: WhatsAppStatus | null) => void;
  setTelegram: (status: TelegramStatus | null) => void;
  setDiscord: (status: DiscordStatus | null) => void;
  setGoogleChat: (status: GoogleChatStatus | null) => void;
  setSlack: (status: SlackStatus | null) => void;
  setSignal: (status: SignalStatus | null) => void;
  setIMessage: (status: IMessageStatus | null) => void;
  setNostr: (status: NostrStatus | null) => void;
  setMSTeams: (status: MSTeamsStatus | null) => void;
  setSelectedTab: (tab: ChannelTab) => void;
  setIsRefreshing: (refreshing: boolean) => void;
  setIsProbing: (probing: boolean) => void;
  setProbeError: (channel: string, error: string | null) => void;
  clearProbeErrors: () => void;
}

export const useChannelsStore = create<ChannelsState>()((set) => ({
  // 初始状态
  snapshot: null,
  whatsapp: null,
  telegram: null,
  discord: null,
  googleChat: null,
  slack: null,
  signal: null,
  imessage: null,
  nostr: null,
  msteams: null,
  selectedTab: "whatsapp",
  isRefreshing: false,
  isProbing: false,
  probeErrors: {},

  // 操作
  setSnapshot: (snapshot) => set({ snapshot }),
  setWhatsApp: (whatsapp) => set({ whatsapp }),
  setTelegram: (telegram) => set({ telegram }),
  setDiscord: (discord) => set({ discord }),
  setGoogleChat: (googleChat) => set({ googleChat }),
  setSlack: (slack) => set({ slack }),
  setSignal: (signal) => set({ signal }),
  setIMessage: (imessage) => set({ imessage }),
  setNostr: (nostr) => set({ nostr }),
  setMSTeams: (msteams) => set({ msteams }),
  setSelectedTab: (selectedTab) => set({ selectedTab }),
  setIsRefreshing: (isRefreshing) => set({ isRefreshing }),
  setIsProbing: (isProbing) => set({ isProbing }),
  setProbeError: (channel, error) =>
    set((state) => ({
      probeErrors: { ...state.probeErrors, [channel]: error },
    })),
  clearProbeErrors: () => set({ probeErrors: {} }),
}));
