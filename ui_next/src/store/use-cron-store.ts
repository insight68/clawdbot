"use client";

import { create } from "zustand";
import {
  CronJob,
  CronStatus,
  CronRunLogEntry,
  CronSchedule,
  CronPayload,
} from "../types/cron";

type CronViewMode = "all" | "enabled" | "disabled";
type CronSortBy = "name" | "nextRun" | "lastRun" | "createdAt";
type CronSortOrder = "asc" | "desc";

interface CronEditingState {
  job: CronJob | null;
  isEditing: boolean;
  isCreating: boolean;
  hasChanges: boolean;
}

interface CronState {
  // 数据
  jobs: CronJob[];
  status: CronStatus | null;
  runLogs: CronRunLogEntry[];

  // 编辑状态
  editing: CronEditingState;

  // UI 状态
  viewMode: CronViewMode;
  sortBy: CronSortBy;
  sortOrder: CronSortOrder;
  searchQuery: string;
  selectedJobId: string | null;
  showRunLogs: boolean;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  // 操作
  setJobs: (jobs: CronJob[]) => void;
  addJob: (job: CronJob) => void;
  updateJob: (id: string, updates: Partial<CronJob>) => void;
  removeJob: (id: string) => void;
  setStatus: (status: CronStatus | null) => void;
  setRunLogs: (logs: CronRunLogEntry[]) => void;
  addRunLog: (log: CronRunLogEntry) => void;
  setEditing: (editing: CronEditingState) => void;
  startEditing: (job: CronJob | null) => void;
  startCreating: () => void;
  stopEditing: () => void;
  updateEditingJob: (updates: Partial<CronJob>) => void;
  setViewMode: (mode: CronViewMode) => void;
  setSortBy: (sortBy: CronSortBy) => void;
  setSortOrder: (order: CronSortOrder) => void;
  setSearchQuery: (query: string) => void;
  setSelectedJobId: (id: string | null) => void;
  setShowRunLogs: (show: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setIsSaving: (saving: boolean) => void;
  setError: (error: string | null) => void;
}

const createEmptyCronJob = (): CronJob => ({
  id: "",
  name: "",
  description: "",
  enabled: false,
  createdAtMs: Date.now(),
  updatedAtMs: Date.now(),
  schedule: { kind: "every", everyMs: 60000 },
  sessionTarget: "main",
  wakeMode: "next-heartbeat",
  payload: { kind: "agentTurn", message: "" },
});

export const useCronStore = create<CronState>()((set) => ({
  // 初始状态
  jobs: [],
  status: null,
  runLogs: [],
  editing: {
    job: null,
    isEditing: false,
    isCreating: false,
    hasChanges: false,
  },
  viewMode: "all",
  sortBy: "nextRun",
  sortOrder: "asc",
  searchQuery: "",
  selectedJobId: null,
  showRunLogs: false,
  isLoading: false,
  isSaving: false,
  error: null,

  // 操作
  setJobs: (jobs) => set({ jobs }),
  addJob: (job) =>
    set((state) => ({ jobs: [...state.jobs, job] })),
  updateJob: (id, updates) =>
    set((state) => ({
      jobs: state.jobs.map((j) => (j.id === id ? { ...j, ...updates } : j)),
    })),
  removeJob: (id) =>
    set((state) => ({ jobs: state.jobs.filter((j) => j.id !== id) })),
  setStatus: (status) => set({ status }),
  setRunLogs: (runLogs) => set({ runLogs }),
  addRunLog: (log) =>
    set((state) => ({ runLogs: [log, ...state.runLogs] })),
  setEditing: (editing) => set({ editing }),
  startEditing: (job) =>
    set({
      editing: {
        job: job ? { ...job } : null,
        isEditing: !!job,
        isCreating: false,
        hasChanges: false,
      },
      selectedJobId: job?.id ?? null,
    }),
  startCreating: () =>
    set({
      editing: {
        job: createEmptyCronJob(),
        isEditing: true,
        isCreating: true,
        hasChanges: false,
      },
    }),
  stopEditing: () =>
    set({
      editing: {
        job: null,
        isEditing: false,
        isCreating: false,
        hasChanges: false,
      },
    }),
  updateEditingJob: (updates) =>
    set((state) => ({
      editing: {
        ...state.editing,
        job: state.editing.job ? { ...state.editing.job, ...updates } : null,
        hasChanges: true,
      },
    })),
  setViewMode: (viewMode) => set({ viewMode }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedJobId: (selectedJobId) => set({ selectedJobId }),
  setShowRunLogs: (showRunLogs) => set({ showRunLogs }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsSaving: (isSaving) => set({ isSaving }),
  setError: (error) => set({ error }),
}));
