"use client";

import { useCallback } from "react";
import { useGateway } from "../contexts/gateway-context";
import { useSessionsStore } from "../store/use-sessions-store";
import type { SessionsListResult, GatewaySessionRow, SessionsPatchResult } from "../types/sessions";

/**
 * 会话管理 Hook
 */
export function useSessions() {
  const gateway = useGateway();
  const {
    sessionsResult,
    selectedSessionKey,
    selectedSession,
    editingSession,
    editedFields,
    isSaving,
    saveError,
    viewMode,
    sortBy,
    sortOrder,
    searchQuery,
    isLoading,
    error,
    setSessionsResult,
    setSelectedSessionKey,
    setSelectedSession,
    setEditingSession,
    setEditedFields,
    updateEditedField,
    clearEditedFields,
    setIsSaving,
    setSaveError,
    setViewMode,
    setSortBy,
    setSortOrder,
    setSearchQuery,
    setIsLoading,
    setError,
  } = useSessionsStore();

  /**
   * 加载会话列表
   */
  const loadSessions = useCallback(async () => {
    if (!gateway.client || !gateway.connected) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = (await gateway.client.request("sessions.list", {})) as SessionsListResult;
      setSessionsResult(res);
    } catch (err) {
      setError(String(err));
    } finally {
      setIsLoading(false);
    }
  }, [gateway.client, gateway.connected, setSessionsResult, setIsLoading, setError]);

  /**
   * 保存会话更改
   */
  const saveSession = useCallback(async () => {
    if (!gateway.client || !gateway.connected || !editingSession) {
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const res = (await gateway.client.request("sessions.patch", {
        key: editingSession.key,
        ...editedFields,
      })) as SessionsPatchResult;

      await loadSessions();
      clearEditedFields();
      return res;
    } catch (err) {
      setSaveError(String(err));
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [gateway.client, gateway.connected, editingSession, editedFields, loadSessions, clearEditedFields, setIsSaving, setSaveError]);

  /**
   * 开始编辑会话
   */
  const startEditing = useCallback((session: GatewaySessionRow) => {
    setEditingSession(session);
    clearEditedFields();
  }, [setEditingSession, clearEditedFields]);

  /**
   * 删除会话
   */
  const deleteSession = useCallback(
    async (key: string) => {
      if (!gateway.client || !gateway.connected) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        await gateway.client.request("sessions.delete", { key });
        await loadSessions();
      } catch (err) {
        setError(String(err));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [gateway.client, gateway.connected, loadSessions, setIsLoading, setError],
  );

  return {
    // 状态
    sessionsResult,
    selectedSessionKey,
    selectedSession,
    editingSession,
    editedFields,
    isSaving,
    saveError,
    viewMode,
    sortBy,
    sortOrder,
    searchQuery,
    isLoading,
    error,
    hasChanges: Object.keys(editedFields).length > 0,

    // 操作
    loadSessions,
    saveSession,
    deleteSession,
    startEditing,
    updateEditedField,
    clearEditedFields,
    setSelectedSessionKey,
    setSelectedSession,
    setViewMode,
    setSortBy,
    setSortOrder,
    setSearchQuery,
  };
}
