"use client";

import { create } from "zustand";
import { SkillStatusReport, SkillStatusEntry } from "../types/skills";

type SkillsViewMode = "all" | "enabled" | "disabled" | "eligible";
type SkillsSortBy = "name" | "source" | "status";
type SkillsSortOrder = "asc" | "desc";

interface SkillsState {
  // 数据
  report: SkillStatusReport | null;

  // 选中的技能
  selectedSkill: SkillStatusEntry | null;

  // 编辑状态
  showInstallDialog: boolean;
  installingSkill: SkillStatusEntry | null;

  // UI 状态
  viewMode: SkillsViewMode;
  sortBy: SkillsSortBy;
  sortOrder: SkillsSortOrder;
  searchQuery: string;
  showOnlyMissing: boolean;
  isLoading: boolean;
  error: string | null;

  // 操作
  setReport: (report: SkillStatusReport | null) => void;
  setSelectedSkill: (skill: SkillStatusEntry | null) => void;
  setShowInstallDialog: (show: boolean) => void;
  setInstallingSkill: (skill: SkillStatusEntry | null) => void;
  setViewMode: (mode: SkillsViewMode) => void;
  setSortBy: (sortBy: SkillsSortBy) => void;
  setSortOrder: (order: SkillsSortOrder) => void;
  setSearchQuery: (query: string) => void;
  setShowOnlyMissing: (show: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useSkillsStore = create<SkillsState>()((set) => ({
  // 初始状态
  report: null,
  selectedSkill: null,
  showInstallDialog: false,
  installingSkill: null,
  viewMode: "all",
  sortBy: "name",
  sortOrder: "asc",
  searchQuery: "",
  showOnlyMissing: false,
  isLoading: false,
  error: null,

  // 操作
  setReport: (report) => set({ report }),
  setSelectedSkill: (selectedSkill) => set({ selectedSkill }),
  setShowInstallDialog: (showInstallDialog) => set({ showInstallDialog }),
  setInstallingSkill: (installingSkill) => set({ installingSkill }),
  setViewMode: (viewMode) => set({ viewMode }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setShowOnlyMissing: (showOnlyMissing) => set({ showOnlyMissing }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
