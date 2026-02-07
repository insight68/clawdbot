"use client";

import { create } from "zustand";
import { LogEntry, LogLevel } from "../types/logs";

type LogsViewMode = "live" | "paused";
type LogsFilterSubsystems = Set<string>;

interface LogsState {
  // 日志数据
  logs: LogEntry[];
  rawLogs: string[];

  // UI 状态
  viewMode: LogsViewMode;
  selectedLogLevel: LogLevel | "all";
  filterSubsystems: LogsFilterSubsystems;
  searchQuery: string;
  maxLogs: number;
  autoScroll: boolean;

  // 加载状态
  isLoading: boolean;
  error: string | null;

  // 操作
  setLogs: (logs: LogEntry[]) => void;
  addLogs: (logs: LogEntry[]) => void;
  setRawLogs: (logs: string[]) => void;
  addRawLog: (log: string) => void;
  clearLogs: () => void;
  setViewMode: (mode: LogsViewMode) => void;
  setSelectedLogLevel: (level: LogLevel | "all") => void;
  setFilterSubsystems: (subsystems: LogsFilterSubsystems) => void;
  toggleSubsystem: (subsystem: string) => void;
  setSearchQuery: (query: string) => void;
  setMaxLogs: (max: number) => void;
  setAutoScroll: (scroll: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useLogsStore = create<LogsState>()((set, get) => ({
  // 初始状态
  logs: [],
  rawLogs: [],
  viewMode: "live",
  selectedLogLevel: "all",
  filterSubsystems: new Set<string>(),
  searchQuery: "",
  maxLogs: 1000,
  autoScroll: true,
  isLoading: false,
  error: null,

  // 操作
  setLogs: (logs) => set({ logs }),
  addLogs: (newLogs) =>
    set((state) => {
      const combined = [...state.logs, ...newLogs];
      const trimmed =
        combined.length > state.maxLogs
          ? combined.slice(-state.maxLogs)
          : combined;
      return { logs: trimmed };
    }),
  setRawLogs: (rawLogs) => set({ rawLogs }),
  addRawLog: (log) =>
    set((state) => {
      const combined = [...state.rawLogs, log];
      const trimmed =
        combined.length > state.maxLogs
          ? combined.slice(-state.maxLogs)
          : combined;
      return { rawLogs: trimmed };
    }),
  clearLogs: () => set({ logs: [], rawLogs: [] }),
  setViewMode: (viewMode) => set({ viewMode }),
  setSelectedLogLevel: (selectedLogLevel) => set({ selectedLogLevel }),
  setFilterSubsystems: (filterSubsystems) => set({ filterSubsystems }),
  toggleSubsystem: (subsystem) =>
    set((state) => {
      const newSubsystems = new Set(state.filterSubsystems);
      if (newSubsystems.has(subsystem)) {
        newSubsystems.delete(subsystem);
      } else {
        newSubsystems.add(subsystem);
      }
      return { filterSubsystems: newSubsystems };
    }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setMaxLogs: (maxLogs) => set({ maxLogs }),
  setAutoScroll: (autoScroll) => set({ autoScroll }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
