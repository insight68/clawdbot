"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading";
import { FormEditor } from "./form-editor";
import type { ConfigUiHint } from "@/types/config";

interface ConfigEditorProps {
  raw: string;
  schema?: unknown | null;
  uiHints?: Record<string, ConfigUiHint>;
  isSaving?: boolean;
  saveError?: string | null;
  viewMode: "form" | "raw";
  onViewModeChange: (mode: "form" | "raw") => void;
  onRawChange: (raw: string) => void;
  onSave: () => void;
  onApply?: () => void;
  applyLabel?: string;
}

/**
 * 配置编辑器组件
 * 支持原始 JSON 和表单两种编辑模式
 */
export function ConfigEditor({
  raw,
  schema,
  uiHints = {},
  isSaving = false,
  saveError,
  viewMode,
  onViewModeChange,
  onRawChange,
  onSave,
  onApply,
  applyLabel = "Apply",
}: ConfigEditorProps) {
  const [validationError, setValidationError] = useState<string | null>(null);

  // 验证 JSON
  const validateJson = (value: string) => {
    try {
      JSON.parse(value);
      setValidationError(null);
      return true;
    } catch (err) {
      setValidationError((err as Error).message);
      return false;
    }
  };

  const handleRawChange = (value: string) => {
    onRawChange(value);
    if (viewMode === "raw") {
      validateJson(value);
    }
  };

  const hasSchema = schema != null;

  return (
    <div className="flex flex-col h-full">
      {/* 工具栏 */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Configuration</h2>
          {hasSchema && (
            <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-0.5 rounded">
              Schema available
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* 视图模式切换 */}
          <div className="flex rounded-md border border-border overflow-hidden">
            <button
              type="button"
              onClick={() => onViewModeChange("form")}
              disabled={!hasSchema}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                viewMode === "form"
                  ? "bg-accent text-white"
                  : "bg-background hover:bg-muted disabled:opacity-50"
              }`}
            >
              Form
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("raw")}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                viewMode === "raw"
                  ? "bg-accent text-white"
                  : "bg-background hover:bg-muted"
              }`}
            >
              Raw
            </button>
          </div>

          {/* 应用按钮 */}
          {onApply && (
            <Button variant="secondary" size="sm" onClick={onApply} disabled={isSaving}>
              {isSaving ? <LoadingSpinner size="sm" className="mr-2" /> : null}
              {applyLabel}
            </Button>
          )}

          {/* 保存按钮 */}
          <Button variant="primary" size="sm" onClick={onSave} disabled={isSaving || !!validationError}>
            {isSaving ? <LoadingSpinner size="sm" className="mr-2" /> : null}
            Save
          </Button>
        </div>
      </div>

      {/* 错误提示 */}
      {(saveError || validationError) && (
        <div className="mx-4 mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
          {saveError || validationError}
        </div>
      )}

      {/* 编辑区域 */}
      <div className="flex-1 p-4">
        {viewMode === "raw" ? (
          <RawEditor value={raw} onChange={handleRawChange} error={validationError} />
        ) : (
          <FormEditor />
        )}
      </div>
    </div>
  );
}

/**
 * 原始 JSON 编辑器
 */
function RawEditor({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  error: string | null;
}) {
  return (
    <div className="h-full">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter configuration as JSON..."
        className={`w-full h-full font-mono text-sm resize-none ${
          error ? "border-red-500" : ""
        }`}
        spellCheck={false}
      />
      <div className="mt-2 text-xs text-muted-foreground">
        Edit the raw configuration JSON. Changes will be validated before saving.
      </div>
    </div>
  );
}

