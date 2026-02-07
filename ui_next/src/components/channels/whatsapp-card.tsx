"use client";

import { useState } from "react";
import { ChannelStatusCard, ChannelInfoRow } from "./channel-status-card";
import type { WhatsAppStatus } from "@/types/channels";

interface WhatsAppCardProps {
  status: WhatsAppStatus | null;
  isLoading: boolean;
  onProbe: () => void;
  onStart: () => void;
  onStop: () => void;
  onLogout: () => void;
  onLoginStart?: (force: boolean) => Promise<{ qrDataUrl?: string }>;
  onLoginWait?: () => Promise<void>;
}

/**
 * WhatsApp 频道卡片
 */
export function WhatsAppCard({
  status,
  isLoading,
  onProbe,
  onStart,
  onStop,
  onLogout,
  onLoginStart,
  onLoginWait,
}: WhatsAppCardProps) {
  const [loginState, setLoginState] = useState<{
    qrDataUrl: string | null;
    message: string | null;
    connected: boolean | null;
    busy: boolean;
  }>({ qrDataUrl: null, message: null, connected: null, busy: false });

  const handleLoginStart = async () => {
    if (!onLoginStart || loginState.busy) return;

    setLoginState((prev) => ({ ...prev, busy: true, message: "Starting login..." }));

    try {
      const res = await onLoginStart(false);
      setLoginState({
        qrDataUrl: res.qrDataUrl ?? null,
        message: "QR code generated",
        connected: false,
        busy: false,
      });
    } catch (err) {
      setLoginState({
        qrDataUrl: null,
        message: String(err),
        connected: null,
        busy: false,
      });
    }
  };

  const handleLoginWait = async () => {
    if (!onLoginWait || loginState.busy) return;

    setLoginState((prev) => ({ ...prev, busy: true, message: "Waiting for connection..." }));

    // 模拟等待过程
    const interval = setInterval(async () => {
      try {
        await onLoginWait();
        // 登录成功后刷新状态
        setLoginState({
          qrDataUrl: null,
          message: "Connected successfully!",
          connected: true,
          busy: false,
        });
        clearInterval(interval);
        await onProbe(); // 刷新状态
      } catch {
        // 继续等待
      }
    }, 3000);

    // 2分钟后超时
    setTimeout(() => {
      clearInterval(interval);
      setLoginState((prev) => ({ ...prev, busy: false }));
    }, 120000);
  };

  const showQrCode = loginState.qrDataUrl != null;
  const isLinked = status?.linked ?? false;
  const isConnected = status?.connected ?? false;

  return (
    <ChannelStatusCard
      title="WhatsApp"
      icon="📱"
      status={status}
      isLoading={isLoading}
      onProbe={onProbe}
      onStart={onStart}
      onStop={onStop}
      onLogout={onLogout}
    >
      {/* WhatsApp 登录流程 */}
      {!isLinked && !isConnected && (
        <div className="mb-4">
          {!showQrCode && (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-4">
                Scan QR code to link your WhatsApp account
              </p>
              <button
                type="button"
                onClick={handleLoginStart}
                disabled={loginState.busy}
                className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 disabled:opacity-50"
              >
                {loginState.busy ? "Loading..." : "Get QR Code"}
              </button>
              {loginState.message && (
                <p className="text-xs text-muted-foreground mt-2">{loginState.message}</p>
              )}
            </div>
          )}

          {showQrCode && (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-4">
                Scan this QR code with WhatsApp
              </p>
              <img
                src={loginState.qrDataUrl!}
                alt="WhatsApp QR Code"
                className="w-48 h-48 mx-auto border border-border rounded-lg"
              />
              <div className="mt-4 space-x-2">
                <button
                  type="button"
                  onClick={handleLoginWait}
                  disabled={loginState.busy}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {loginState.busy ? "Checking..." : "I've Scanned"}
                </button>
                <button
                  type="button"
                  onClick={() => setLoginState({ qrDataUrl: null, message: null, connected: null, busy: false })}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
              {loginState.message && (
                <p className="text-xs text-muted-foreground mt-2">{loginState.message}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* WhatsApp 状态信息 */}
      {status && (
        <div className="space-y-1 mb-4">
          <ChannelInfoRow label="Configured" value={status.configured ? "Yes" : "No"} />
          <ChannelInfoRow label="Linked" value={status.linked ? "Yes" : "No"} />
          <ChannelInfoRow label="Running" value={status.running ? "Yes" : "No"} />
          <ChannelInfoRow label="Connected" value={status.connected ? "Yes" : "No"} />
          {status.lastConnectedAt && (
            <ChannelInfoRow
              label="Last Connected"
              value={new Date(status.lastConnectedAt).toLocaleString()}
            />
          )}
          {status.reconnectAttempts > 0 && (
            <ChannelInfoRow label="Reconnect Attempts" value={status.reconnectAttempts.toString()} />
          )}
        </div>
      )}
    </ChannelStatusCard>
  );
}
