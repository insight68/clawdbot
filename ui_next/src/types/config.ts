/**
 * 配置相关类型定义
 * 从 ui_lit/src/ui/types.ts 迁移
 */

export type ConfigSnapshotIssue = {
  path: string;
  message: string;
};

export type ConfigSnapshot = {
  path?: string | null;
  exists?: boolean | null;
  raw?: string | null;
  hash?: string | null;
  parsed?: unknown;
  valid?: boolean | null;
  config?: Record<string, unknown> | null;
  issues?: ConfigSnapshotIssue[] | null;
};

export type ConfigUiHint = {
  label?: string;
  help?: string;
  group?: string;
  order?: number;
  advanced?: boolean;
  sensitive?: boolean;
  placeholder?: string;
  itemTemplate?: unknown;
  // RJSF specific uiSchema fields
  widget?: string;
  disabled?: boolean;
  readonly?: boolean;
  options?: {
    label?: boolean;
    rows?: number;
    inputType?: string;
    [key: string]: unknown;
  };
  className?: string;
  description?: string;
};

export type ConfigUiHints = Record<string, ConfigUiHint>;

export type ConfigSchemaResponse = {
  schema: unknown;
  uiHints: ConfigUiHints;
  version: string;
  generatedAt: string;
};
