"use client";

import { useCallback } from "react";
import { useGateway } from "../contexts/gateway-context";
import { useChannelsStore } from "../store/use-channels-store";
import type { ChannelsStatusSnapshot } from "../types/channels";

/**
 * 频道管理 Hook
 * 从 ui_lit/src/ui/controllers/channels.ts 迁移
 */
export function useChannels() {
  const gateway = useGateway();

  const {
    snapshot,
    whatsapp,
    telegram,
    discord,
    googleChat,
    slack,
    signal,
    imessage,
    nostr,
    msteams,
    selectedTab,
    isRefreshing,
    isProbing,
    probeErrors,
    setSnapshot,
    setWhatsApp,
    setTelegram,
    setDiscord,
    setGoogleChat,
    setSlack,
    setSignal,
    setIMessage,
    setNostr,
    setMSTeams,
    setSelectedTab,
    setIsRefreshing,
    setIsProbing,
    setProbeError,
    clearProbeErrors,
  } = useChannelsStore();

  /**
   * 加载频道状态
   */
  const loadChannels = useCallback(
    async (probe = false) => {
      if (!gateway.client || !gateway.connected) {
        return;
      }

      setIsRefreshing(true);
      clearProbeErrors();

      try {
        const res = (await gateway.client.request("channels.status", {
          probe,
          timeoutMs: 8000,
        })) as ChannelsStatusSnapshot;

        setSnapshot(res);

        // 更新各个频道的状态
        if (res.channelAccounts) {
          if (res.channelAccounts.whatsapp) {
            setWhatsApp(res.channelAccounts.whatsapp[0] as never);
          }
          if (res.channelAccounts.telegram) {
            setTelegram(res.channelAccounts.telegram[0] as never);
          }
          if (res.channelAccounts.discord) {
            setDiscord(res.channelAccounts.discord[0] as never);
          }
          if (res.channelAccounts.googlechat) {
            setGoogleChat(res.channelAccounts.googlechat[0] as never);
          }
          if (res.channelAccounts.slack) {
            setSlack(res.channelAccounts.slack[0] as never);
          }
          if (res.channelAccounts.signal) {
            setSignal(res.channelAccounts.signal[0] as never);
          }
          if (res.channelAccounts.imessage) {
            setIMessage(res.channelAccounts.imessage[0] as never);
          }
          if (res.channelAccounts.nostr) {
            setNostr(res.channelAccounts.nostr[0] as never);
          }
          if (res.channelAccounts.msteams) {
            setMSTeams(res.channelAccounts.msteams[0] as never);
          }
        }
      } catch (err) {
        const error = String(err);
        setProbeError("general", error);
      } finally {
        setIsRefreshing(false);
      }
    },
    [
      gateway.client,
      gateway.connected,
      setSnapshot,
      setWhatsApp,
      setTelegram,
      setDiscord,
      setGoogleChat,
      setSlack,
      setSignal,
      setIMessage,
      setNostr,
      setMSTeams,
      setIsRefreshing,
      setProbeError,
      clearProbeErrors,
    ],
  );

  /**
   * 探测频道
   */
  const probeChannel = useCallback(
    async (channel: string) => {
      if (!gateway.client || !gateway.connected) {
        return;
      }

      setIsProbing(true);
      setProbeError(channel, null);

      try {
        const res = await gateway.client.request("channels.probe", {
          channel,
          timeoutMs: 15000,
        });

        // 更新对应频道的状态
        switch (channel) {
          case "whatsapp":
            setWhatsApp(res as never);
            break;
          case "telegram":
            setTelegram(res as never);
            break;
          case "discord":
            setDiscord(res as never);
            break;
          case "googlechat":
            setGoogleChat(res as never);
            break;
          case "slack":
            setSlack(res as never);
            break;
          case "signal":
            setSignal(res as never);
            break;
          case "imessage":
            setIMessage(res as never);
            break;
          case "nostr":
            setNostr(res as never);
            break;
          case "msteams":
            setMSTeams(res as never);
            break;
        }
      } catch (err) {
        setProbeError(channel, String(err));
      } finally {
        setIsProbing(false);
      }
    },
    [
      gateway.client,
      gateway.connected,
      setWhatsApp,
      setTelegram,
      setDiscord,
      setGoogleChat,
      setSlack,
      setSignal,
      setIMessage,
      setNostr,
      setMSTeams,
      setIsProbing,
      setProbeError,
    ],
  );

  /**
   * 启动频道
   */
  const startChannel = useCallback(
    async (channel: string) => {
      if (!gateway.client || !gateway.connected) {
        return;
      }

      try {
        await gateway.client.request("channels.start", { channel });
        await loadChannels(false);
      } catch (err) {
        setProbeError(channel, String(err));
      }
    },
    [gateway.client, gateway.connected, loadChannels, setProbeError],
  );

  /**
   * 停止频道
   */
  const stopChannel = useCallback(
    async (channel: string) => {
      if (!gateway.client || !gateway.connected) {
        return;
      }

      try {
        await gateway.client.request("channels.stop", { channel });
        await loadChannels(false);
      } catch (err) {
        setProbeError(channel, String(err));
      }
    },
    [gateway.client, gateway.connected, loadChannels, setProbeError],
  );

  /**
   * 登出频道
   */
  const logoutChannel = useCallback(
    async (channel: string) => {
      if (!gateway.client || !gateway.connected) {
        return;
      }

      try {
        await gateway.client.request("channels.logout", { channel });
        await loadChannels(false);
      } catch (err) {
        setProbeError(channel, String(err));
      }
    },
    [gateway.client, gateway.connected, loadChannels, setProbeError],
  );

  return {
    // 状态
    snapshot,
    whatsapp,
    telegram,
    discord,
    googleChat,
    slack,
    signal,
    imessage,
    nostr,
    msteams,
    selectedTab,
    isRefreshing,
    isProbing,
    probeErrors,

    // 操作
    loadChannels,
    probeChannel,
    startChannel,
    stopChannel,
    logoutChannel,
    setSelectedTab,
  };
}
