"use client";

import { useCallback, useEffect } from "react";
import { useGateway } from "../contexts/gateway-context";
import { useConfigStore } from "../store/use-config-store";
import {
  cloneConfigObject,
  serializeConfigForm,
  setPathValue,
  removePathValue,
  parseConfigPath,
  getPathValue,
} from "../lib/config-form-utils";
import type { ConfigSnapshot, ConfigSchemaResponse } from "../types/config";

/**
 * 配置管理 Hook
 * 从 ui_lit/src/ui/controllers/config.ts 迁移
 */
export function useConfig(applySessionKey = "") {
  const gateway = useGateway();

  const {
    snapshot,
    schema,
    viewMode,
    selectedPartition,
    searchQuery,
    searchMatches,
    expandedSections,
    editedValues,
    isSaving,
    saveError,
    lastSavePath,
    setSnapshot,
    setSchema,
    setViewMode,
    setSelectedPartition,
    setSearchQuery,
    setSearchMatches,
    toggleSection,
    setExpandedSections,
    setEditedValue,
    setEditedValues,
    clearEditedValues,
    setIsSaving,
    setSaveError,
    setLastSavePath,
  } = useConfigStore();

  /**
   * 加载配置快照
   */
  const loadConfig = useCallback(async () => {
    if (!gateway.client || !gateway.connected) {
      return;
    }

    try {
      const res = (await gateway.client.request("config.get", {})) as ConfigSnapshot;
      applyConfigSnapshot(res);
    } catch (err) {
      setSaveError(String(err));
    }
  }, [gateway.client, gateway.connected, setSaveError]);

  /**
   * 应用配置快照到状态
   */
  const applyConfigSnapshot = useCallback((res: ConfigSnapshot) => {
    setSnapshot(res);
    // 如果没有编辑过，或者当前在原始模式，则更新编辑值
    if (Object.keys(editedValues).length === 0) {
      if (res.config && typeof res.config === "object") {
        setEditedValues(res.config as Record<string, unknown>);
      }
    }
  }, [editedValues, setSnapshot, setEditedValues]);

  /**
   * 加载配置 Schema
   */
  const loadConfigSchema = useCallback(async () => {
    if (!gateway.client || !gateway.connected) {
      return;
    }

    try {
      const res = (await gateway.client.request("config.schema", {})) as ConfigSchemaResponse;
      setSchema(res);
    } catch (err) {
      setSaveError(String(err));
    }
  }, [gateway.client, gateway.connected, setSchema, setSaveError]);

  /**
   * 保存配置
   */
  const saveConfig = useCallback(async () => {
    if (!gateway.client || !gateway.connected) {
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const raw = serializeConfigForm(editedValues);
      const baseHash = snapshot?.hash;

      if (!baseHash) {
        setSaveError("Config hash missing; reload and retry.");
        return;
      }

      await gateway.client.request("config.set", { raw, baseHash });
      setLastSavePath(snapshot?.path ?? null);
      clearEditedValues();
      await loadConfig();
    } catch (err) {
      setSaveError(String(err));
    } finally {
      setIsSaving(false);
    }
  }, [
    gateway.client,
    gateway.connected,
    editedValues,
    snapshot,
    setIsSaving,
    setSaveError,
    setLastSavePath,
    clearEditedValues,
    loadConfig,
  ]);

  /**
   * 应用配置（带会话）
   */
  const applyConfig = useCallback(async () => {
    if (!gateway.client || !gateway.connected) {
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const raw = serializeConfigForm(editedValues);
      const baseHash = snapshot?.hash;

      if (!baseHash) {
        setSaveError("Config hash missing; reload and retry.");
        return;
      }

      await gateway.client.request("config.apply", {
        raw,
        baseHash,
        sessionKey: applySessionKey,
      });

      clearEditedValues();
      await loadConfig();
    } catch (err) {
      setSaveError(String(err));
    } finally {
      setIsSaving(false);
    }
  }, [
    gateway.client,
    gateway.connected,
    editedValues,
    snapshot,
    applySessionKey,
    setIsSaving,
    setSaveError,
    clearEditedValues,
    loadConfig,
  ]);

  /**
   * 更新配置值
   */
  const updateConfigValue = useCallback(
    (path: string, value: unknown) => {
      const pathArray = parseConfigPath(path);
      const base = cloneConfigObject(editedValues);
      setPathValue(base, pathArray, value);
      setEditedValues(base);
    },
    [editedValues, setEditedValues],
  );

  /**
   * 删除配置值
   */
  const removeConfigValue = useCallback(
    (path: string) => {
      const pathArray = parseConfigPath(path);
      const base = cloneConfigObject(editedValues);
      removePathValue(base, pathArray);
      setEditedValues(base);
    },
    [editedValues, setEditedValues],
  );

  /**
   * 获取配置值
   */
  const getConfigValue = useCallback(
    (path: string): unknown => {
      const pathArray = parseConfigPath(path);
      return getPathValue(editedValues, pathArray);
    },
    [editedValues],
  );

  /**
   * 搜索配置
   */
  const searchConfig = useCallback(
    (query: string) => {
      if (!query.trim()) {
        setSearchMatches([]);
        return;
      }

      const matches: Array<{ path: string; matches: number }> = [];
      const searchLower = query.toLowerCase();

      // 递归搜索对象
      const searchObject = (
        obj: Record<string, unknown> | unknown[] | null | undefined,
        basePath = "",
      ) => {
        if (!obj) return;

        for (const [key, value] of Object.entries(obj)) {
          const fullPath = basePath ? `${basePath}.${key}` : key;

          if (typeof value === "string" && value.toLowerCase().includes(searchLower)) {
            matches.push({ path: fullPath, matches: 1 });
          } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
            searchObject(value as Record<string, unknown>, fullPath);
          }
        }
      };

      searchObject(editedValues);
      setSearchMatches(matches);
    },
    [editedValues, setSearchMatches],
  );

  // 初始加载
  useEffect(() => {
    if (gateway.client && gateway.connected) {
      loadConfig();
      loadConfigSchema();
    }
  }, [gateway.client, gateway.connected, loadConfig, loadConfigSchema]);

  return {
    // 状态
    snapshot,
    schema,
    viewMode,
    selectedPartition,
    searchQuery,
    searchMatches,
    expandedSections,
    editedValues,
    isSaving,
    saveError,
    lastSavePath,
    hasChanges: Object.keys(editedValues).length > 0,

    // 操作
    loadConfig,
    loadConfigSchema,
    saveConfig,
    applyConfig,
    updateConfigValue,
    removeConfigValue,
    getConfigValue,
    setViewMode,
    setSelectedPartition,
    setSearchQuery,
    searchConfig,
    toggleSection,
    setExpandedSections,
    clearEditedValues,
  };
}
