/**
 * 配置页面
 * 使用 @rjsf/shadcn 渲染 JSON Schema 表单
 * 从 ui_lit/src/ui/views/config.ts 迁移
 */

'use client'

import { useEffect, useMemo, useState } from 'react'
import { ConfigEditor } from '@/components/config/config-editor'
import { ConfigPartitionNav } from '@/components/config/config-partition-nav'
import { ConfigValidation, ValidationBadge } from '@/components/config/config-validation'
import { LoadingSpinner } from '@/components/ui/loading'
import { useConfig } from '@/hooks/use-config'
import { useConfigStore } from '@/store/use-config-store'
import { useGateway } from '@/contexts/gateway-context'

// 配置验证面板最大高度
const VALIDATION_PANEL_MAX_HEIGHT = 'max-h-48'

/**
 * 从 Schema 提取配置分区
 */
function extractPartitionsFromSchema(schema: any): Array<{ key: string; label: string; order?: number }> {
  if (!schema?.properties) {
    return []
  }

  return Object.entries(schema.properties).map(([key, prop]: [string, any]) => ({
    key,
    label: prop?.title || key,
    order: prop?.order,
  }))
}

export default function ConfigPage() {
  const gateway = useGateway()
  const {
    loadConfig,
    loadConfigSchema,
    saveConfig,
    applyConfig,
  } = useConfig()

  const {
    snapshot,
    schema,
    viewMode,
    selectedPartition,
    isSaving,
    saveError,
    setViewMode,
    setSelectedPartition,
  } = useConfigStore()

  const [rawJson, setRawJson] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  // 加载配置和 Schema
  useEffect(() => {
    if (gateway.connected) {
      loadConfig()
      loadConfigSchema()
    }
  }, [gateway.connected, loadConfig, loadConfigSchema])

  // 当 snapshot 更新时，同步更新 raw JSON（仅在非 Raw 模式下）
  useEffect(() => {
    if (viewMode !== 'raw' && snapshot?.raw) {
      setRawJson(snapshot.raw)
    } else if (viewMode !== 'raw' && snapshot?.config) {
      setRawJson(JSON.stringify(snapshot.config, null, 2) + '\n')
    }
  }, [snapshot, viewMode])

  // 获取 store 中的 editedValues
  const { editedValues } = useConfigStore()

  // 当切换到 Raw 模式时，同步 editedValues 到 rawJson
  const handleViewModeChange = (mode: 'form' | 'raw') => {
    if (mode === 'raw' && Object.keys(editedValues).length > 0) {
      setRawJson(JSON.stringify(editedValues, null, 2) + '\n')
    }
    setViewMode(mode)
  }

  // 提取分区列表
  const partitions = useMemo(() => {
    return extractPartitionsFromSchema(schema?.schema)
  }, [schema])

  // 过滤配置数据（根据选中的分区）
  const filteredConfig = useMemo(() => {
    if (!selectedPartition || !snapshot?.config) {
      return snapshot?.config || null
    }
    const config = snapshot.config as Record<string, unknown>
    return config[selectedPartition] || null
  }, [snapshot, selectedPartition])

  // 保存配置
  const handleSave = async () => {
    setLocalError(null)
    try {
      await saveConfig()
    } catch (err) {
      setLocalError(String(err))
    }
  }

  // 应用配置（需要确认）
  const handleApply = async () => {
    if (!confirm('应用配置将重启 OpenClaw Gateway。是否继续？')) {
      return
    }
    setLocalError(null)
    try {
      await applyConfig()
    } catch (err) {
      setLocalError(String(err))
    }
  }

  // 原始 JSON 变更
  const handleRawChange = (value: string) => {
    setRawJson(value)
  }

  // 显示加载状态
  if (!snapshot && !isSaving) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          {gateway.connected ? (
            <>
              <LoadingSpinner size="lg" className="mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">加载配置中...</p>
            </>
          ) : (
            <>
              <p className="text-lg font-medium mb-2">未连接到 Gateway</p>
              <p className="text-sm">请先连接到 OpenClaw Gateway</p>
            </>
          )}
        </div>
      </div>
    )
  }

  // 计算是否有未保存的更改
  const hasUnsavedChanges = rawJson !== snapshot?.raw

  // 是否有验证问题
  const hasValidationIssues = snapshot?.issues && snapshot.issues.length > 0

  return (
    <div className="h-full flex">
      {/* 左侧分区导航 */}
      <div className="w-56 flex-shrink-0 border-r border-border">
        <ConfigPartitionNav
          partitions={partitions}
          selectedPartition={selectedPartition}
          onSelectPartition={setSelectedPartition}
          uiHints={schema?.uiHints}
        />
      </div>

      {/* 主内容区 */}
      <div className="flex-1 min-w-0 flex flex-col">
        <ConfigEditor
          raw={rawJson}
          schema={schema?.schema}
          uiHints={schema?.uiHints}
          isSaving={isSaving}
          saveError={saveError || localError}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          onRawChange={handleRawChange}
          onSave={handleSave}
          onApply={handleApply}
          applyLabel={hasUnsavedChanges ? '应用并重启' : '应用配置'}
        />

        {/* 配置验证问题显示 */}
        {hasValidationIssues && (
          <div className={`border-t border-border p-4 ${VALIDATION_PANEL_MAX_HEIGHT} overflow-y-auto`}>
            <ConfigValidation
              issues={snapshot.issues}
              valid={snapshot.valid}
            />
          </div>
        )}
      </div>
    </div>
  )
}
