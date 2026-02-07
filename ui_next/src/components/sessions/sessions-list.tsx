"use client";

import { useEffect, useMemo } from "react";
import { useSessions } from "../../hooks/use-sessions";
import type { GatewaySessionRow } from "../../types/sessions";
import { formatAgo } from "../../lib/format";

const THINK_LEVELS = ["", "off", "minimal", "low", "medium", "high"] as const;
const BINARY_THINK_LEVELS = ["", "off", "on"] as const;
const VERBOSE_LEVELS = [
  { value: "", label: "inherit" },
  { value: "off", label: "off (explicit)" },
  { value: "on", label: "on" },
] as const;
const REASONING_LEVELS = ["", "off", "on", "stream"] as const;

function normalizeProviderId(provider?: string | null): string {
  if (!provider) return "";
  const normalized = provider.trim().toLowerCase();
  if (normalized === "z.ai" || normalized === "z-ai") return "zai";
  return normalized;
}

function isBinaryThinkingProvider(provider?: string | null): boolean {
  return normalizeProviderId(provider) === "zai";
}

function resolveThinkLevelOptions(provider?: string | null): readonly string[] {
  return isBinaryThinkingProvider(provider) ? BINARY_THINK_LEVELS : THINK_LEVELS;
}

function resolveThinkLevelDisplay(value: string, isBinary: boolean): string {
  if (!isBinary) return value;
  if (!value || value === "off") return value;
  return "on";
}

function resolveThinkLevelPatchValue(value: string, isBinary: boolean): string | null {
  if (!value) return null;
  if (!isBinary) return value;
  if (value === "on") return "low";
  return value;
}

function formatSessionTokens(row: GatewaySessionRow): string {
  if (row.totalTokens) return row.totalTokens.toLocaleString();
  if (row.inputTokens || row.outputTokens) {
    const inTokens = row.inputTokens?.toLocaleString() ?? "0";
    const outTokens = row.outputTokens?.toLocaleString() ?? "0";
    return `${inTokens}/${outTokens}`;
  }
  return "n/a";
}

interface SessionsListProps {
  basePath?: string;
}

/**
 * 会话列表组件
 */
export function SessionsList({ basePath = "" }: SessionsListProps) {
  const {
    sessionsResult,
    isLoading,
    error,
    editingSession,
    editedFields,
    isSaving,
    saveError,
    hasChanges,
    loadSessions,
    deleteSession,
    startEditing,
    updateEditedField,
    clearEditedFields,
    saveSession,
    setSelectedSessionKey,
  } = useSessions();

  // Load sessions on mount, avoid dependency on loadSessions
  useEffect(() => {
    loadSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rows = useMemo(() => sessionsResult?.sessions ?? [], [sessionsResult?.sessions]);

  const handlePatch = async (key: string, patch: Partial<GatewaySessionRow>) => {
    const session = rows.find((r) => r.key === key);
    if (!session) return;

    startEditing(session);

    // Apply each field update separately
    for (const [keyName, value] of Object.entries(patch)) {
      // Convert null to undefined for optional fields
      const finalValue = value === null ? undefined : value;
      // Use type assertion to satisfy the generic constraint
      updateEditedField(
        keyName as keyof GatewaySessionRow,
        finalValue as GatewaySessionRow[keyof GatewaySessionRow],
      );
    }

    await saveSession();
  };

  const handleDelete = async (key: string) => {
    if (!confirm(`Delete session "${key}"?`)) return;
    try {
      await deleteSession(key);
    } catch (err) {
      console.error("Failed to delete session:", err);
    }
  };

  const handleChatClick = (key: string) => {
    setSelectedSessionKey(key);
    window.location.href = `${basePath}/chat?session=${encodeURIComponent(key)}`;
  };

  return (
    <div className="sessions-container">
      <div className="card-header flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Sessions</h2>
          <p className="text-sm text-muted-foreground">Active session keys and per-session overrides.</p>
        </div>
        <button
          type="button"
          disabled={isLoading}
          onClick={loadSessions}
          className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 disabled:opacity-50"
        >
          {isLoading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {(error || saveError) && (
        <div className="p-4 mb-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 rounded-md">
          {error || saveError}
        </div>
      )}

      <div className="text-muted-foreground text-sm mb-4">
        {sessionsResult ? `Store: ${sessionsResult.path}` : ""}
      </div>

      {rows.length === 0 ? (
        <div className="text-muted-foreground text-center py-8">No sessions found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-2">Key</th>
                <th className="text-left p-2">Label</th>
                <th className="text-left p-2">Kind</th>
                <th className="text-left p-2">Updated</th>
                <th className="text-left p-2">Tokens</th>
                <th className="text-left p-2">Thinking</th>
                <th className="text-left p-2">Verbose</th>
                <th className="text-left p-2">Reasoning</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const updated = row.updatedAt ? formatAgo(row.updatedAt) : "n/a";
                const rawThinking = row.thinkingLevel ?? "";
                const isBinaryThinking = isBinaryThinkingProvider(row.modelProvider);
                const thinking = resolveThinkLevelDisplay(rawThinking, isBinaryThinking);
                const thinkLevels = resolveThinkLevelOptions(row.modelProvider);
                const verbose = row.verboseLevel ?? "";
                const reasoning = row.reasoningLevel ?? "";
                const displayName = row.displayName ?? row.key;
                const canLink = row.kind !== "global";

                return (
                  <tr key={row.key} className="border-b border-border hover:bg-muted/50">
                    <td className="p-2">
                      <span className="font-mono text-sm">
                        {canLink ? (
                          <button
                            type="button"
                            onClick={() => handleChatClick(row.key)}
                            className="text-accent hover:underline"
                          >
                            {displayName}
                          </button>
                        ) : (
                          displayName
                        )}
                      </span>
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        defaultValue={row.label ?? ""}
                        disabled={isSaving}
                        placeholder="(optional)"
                        className="w-full px-2 py-1 border border-border rounded bg-background"
                        onChange={(e) => {
                          const value = e.target.value.trim();
                          handlePatch(row.key, { label: value || undefined });
                        }}
                      />
                    </td>
                    <td className="p-2">{row.kind}</td>
                    <td className="p-2">{updated}</td>
                    <td className="p-2">{formatSessionTokens(row)}</td>
                    <td className="p-2">
                      <select
                        defaultValue={thinking}
                        disabled={isSaving}
                        className="px-2 py-1 border border-border rounded bg-background"
                        onChange={(e) => {
                          const value = e.target.value;
                          const patchedValue = resolveThinkLevelPatchValue(value, isBinaryThinking);
                          handlePatch(row.key, {
                            thinkingLevel: patchedValue ?? undefined,
                          });
                        }}
                      >
                        {thinkLevels.map((level) => (
                          <option key={level} value={level}>
                            {level || "inherit"}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      <select
                        defaultValue={verbose}
                        disabled={isSaving}
                        className="px-2 py-1 border border-border rounded bg-background"
                        onChange={(e) => {
                          const value = e.target.value;
                          handlePatch(row.key, { verboseLevel: value || undefined });
                        }}
                      >
                        {VERBOSE_LEVELS.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      <select
                        defaultValue={reasoning}
                        disabled={isSaving}
                        className="px-2 py-1 border border-border rounded bg-background"
                        onChange={(e) => {
                          const value = e.target.value;
                          handlePatch(row.key, { reasoningLevel: value || undefined });
                        }}
                      >
                        {REASONING_LEVELS.map((level) => (
                          <option key={level} value={level}>
                            {level || "inherit"}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => handleDelete(row.key)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
