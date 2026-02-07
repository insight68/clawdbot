"use client";

import { useCallback, useEffect } from "react";
import { useGateway } from "../contexts/gateway-context";
import { useLogsStore } from "../store/use-logs-store";
import { useCronStore } from "../store/use-cron-store";
import type { LogEntry } from "../types/logs";
import type { CronJob, CronStatus, CronRunLogEntry } from "../types/cron";

/**
 * 日志和 Cron 管理 Hook
 */
export function useLogsAndCron() {
  const gateway = useGateway();

  // 日志状态
  const {
    logs,
    rawLogs,
    viewMode: logsViewMode,
    selectedLogLevel,
    filterSubsystems,
    searchQuery,
    maxLogs,
    autoScroll,
    isLoading: logsLoading,
    error: logsError,
    setLogs,
    setRawLogs,
    setViewMode: setLogsViewMode,
    setSelectedLogLevel,
    setFilterSubsystems,
    toggleSubsystem,
    setSearchQuery,
    setMaxLogs,
    setAutoScroll,
    setIsLoading: setLogsIsLoading,
    setError: setLogsError,
  } = useLogsStore();

  // Cron 状态
  const {
    jobs,
    status: cronStatus,
    runLogs,
    editing,
    viewMode: cronViewMode,
    sortBy,
    sortOrder,
    searchQuery: cronSearchQuery,
    selectedJobId,
    showRunLogs,
    isLoading: cronLoading,
    isSaving: cronSaving,
    error: cronError,
    setJobs,
    setStatus,
    setRunLogs,
    setEditing,
    startEditing,
    startCreating,
    stopEditing,
    updateEditingJob,
    setViewMode: setCronViewMode,
    setSortBy,
    setSortOrder,
    setSearchQuery: setCronSearchQuery,
    setSelectedJobId,
    setShowRunLogs,
    setIsLoading: setCronIsLoading,
    setIsSaving,
    setError: setCronError,
  } = useCronStore();

  /**
   * 加载日志
   */
  const loadLogs = useCallback(async () => {
    if (!gateway.client || !gateway.connected) {
      return;
    }

    setLogsIsLoading(true);
    setLogsError(null);

    try {
      const res = (await gateway.client.request("logs.get", {
        limit: maxLogs,
      })) as { entries?: LogEntry[] };

      if (res.entries) {
        setLogs(res.entries);
      }
    } catch (err) {
      setLogsError(String(err));
    } finally {
      setLogsIsLoading(false);
    }
  }, [gateway.client, gateway.connected, maxLogs, setLogs, setLogsIsLoading, setLogsError]);

  /**
   * 加载 Cron 状态
   */
  const loadCronStatus = useCallback(async () => {
    if (!gateway.client || !gateway.connected) {
      return;
    }

    setCronIsLoading(true);
    setCronError(null);

    try {
      const res = (await gateway.client.request("cron.status", {})) as CronStatus;
      setStatus(res);
    } catch (err) {
      setCronError(String(err));
    } finally {
      setCronIsLoading(false);
    }
  }, [gateway.client, gateway.connected, setStatus, setCronIsLoading, setCronError]);

  /**
   * 加载 Cron 任务
   */
  const loadCronJobs = useCallback(async () => {
    if (!gateway.client || !gateway.connected) {
      return;
    }

    setCronIsLoading(true);
    setCronError(null);

    try {
      const res = (await gateway.client.request("cron.list", {})) as { jobs?: CronJob[] };
      if (res.jobs) {
        setJobs(res.jobs);
      }
    } catch (err) {
      setCronError(String(err));
    } finally {
      setCronIsLoading(false);
    }
  }, [gateway.client, gateway.connected, setJobs, setCronIsLoading, setCronError]);

  /**
   * 创建 Cron 任务
   */
  const createCronJob = useCallback(
    async (job: Omit<CronJob, "id" | "createdAtMs" | "updatedAtMs">) => {
      if (!gateway.client || !gateway.connected) {
        return;
      }

      setIsSaving(true);
      setCronError(null);

      try {
        await gateway.client.request("cron.create", job);
        await loadCronJobs();
        stopEditing();
      } catch (err) {
        setCronError(String(err));
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [gateway.client, gateway.connected, loadCronJobs, stopEditing, setIsSaving, setCronError],
  );

  /**
   * 更新 Cron 任务
   */
  const updateCronJob = useCallback(
    async (id: string, updates: Partial<CronJob>) => {
      if (!gateway.client || !gateway.connected) {
        return;
      }

      setIsSaving(true);
      setCronError(null);

      try {
        await gateway.client.request("cron.update", { id, ...updates });
        await loadCronJobs();
        stopEditing();
      } catch (err) {
        setCronError(String(err));
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [gateway.client, gateway.connected, loadCronJobs, stopEditing, setIsSaving, setCronError],
  );

  /**
   * 删除 Cron 任务
   */
  const deleteCronJob = useCallback(
    async (id: string) => {
      if (!gateway.client || !gateway.connected) {
        return;
      }

      try {
        await gateway.client.request("cron.delete", { id });
        await loadCronJobs();
      } catch (err) {
        setCronError(String(err));
      }
    },
    [gateway.client, gateway.connected, loadCronJobs, setCronError],
  );

  // 初始加载
  useEffect(() => {
    if (gateway.client && gateway.connected) {
      loadCronStatus();
      loadCronJobs();
    }
  }, [gateway.client, gateway.connected, loadCronStatus, loadCronJobs]);

  return {
    // 日志状态
    logs,
    rawLogs,
    logsViewMode,
    selectedLogLevel,
    filterSubsystems,
    logsSearchQuery: searchQuery,
    maxLogs,
    autoScroll,
    logsLoading,
    logsError,

    // Cron 状态
    jobs,
    cronStatus,
    runLogs,
    editing,
    cronViewMode,
    sortBy,
    sortOrder,
    cronSearchQuery,
    selectedJobId,
    showRunLogs,
    cronLoading,
    cronSaving,
    cronError,

    // 日志操作
    loadLogs,
    addLogs: setLogs,
    addRawLog: (log: string) => setRawLogs([...rawLogs, log]),
    clearLogs: () => {
      setLogs([]);
      setRawLogs([]);
    },
    setLogsViewMode,
    setSelectedLogLevel,
    setFilterSubsystems,
    toggleSubsystem,
    setLogsSearchQuery: setSearchQuery,
    setMaxLogs,
    setAutoScroll,

    // Cron 操作
    loadCronStatus,
    loadCronJobs,
    createCronJob,
    updateCronJob,
    deleteCronJob,
    startEditing,
    startCreating,
    stopEditing,
    updateEditingJob,
    setCronViewMode,
    setSortBy,
    setSortOrder,
    setCronSearchQuery,
    setSelectedJobId,
    setShowRunLogs,
  };
}
