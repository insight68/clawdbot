"use client";

import { useEffect, useState } from "react";
import type { PresenceEntry } from "@/types/sessions";
import { formatAgo } from "@/lib/format";

export default function InstancesPage() {
  const [entries, setEntries] = useState<PresenceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastError, setLastError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    void fetchInstances();
  }, []);

  const fetchInstances = async () => {
    setLoading(true);
    setLastError(null);
    setStatusMessage(null);

    try {
      // TODO: 从 Gateway API 获取真实的实例数据
      // 目前使用模拟数据
      setEntries([
        {
          instanceId: "gateway-main",
          host: "gateway-host",
          ip: "192.168.1.100",
          version: "1.0.0",
          platform: "darwin",
          deviceFamily: "mac",
          modelIdentifier: "MacBookPro",
          mode: "local",
          lastInputSeconds: 45,
          reason: "heartbeat",
          text: "Connected and active",
          ts: Date.now() - 45000,
        },
        {
          instanceId: "client-web-1",
          host: "web-client-01",
          ip: "192.168.1.101",
          version: "1.0.0",
          platform: "browser",
          deviceFamily: "web",
          mode: "remote",
          lastInputSeconds: 120,
          reason: "presence",
          text: "Web client active",
          ts: Date.now() - 120000,
        },
      ]);
    } catch (error) {
      setLastError(String(error));
    } finally {
      setLoading(false);
    }
  };

  const formatPresenceSummary = (entry: PresenceEntry): string => {
    const host = entry.host ?? "unknown";
    const ip = entry.ip ? `(${entry.ip})` : "";
    const mode = entry.mode ?? "";
    const version = entry.version ?? "";
    return `${host} ${ip} ${mode} ${version}`.trim();
  };

  const formatPresenceAge = (entry: PresenceEntry): string => {
    const ts = entry.ts ?? null;
    return ts ? formatAgo(ts) : "n/a";
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Connected Instances</h1>
          <p className="text-muted-foreground mt-1">Presence beacons from the gateway and clients.</p>
        </div>
        <button
          type="button"
          disabled={loading}
          onClick={fetchInstances}
          className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {lastError && (
        <div className="p-4 mb-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 rounded-md">
          {lastError}
        </div>
      )}

      {statusMessage && (
        <div className="p-4 mb-4 bg-blue-100 dark:bg-blue-900/20 border border-blue-400 dark:border-blue-800 text-blue-700 dark:text-blue-300 rounded-md">
          {statusMessage}
        </div>
      )}

      {entries.length === 0 ? (
        <div className="text-muted-foreground text-center py-12">
          No instances reported yet.
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, index) => {
            const lastInput = entry.lastInputSeconds != null ? `${entry.lastInputSeconds}s ago` : "n/a";
            const mode = entry.mode ?? "unknown";
            const age = formatPresenceAge(entry);

            return (
              <div key={index} className="border border-border rounded-lg p-4 bg-card">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{entry.host ?? "unknown host"}</div>
                    <div className="text-sm text-muted-foreground">{formatPresenceSummary(entry)}</div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-2 py-1 text-xs bg-muted rounded-md">{mode}</span>
                      {entry.platform && (
                        <span className="px-2 py-1 text-xs bg-muted rounded-md">{entry.platform}</span>
                      )}
                      {entry.deviceFamily && (
                        <span className="px-2 py-1 text-xs bg-muted rounded-md">{entry.deviceFamily}</span>
                      )}
                      {entry.modelIdentifier && (
                        <span className="px-2 py-1 text-xs bg-muted rounded-md">{entry.modelIdentifier}</span>
                      )}
                      {entry.version && (
                        <span className="px-2 py-1 text-xs bg-muted rounded-md">{entry.version}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground text-right">
                    <div>{age}</div>
                    <div>Last input {lastInput}</div>
                    <div>Reason {entry.reason ?? ""}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
