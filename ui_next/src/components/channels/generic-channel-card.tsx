"use client";

import { ChannelStatusCard, ChannelInfoRow } from "./channel-status-card";
import type { TelegramStatus, DiscordStatus, SlackStatus, SignalStatus } from "@/types/channels";

interface GenericChannelCardProps {
  title: string;
  icon: string;
  status: {
    configured: boolean;
    running: boolean;
    tokenSource?: string | null;
    lastStartAt?: number | null;
    lastStopAt?: number | null;
    lastError?: string | null;
    probe?: {
      ok: boolean;
      bot?: { id?: number | string; username?: string } | null;
      team?: { id?: string; name?: string } | null;
      version?: string | null;
    } | null;
  } | null;
  isLoading: boolean;
  onProbe: () => void;
  onStart?: () => void;
  onStop?: () => void;
}

/**
 * 通用频道卡片组件
 * 适用于 Telegram, Discord, Slack, Signal 等频道
 */
export function GenericChannelCard({
  title,
  icon,
  status,
  isLoading,
  onProbe,
  onStart,
  onStop,
}: GenericChannelCardProps) {
  const probe = status?.probe;

  return (
    <ChannelStatusCard
      title={title}
      icon={icon}
      status={status}
      isLoading={isLoading}
      onProbe={onProbe}
      onStart={onStart}
      onStop={onStop}
    >
      {status && (
        <div className="space-y-1 mb-4">
          <ChannelInfoRow label="Configured" value={status.configured ? "Yes" : "No"} />
          <ChannelInfoRow label="Running" value={status.running ? "Yes" : "No"} />
          {status.tokenSource && (
            <ChannelInfoRow label="Token Source" value={status.tokenSource} />
          )}
          {status.lastStartAt && (
            <ChannelInfoRow
              label="Last Start"
              value={new Date(status.lastStartAt).toLocaleString()}
            />
          )}
          {status.lastStopAt && (
            <ChannelInfoRow
              label="Last Stop"
              value={new Date(status.lastStopAt).toLocaleString()}
            />
          )}

          {/* 探测结果信息 */}
          {probe && (
            <>
              <ChannelInfoRow label="Probe Status" value={probe.ok ? "OK" : "Failed"} />
              {probe.bot && (
                <>
                  <ChannelInfoRow label="Bot ID" value={probe.bot.id?.toString()} />
                  <ChannelInfoRow label="Bot Username" value={probe.bot.username} />
                </>
              )}
              {probe.team && (
                <>
                  <ChannelInfoRow label="Team ID" value={probe.team.id} />
                  <ChannelInfoRow label="Team Name" value={probe.team.name} />
                </>
              )}
              {probe.version && (
                <ChannelInfoRow label="Version" value={probe.version} />
              )}
            </>
          )}
        </div>
      )}
    </ChannelStatusCard>
  );
}

/**
 * Telegram 频道卡片
 */
export function TelegramCard(props: Omit<GenericChannelCardProps, "title" | "icon">) {
  return <GenericChannelCard {...props} title="Telegram" icon="✈️" />;
}

/**
 * Discord 频道卡片
 */
export function DiscordCard(props: Omit<GenericChannelCardProps, "title" | "icon">) {
  return <GenericChannelCard {...props} title="Discord" icon="🎮" />;
}

/**
 * Slack 频道卡片
 */
export function SlackCard(props: Omit<GenericChannelCardProps, "title" | "icon">) {
  return <GenericChannelCard {...props} title="Slack" icon="💼" />;
}

/**
 * Signal 频道卡片
 */
export function SignalCard(props: Omit<GenericChannelCardProps, "title" | "icon">) {
  return <GenericChannelCard {...props} title="Signal" icon="🔐" />;
}

/**
 * iMessage 频道卡片
 */
export function IMessageCard(props: Omit<GenericChannelCardProps, "title" | "icon">) {
  return <GenericChannelCard {...props} title="iMessage" icon="💬" />;
}

/**
 * Google Chat 频道卡片
 */
export function GoogleChatCard(props: Omit<GenericChannelCardProps, "title" | "icon">) {
  return <GenericChannelCard {...props} title="Google Chat" icon="💬" />;
}

/**
 * Nostr 频道卡片
 */
export function NostrCard(props: Omit<GenericChannelCardProps, "title" | "icon">) {
  return <GenericChannelCard {...props} title="Nostr" icon="🔑" />;
}

/**
 * MS Teams 频道卡片
 */
export function MSTeamsCard(props: Omit<GenericChannelCardProps, "title" | "icon">) {
  return <GenericChannelCard {...props} title="MS Teams" icon="👥" />;
}
