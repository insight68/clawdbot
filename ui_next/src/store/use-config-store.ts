"use client";

import { create } from "zustand";
import { ConfigSnapshot, ConfigSchemaResponse } from "../types/config";

type ConfigViewMode = "form" | "raw";
type ConfigSearchMatch = { path: string; matches: number };

interface ConfigState {
  // 配置数据
  snapshot: ConfigSnapshot | null;
  schema: ConfigSchemaResponse | null;

  // UI 状态
  viewMode: ConfigViewMode;
  selectedPartition: string | null;
  searchQuery: string;
  searchMatches: ConfigSearchMatch[];
  expandedSections: Set<string>;
  editedValues: Record<string, unknown>;
  isSaving: boolean;
  saveError: string | null;
  lastSavePath: string | null;

  // 操作
  setSnapshot: (snapshot: ConfigSnapshot | null) => void;
  setSchema: (schema: ConfigSchemaResponse | null) => void;
  setViewMode: (mode: ConfigViewMode) => void;
  setSelectedPartition: (partition: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSearchMatches: (matches: ConfigSearchMatch[]) => void;
  toggleSection: (path: string) => void;
  setExpandedSections: (sections: Set<string>) => void;
  setEditedValue: (path: string, value: unknown) => void;
  setEditedValues: (values: Record<string, unknown>) => void;
  clearEditedValues: () => void;
  setIsSaving: (saving: boolean) => void;
  setSaveError: (error: string | null) => void;
  setLastSavePath: (path: string | null) => void;
}

export const useConfigStore = create<ConfigState>()((set) => ({
  // 初始状态
  snapshot: null,
  schema: null,
  viewMode: "form",
  selectedPartition: null,
  searchQuery: "",
  searchMatches: [],
  expandedSections: new Set<string>(),
  editedValues: {},
  isSaving: false,
  saveError: null,
  lastSavePath: null,

  // 操作
  setSnapshot: (snapshot) => set({ snapshot }),
  setSchema: (schema) => set({ schema }),
  setViewMode: (viewMode) => set({ viewMode }),
  setSelectedPartition: (selectedPartition) => set({ selectedPartition }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSearchMatches: (searchMatches) => set({ searchMatches }),
  toggleSection: (path) =>
    set((state) => {
      const newSections = new Set(state.expandedSections);
      if (newSections.has(path)) {
        newSections.delete(path);
      } else {
        newSections.add(path);
      }
      return { expandedSections: newSections };
    }),
  setExpandedSections: (expandedSections) => set({ expandedSections }),
  setEditedValue: (path, value) =>
    set((state) => ({
      editedValues: { ...state.editedValues, [path]: value },
    })),
  setEditedValues: (editedValues) => set({ editedValues }),
  clearEditedValues: () => set({ editedValues: {} }),
  setIsSaving: (isSaving) => set({ isSaving }),
  setSaveError: (saveError) => set({ saveError }),
  setLastSavePath: (lastSavePath) => set({ lastSavePath }),
}));
