"use client";

import { useCallback } from "react";
import { useGateway } from "../contexts/gateway-context";
import { useSkillsStore } from "../store/use-skills-store";
import type { SkillStatusReport } from "../types/skills";

/**
 * 技能管理 Hook
 */
export function useSkills() {
  const gateway = useGateway();
  const {
    report,
    selectedSkill,
    showInstallDialog,
    installingSkill,
    viewMode,
    sortBy,
    sortOrder,
    searchQuery,
    showOnlyMissing,
    isLoading,
    error,
    setReport,
    setSelectedSkill,
    setShowInstallDialog,
    setInstallingSkill,
    setViewMode,
    setSortBy,
    setSortOrder,
    setSearchQuery,
    setShowOnlyMissing,
    setIsLoading,
    setError,
  } = useSkillsStore();

  /**
   * 加载技能状态
   */
  const loadSkills = useCallback(async () => {
    if (!gateway.client || !gateway.connected) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = (await gateway.client.request("skills.status", {})) as SkillStatusReport;
      setReport(res);
    } catch (err) {
      setError(String(err));
    } finally {
      setIsLoading(false);
    }
  }, [gateway.client, gateway.connected, setReport, setIsLoading, setError]);

  /**
   * 安装技能
   */
  const installSkill = useCallback(
    async (skillName: string) => {
      if (!gateway.client || !gateway.connected) {
        return;
      }

      setInstallingSkill(report?.skills.find((s) => s.name === skillName) || null);

      try {
        await gateway.client.request("skills.install", { skill: skillName });
        await loadSkills();
      } catch (err) {
        setError(String(err));
      } finally {
        setInstallingSkill(null);
      }
    },
    [gateway.client, gateway.connected, report, loadSkills, setInstallingSkill, setError],
  );

  /**
   * 启用/禁用技能
   */
  const toggleSkill = useCallback(
    async (skillName: string, enabled: boolean) => {
      if (!gateway.client || !gateway.connected) {
        return;
      }

      try {
        await gateway.client.request("skills.set", { skill: skillName, enabled });
        await loadSkills();
      } catch (err) {
        setError(String(err));
      }
    },
    [gateway.client, gateway.connected, loadSkills, setError],
  );

  return {
    // 状态
    report,
    selectedSkill,
    showInstallDialog,
    installingSkill,
    viewMode,
    sortBy,
    sortOrder,
    searchQuery,
    showOnlyMissing,
    isLoading,
    error,

    // 操作
    loadSkills,
    installSkill,
    toggleSkill,
    setSelectedSkill,
    setShowInstallDialog,
    setViewMode,
    setSortBy,
    setSortOrder,
    setSearchQuery,
    setShowOnlyMissing,
  };
}
