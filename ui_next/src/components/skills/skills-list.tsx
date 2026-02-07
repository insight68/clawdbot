"use client";

import { useEffect, useMemo, useState } from "react";
import { useSkills } from "../../hooks/use-skills";
import type { SkillStatusEntry } from "../../types/skills";

interface SkillMessage {
  kind: "error" | "success";
  message: string;
}

function clampText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}

interface SkillsListProps {
  /**
   * 基础路径
   */
  basePath?: string;
}

/**
 * 技能列表组件
 */
export function SkillsList({ basePath = "" }: SkillsListProps) {
  const {
    report,
    installingSkill,
    isLoading,
    error,
    searchQuery,
    loadSkills,
    installSkill,
    toggleSkill,
    setSearchQuery,
  } = useSkills();

  const [apiKeyEdits, setApiKeyEdits] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<Record<string, SkillMessage>>({});

  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

  const skills = useMemo(() => report?.skills ?? [], [report?.skills]);
  const filtered = useMemo(() => {
    const filter = searchQuery.trim().toLowerCase();
    return filter
      ? skills.filter((skill) =>
          [skill.name, skill.description, skill.source].join(" ").toLowerCase().includes(filter),
        )
      : skills;
  }, [skills, searchQuery]);

  const handleFilterChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleApiKeyEdit = (skillKey: string, value: string) => {
    setApiKeyEdits((prev) => ({ ...prev, [skillKey]: value }));
  };

  const handleSaveApiKey = async (skillKey: string) => {
    const apiKey = apiKeyEdits[skillKey];
    if (!apiKey) return;

    // TODO: Implement API key save via gateway
    console.log("Save API key for", skillKey, ":", apiKey);
    setMessages((prev) => ({
      ...prev,
      [skillKey]: { kind: "success", message: "API key saved" },
    }));
    setTimeout(() => {
      setMessages((prev) => {
        const next = { ...prev };
        delete next[skillKey];
        return next;
      });
    }, 3000);
  };

  const handleInstall = async (skillKey: string, name: string, installId: string) => {
    setMessages((prev) => {
      const next = { ...prev };
      delete next[skillKey];
      return next;
    });
    try {
      await installSkill(name);
    } catch (err) {
      setMessages((prev) => ({
        ...prev,
        [skillKey]: { kind: "error", message: String(err) },
      }));
    }
  };

  const handleToggle = async (skillKey: string, currentlyDisabled: boolean) => {
    setMessages((prev) => {
      const next = { ...prev };
      delete next[skillKey];
      return next;
    });
    try {
      await toggleSkill(skillKey, !currentlyDisabled);
    } catch (err) {
      setMessages((prev) => ({
        ...prev,
        [skillKey]: { kind: "error", message: String(err) },
      }));
    }
  };

  return (
    <div className="skills-container">
      <div className="card-header flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Skills</h2>
          <p className="text-sm text-muted-foreground">Bundled, managed, and workspace skills.</p>
        </div>
        <button
          type="button"
          disabled={isLoading}
          onClick={loadSkills}
          className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 disabled:opacity-50"
        >
          {isLoading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="flex gap-4 mt-4">
        <label className="flex-1 field">
          <span className="text-sm">Filter</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleFilterChange(e.target.value)}
            placeholder="Search skills"
            className="w-full px-3 py-2 border border-border rounded-md bg-background"
          />
        </label>
        <div className="text-muted-foreground text-sm flex items-center">
          {filtered.length} shown
        </div>
      </div>

      {error && (
        <div className="p-4 mt-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 rounded-md">
          {error}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-muted-foreground text-center py-8">No skills found.</div>
      ) : (
        <div className="space-y-4 mt-4">
          {filtered.map((skill) => (
            <SkillCard
              key={skill.skillKey}
              skill={skill}
              busy={installingSkill?.skillKey === skill.skillKey}
              apiKey={apiKeyEdits[skill.skillKey] ?? ""}
              message={messages[skill.skillKey] ?? null}
              onApiKeyEdit={(value) => handleApiKeyEdit(skill.skillKey, value)}
              onSaveApiKey={() => handleSaveApiKey(skill.skillKey)}
              onInstall={() => handleInstall(skill.skillKey, skill.name, skill.install[0]?.id ?? "")}
              onToggle={() => handleToggle(skill.skillKey, skill.disabled)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface SkillCardProps {
  skill: SkillStatusEntry;
  busy: boolean;
  apiKey: string;
  message: SkillMessage | null;
  onApiKeyEdit: (value: string) => void;
  onSaveApiKey: () => void;
  onInstall: () => void;
  onToggle: () => void;
}

function SkillCard({
  skill,
  busy,
  apiKey,
  message,
  onApiKeyEdit,
  onSaveApiKey,
  onInstall,
  onToggle,
}: SkillCardProps) {
  const canInstall = skill.install.length > 0 && skill.missing.bins.length > 0;
  const missing = [
    ...skill.missing.bins.map((b) => `bin:${b}`),
    ...skill.missing.env.map((e) => `env:${e}`),
    ...skill.missing.config.map((c) => `config:${c}`),
    ...skill.missing.os.map((o) => `os:${o}`),
  ];
  const reasons: string[] = [];
  if (skill.disabled) reasons.push("disabled");
  if (skill.blockedByAllowlist) reasons.push("blocked by allowlist");

  return (
    <div className="border border-border rounded-lg p-4 bg-card">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">
            {skill.emoji ? `${skill.emoji} ` : ""}
            {skill.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{clampText(skill.description, 140)}</p>

          <div className="flex gap-2 mt-3 flex-wrap">
            <span className="px-2 py-1 text-xs bg-muted rounded-md">{skill.source}</span>
            <span
              className={`px-2 py-1 text-xs rounded-md ${
                skill.eligible ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
              }`}
            >
              {skill.eligible ? "eligible" : "blocked"}
            </span>
            {skill.disabled && (
              <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-md">
                disabled
              </span>
            )}
          </div>

          {missing.length > 0 && (
            <div className="text-muted-foreground text-sm mt-3">Missing: {missing.join(", ")}</div>
          )}

          {reasons.length > 0 && (
            <div className="text-muted-foreground text-sm mt-1">Reason: {reasons.join(", ")}</div>
          )}

          {skill.homepage && (
            <a
              href={skill.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent text-sm hover:underline mt-2 inline-block"
            >
              View documentation
            </a>
          )}
        </div>

        <div className="flex gap-2 flex-wrap ml-4">
          <button
            type="button"
            disabled={busy}
            onClick={onToggle}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 disabled:opacity-50"
          >
            {skill.disabled ? "Enable" : "Disable"}
          </button>
          {canInstall && skill.install[0] && (
            <button
              type="button"
              disabled={busy}
              onClick={onInstall}
              className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 disabled:opacity-50"
            >
              {busy ? "Installing..." : skill.install[0].label}
            </button>
          )}
        </div>
      </div>

      {message && (
        <div
          className={`mt-3 text-sm ${
            message.kind === "error"
              ? "text-red-600 dark:text-red-400"
              : "text-green-600 dark:text-green-400"
          }`}
        >
          {message.message}
        </div>
      )}

      {skill.primaryEnv && (
        <div className="mt-4 pt-4 border-t border-border">
          <label className="block text-sm mb-2">
            <span>API key</span>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => onApiKeyEdit(e.target.value)}
              placeholder="Enter API key"
              className="w-full px-3 py-2 border border-border rounded-md bg-background mt-1"
            />
          </label>
          <button
            type="button"
            disabled={busy || !apiKey}
            onClick={onSaveApiKey}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 mt-2"
          >
            Save key
          </button>
        </div>
      )}
    </div>
  );
}
