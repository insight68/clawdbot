"use client";

import { create } from "zustand";
import {
  SessionsListResult,
  GatewaySessionRow,
  AgentsListResult,
  GatewaySessionsDefaults,
} from "../types/sessions";

type SessionViewMode = "all" | "active" | "pinned";
type SessionSortBy = "updatedAt" | "label" | "surface" | "subject";
type SessionSortOrder = "asc" | "desc";

interface SessionsState {
  // 数据
  sessionsResult: SessionsListResult | null;
  agentsResult: AgentsListResult | null;
  defaults: GatewaySessionsDefaults | null;

  // 选中的会话
  selectedSessionKey: string | null;
  selectedSession: GatewaySessionRow | null;

  // 编辑状态
  editingSession: GatewaySessionRow | null;
  editedFields: Partial<GatewaySessionRow>;
  isSaving: boolean;
  saveError: string | null;

  // UI 状态
  viewMode: SessionViewMode;
  sortBy: SessionSortBy;
  sortOrder: SessionSortOrder;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;

  // 操作
  setSessionsResult: (result: SessionsListResult | null) => void;
  setAgentsResult: (result: AgentsListResult | null) => void;
  setDefaults: (defaults: GatewaySessionsDefaults | null) => void;
  setSelectedSessionKey: (key: string | null) => void;
  setSelectedSession: (session: GatewaySessionRow | null) => void;
  setEditingSession: (session: GatewaySessionRow | null) => void;
  setEditedFields: (fields: Partial<GatewaySessionRow>) => void;
  updateEditedField: <K extends keyof GatewaySessionRow>(
    key: K,
    value: GatewaySessionRow[K],
  ) => void;
  clearEditedFields: () => void;
  setIsSaving: (saving: boolean) => void;
  setSaveError: (error: string | null) => void;
  setViewMode: (mode: SessionViewMode) => void;
  setSortBy: (sortBy: SessionSortBy) => void;
  setSortOrder: (order: SessionSortOrder) => void;
  setSearchQuery: (query: string) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useSessionsStore = create<SessionsState>()((set) => ({
  // 初始状态
  sessionsResult: null,
  agentsResult: null,
  defaults: null,
  selectedSessionKey: null,
  selectedSession: null,
  editingSession: null,
  editedFields: {},
  isSaving: false,
  saveError: null,
  viewMode: "all",
  sortBy: "updatedAt",
  sortOrder: "desc",
  searchQuery: "",
  isLoading: false,
  error: null,

  // 操作
  setSessionsResult: (sessionsResult) => set({ sessionsResult }),
  setAgentsResult: (agentsResult) => set({ agentsResult }),
  setDefaults: (defaults) => set({ defaults }),
  setSelectedSessionKey: (selectedSessionKey) => set({ selectedSessionKey }),
  setSelectedSession: (selectedSession) => set({ selectedSession }),
  setEditingSession: (editingSession) => set({ editingSession }),
  setEditedFields: (editedFields) => set({ editedFields }),
  updateEditedField: (key, value) =>
    set((state) => ({
      editedFields: { ...state.editedFields, [key]: value },
    })),
  clearEditedFields: () => set({ editedFields: {} }),
  setIsSaving: (isSaving) => set({ isSaving }),
  setSaveError: (saveError) => set({ saveError }),
  setViewMode: (viewMode) => set({ viewMode }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
