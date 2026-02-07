"use client";

import { useEffect, useMemo, useState } from "react";
import { useLogsAndCron } from "../../hooks/use-logs-cron";
import type { CronJob, CronSchedule, CronPayload } from "../../types/cron";
import { formatAgo, formatMs } from "../../lib/format";

/** Default Cron interval: 1 minute in milliseconds */
const DEFAULT_CRON_INTERVAL_MS = 60 * 1000;

/** Default "at" time: 1 hour from now in milliseconds */
const DEFAULT_AT_TIME_OFFSET_MS = 60 * 60 * 1000;

interface CronManagerProps {
  basePath?: string;
}

/**
 * Cron 任务管理组件
 */
export function CronManager({ basePath = "" }: CronManagerProps) {
  const {
    jobs,
    cronStatus,
    runLogs,
    editing,
    cronLoading,
    cronSaving,
    cronError,
    loadCronJobs,
    loadCronStatus,
    createCronJob,
    updateCronJob,
    deleteCronJob,
    startCreating,
    startEditing,
    stopEditing,
    updateEditingJob,
  } = useLogsAndCron();

  const [showRunLogs, setShowRunLogs] = useState(false);

  useEffect(() => {
    loadCronStatus();
    loadCronJobs();
  }, [loadCronStatus, loadCronJobs]);

  const filteredJobs = useMemo(() => {
    return jobs;
  }, [jobs]);

  const handleSave = async () => {
    if (!editing || !editing.job) return;

    const job = editing.job;

    try {
      if (job.id && editing.isEditing && !editing.isCreating) {
        await updateCronJob(job.id, job);
      } else {
        await createCronJob(job);
      }
    } catch (err) {
      console.error("Failed to save cron job:", err);
    }
  };

  const handleEdit = (job: CronJob) => {
    startEditing(job);
  };

  const handleCreate = () => {
    startCreating();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this cron job?")) return;
    try {
      await deleteCronJob(id);
    } catch (err) {
      console.error("Failed to delete cron job:", err);
    }
  };

  const formatSchedule = (schedule: CronSchedule): string => {
    switch (schedule.kind) {
      case "at":
        return `At ${new Date(schedule.atMs).toLocaleString()}`;
      case "every":
        return `Every ${formatMs(schedule.everyMs)}`;
      case "cron":
        return `Cron: ${schedule.expr}${schedule.tz ? ` (${schedule.tz})` : ""}`;
    }
  };

  const formatPayload = (payload: CronPayload): string => {
    switch (payload.kind) {
      case "systemEvent":
        return `System event: ${payload.text}`;
      case "agentTurn":
        return `Agent: ${payload.message}${payload.to ? ` to ${payload.to}` : ""}`;
    }
  };

  const getStatusBadge = (job: CronJob) => {
    if (!job.enabled) {
      return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 rounded-md">Disabled</span>;
    }
    if (!job.state) {
      return <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-md">Pending</span>;
    }
    switch (job.state.lastStatus) {
      case "ok":
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-md">OK</span>;
      case "error":
        return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-md">Error</span>;
      case "skipped":
        return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-md">Skipped</span>;
    }
  };

  return (
    <div className="cron-container">
      <div className="card-header flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Cron Jobs</h2>
          <p className="text-sm text-muted-foreground">
            Scheduled tasks and automation
            {cronStatus?.enabled ? ` (${cronStatus.jobs} jobs)` : " (disabled)"}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={cronLoading}
            onClick={() => {
              loadCronStatus();
              loadCronJobs();
            }}
            className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 disabled:opacity-50"
          >
            {cronLoading ? "Loading..." : "Refresh"}
          </button>
          <button
            type="button"
            onClick={handleCreate}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            New Job
          </button>
        </div>
      </div>

      {cronError && (
        <div className="p-4 mt-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 rounded-md">
          {cronError}
        </div>
      )}

      {editing?.job && (
        <CronJobEditor
          job={editing.job}
          onSave={handleSave}
          onCancel={stopEditing}
          onChange={updateEditingJob}
          isSaving={cronSaving}
        />
      )}

      {filteredJobs.length === 0 ? (
        <div className="text-muted-foreground text-center py-8">No cron jobs configured.</div>
      ) : (
        <div className="space-y-4 mt-4">
          {filteredJobs.map((job) => (
            <div key={job.id} className="border border-border rounded-lg p-4 bg-card">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">{job.name}</h3>
                    {getStatusBadge(job)}
                  </div>
                  {job.description && (
                    <p className="text-sm text-muted-foreground mt-1">{job.description}</p>
                  )}
                  <div className="mt-3 space-y-1 text-sm">
                    <div className="flex gap-2">
                      <span className="text-muted-foreground w-24">Schedule:</span>
                      <span className="font-mono">{formatSchedule(job.schedule)}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-muted-foreground w-24">Payload:</span>
                      <span>{formatPayload(job.payload)}</span>
                    </div>
                    {job.state?.nextRunAtMs && (
                      <div className="flex gap-2">
                        <span className="text-muted-foreground w-24">Next run:</span>
                        <span>{new Date(job.state.nextRunAtMs).toLocaleString()}</span>
                      </div>
                    )}
                    {job.state?.lastRunAtMs && (
                      <div className="flex gap-2">
                        <span className="text-muted-foreground w-24">Last run:</span>
                        <span>{formatAgo(job.state.lastRunAtMs)}</span>
                        {job.state.lastDurationMs && (
                          <span className="text-muted-foreground">
                            ({formatMs(job.state.lastDurationMs)})
                          </span>
                        )}
                      </div>
                    )}
                    {job.state?.lastError && (
                      <div className="flex gap-2 text-red-600 dark:text-red-400">
                        <span className="text-muted-foreground w-24">Error:</span>
                        <span className="text-sm">{job.state.lastError}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(job)}
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(job.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {runLogs.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Run Logs</h3>
            <button
              type="button"
              onClick={() => setShowRunLogs(!showRunLogs)}
              className="text-sm text-accent hover:underline"
            >
              {showRunLogs ? "Hide" : "Show"}
            </button>
          </div>
          {showRunLogs && (
            <div className="border border-border rounded-lg p-4 bg-card max-h-96 overflow-auto font-mono text-sm">
              {runLogs.map((log, idx) => (
                <div key={idx} className="py-1 border-b border-border last:border-0">
                  <span className="text-muted-foreground">
                    {new Date(log.ts).toLocaleString()}
                  </span>
                  <span className={`ml-2 ${
                    log.status === "ok" ? "text-green-600 dark:text-green-400" :
                    log.status === "error" ? "text-red-600 dark:text-red-400" :
                    "text-yellow-600 dark:text-yellow-400"
                  }`}>
                    {log.status}
                  </span>
                  <span className="ml-2">{log.jobId}</span>
                  {log.summary && <span className="ml-2 text-muted-foreground">- {log.summary}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface CronJobEditorProps {
  job: Partial<CronJob>;
  onSave: () => void;
  onCancel: () => void;
  onChange: (updates: Partial<CronJob>) => void;
  isSaving: boolean;
}

function CronJobEditor({ job, onSave, onCancel, onChange, isSaving }: CronJobEditorProps) {
  const updateField = <K extends keyof CronJob>(key: K, value: CronJob[K]) => {
    onChange({ [key]: value });
  };

  const updateSchedule = (updates: Partial<CronSchedule>) => {
    const currentSchedule = job.schedule ?? { kind: "every", everyMs: DEFAULT_CRON_INTERVAL_MS };
    onChange({
      schedule: { ...currentSchedule, ...updates } as CronSchedule,
    });
  };

  const updatePayload = (updates: Partial<CronPayload>) => {
    const currentPayload = job.payload ?? { kind: "systemEvent", text: "" };
    onChange({
      payload: { ...currentPayload, ...updates } as CronPayload,
    });
  };

  return (
    <div className="border border-border rounded-lg p-4 bg-card mt-4">
      <h3 className="text-lg font-semibold mb-4">{job.id ? "Edit Cron Job" : "New Cron Job"}</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <label className="field">
            <span className="text-sm">Name</span>
            <input
              type="text"
              value={job.name ?? ""}
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
            />
          </label>
          <label className="flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              checked={job.enabled ?? false}
              onChange={(e) => updateField("enabled", e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">Enabled</span>
          </label>
        </div>

        <label className="field">
          <span className="text-sm">Description</span>
          <textarea
            value={job.description ?? ""}
            onChange={(e) => updateField("description", e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background"
            rows={2}
          />
        </label>

        <div>
          <span className="text-sm block mb-2">Schedule Type</span>
          <select
            value={job.schedule?.kind ?? "every"}
            onChange={(e) => {
              const kind = e.target.value as CronSchedule["kind"];
              if (kind === "at") updateSchedule({ kind, atMs: Date.now() + DEFAULT_AT_TIME_OFFSET_MS });
              else if (kind === "every") updateSchedule({ kind, everyMs: DEFAULT_CRON_INTERVAL_MS });
              else updateSchedule({ kind, expr: "0 * * * *" });
            }}
            className="w-full px-3 py-2 border border-border rounded-md bg-background"
          >
            <option value="every">Every (interval)</option>
            <option value="at">At (specific time)</option>
            <option value="cron">Cron expression</option>
          </select>
        </div>

        {job.schedule?.kind === "every" && (
          <label className="field">
            <span className="text-sm">Interval (milliseconds)</span>
            <input
              type="number"
              value={job.schedule.everyMs ?? DEFAULT_CRON_INTERVAL_MS}
              onChange={(e) => updateSchedule({ everyMs: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
            />
          </label>
        )}

        {job.schedule?.kind === "at" && (
          <label className="field">
            <span className="text-sm">Run at (timestamp)</span>
            <input
              type="number"
              value={job.schedule.atMs ?? Date.now()}
              onChange={(e) => updateSchedule({ atMs: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
            />
          </label>
        )}

        {job.schedule?.kind === "cron" && (
          <label className="field">
            <span className="text-sm">Cron expression</span>
            <input
              type="text"
              value={job.schedule.expr ?? "0 * * * *"}
              onChange={(e) => updateSchedule({ expr: e.target.value })}
              placeholder="0 * * * *"
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
            />
          </label>
        )}

        <div className="flex gap-2 mt-4">
          <button
            type="button"
            disabled={isSaving || !job.name}
            onClick={onSave}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={onCancel}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
