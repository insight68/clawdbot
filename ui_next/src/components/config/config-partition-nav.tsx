"use client";

import { Input } from "@/components/ui/input";
import { useConfigStore } from "@/store/use-config-store";
import type { ConfigUiHint } from "@/types/config";

interface ConfigPartition {
  key: string;
  label: string;
  order?: number;
  icon?: string;
}

interface ConfigPartitionNavProps {
  partitions: ConfigPartition[];
  selectedPartition: string | null;
  onSelectPartition: (key: string | null) => void;
  uiHints?: Record<string, ConfigUiHint>;
  className?: string;
}

/**
 * 配置分区导航组件
 * 显示配置的各个分区（如 general, gateway, channels 等）
 */
export function ConfigPartitionNav({
  partitions,
  selectedPartition,
  onSelectPartition,
  uiHints = {},
  className = "",
}: ConfigPartitionNavProps) {
  const { searchQuery, setSearchQuery } = useConfigStore()

  // 过滤分区
  const filteredPartitions = partitions.filter((partition) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const label = partition.label.toLowerCase();
    return label.includes(query);
  });

  // 排序分区
  const sortedPartitions = [...filteredPartitions].sort((a, b) => {
    const orderA = a.order ?? 999;
    const orderB = b.order ?? 999;
    if (orderA !== orderB) return orderA - orderB;
    return a.label.localeCompare(b.label);
  });

  return (
    <div className={`flex flex-col h-full border-r border-border ${className}`}>
      {/* 搜索框 */}
      <div className="p-4 border-b border-border">
        <Input
          type="search"
          placeholder="Search partitions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* 分区列表 */}
      <div className="flex-1 overflow-y-auto p-2">
        {/* 全部 */}
        <PartitionItem
          key="all"
          partition={{
            key: "",
            label: "All",
            order: 0,
          }}
          selected={selectedPartition === null}
          onClick={() => onSelectPartition(null)}
        />

        {/* 各个分区 */}
        {sortedPartitions.map((partition) => (
          <PartitionItem
            key={partition.key}
            partition={partition}
            selected={selectedPartition === partition.key}
            onClick={() => onSelectPartition(partition.key)}
          />
        ))}
      </div>
    </div>
  );
}

interface PartitionItemProps {
  partition: ConfigPartition;
  selected: boolean;
  onClick: () => void;
}

function PartitionItem({ partition, selected, onClick }: PartitionItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        selected
          ? "bg-accent text-white"
          : "hover:bg-muted text-foreground"
      }`}
    >
      <div className="flex items-center gap-2">
        {partition.icon && <span>{partition.icon}</span>}
        <span>{partition.label}</span>
      </div>
    </button>
  );
}

/**
 * 配置字段组件
 * 根据字段类型渲染不同的输入控件
 */
interface ConfigFieldProps {
  name: string;
  value: unknown;
  hint?: ConfigUiHint;
  onChange: (value: unknown) => void;
}

export function ConfigField({ name, value, hint, onChange }: ConfigFieldProps) {
  const label = hint?.label || name;
  const help = hint?.help;
  const placeholder = hint?.placeholder;
  const isAdvanced = hint?.advanced;

  // 推断字段类型
  const fieldType = inferFieldType(value);

  return (
    <div className={`space-y-1 ${isAdvanced ? "opacity-60" : ""}`}>
      <label className="text-sm font-medium leading-none">
        {label}
        {isAdvanced && <span className="ml-2 text-xs text-muted-foreground">(advanced)</span>}
      </label>

      {fieldType === "boolean" && (
        <BooleanField value={value as boolean} onChange={onChange} />
      )}

      {fieldType === "number" && (
        <NumberField
          value={value as number}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}

      {fieldType === "string" && (
        <StringField
          value={value as string}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}

      {fieldType === "array" && (
        <ArrayField value={value as unknown[]} onChange={onChange} />
      )}

      {fieldType === "object" && (
        <ObjectField value={value as Record<string, unknown>} onChange={onChange} />
      )}

      {help && <p className="text-xs text-muted-foreground">{help}</p>}
    </div>
  );
}

function inferFieldType(value: unknown): "string" | "number" | "boolean" | "array" | "object" {
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "number") return "number";
  if (typeof value === "string") return "string";
  if (Array.isArray(value)) return "array";
  if (typeof value === "object" && value !== null) return "object";
  return "string";
}

function BooleanField({ value, onChange }: { value: boolean; onChange: (value: boolean) => void }) {
  return (
    <input
      type="checkbox"
      checked={value}
      onChange={(e) => onChange(e.target.checked)}
      className="w-4 h-4 rounded border-gray-300"
    />
  );
}

function NumberField({
  value,
  onChange,
  placeholder,
}: {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
}) {
  return (
    <Input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      placeholder={placeholder}
      className="w-full"
    />
  );
}

function StringField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full"
    />
  );
}

function ArrayField({
  value,
  onChange,
}: {
  value: unknown[];
  onChange: (value: unknown[]) => void;
}) {
  return (
    <div className="border border-border rounded-md p-3">
      <div className="text-xs text-muted-foreground mb-2">
        Array ({value.length} items)
      </div>
      <pre className="text-xs overflow-x-auto">
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  );
}

function ObjectField({
  value,
  onChange,
}: {
  value: Record<string, unknown>;
  onChange: (value: Record<string, unknown>) => void;
}) {
  return (
    <details className="border border-border rounded-md">
      <summary className="px-3 py-2 cursor-pointer hover:bg-muted">
        Object ({Object.keys(value).length} keys)
      </summary>
      <div className="p-3 border-t border-border">
        <pre className="text-xs overflow-x-auto">
          {JSON.stringify(value, null, 2)}
        </pre>
      </div>
    </details>
  );
}
