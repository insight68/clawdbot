/**
 * 配置表单工具函数
 * 从 ui_lit/src/ui/controllers/config/form-utils.ts 迁移
 */

export function cloneConfigObject<T>(value: T): T {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value)) as T;
}

export function serializeConfigForm(form: Record<string, unknown>): string {
  return `${JSON.stringify(form, null, 2).trimEnd()}\n`;
}

export function setPathValue(
  obj: Record<string, unknown> | unknown[],
  path: Array<string | number>,
  value: unknown,
) {
  if (path.length === 0) return;
  let current: Record<string, unknown> | unknown[] = obj;
  for (let i = 0; i < path.length - 1; i += 1) {
    const key = path[i];
    const nextKey = path[i + 1];
    if (typeof key === "number") {
      if (!Array.isArray(current)) return;
      if (current[key] == null) {
        current[key] = typeof nextKey === "number" ? [] : ({} as Record<string, unknown>);
      }
      current = current[key] as Record<string, unknown> | unknown[];
    } else {
      if (typeof current !== "object" || current == null) return;
      const record = current as Record<string, unknown>;
      if (record[key] == null) {
        record[key] = typeof nextKey === "number" ? [] : ({} as Record<string, unknown>);
      }
      current = record[key] as Record<string, unknown> | unknown[];
    }
  }
  const lastKey = path[path.length - 1];
  if (typeof lastKey === "number") {
    if (Array.isArray(current)) current[lastKey] = value;
    return;
  }
  if (typeof current === "object" && current != null) {
    (current as Record<string, unknown>)[lastKey] = value;
  }
}

export function removePathValue(
  obj: Record<string, unknown> | unknown[],
  path: Array<string | number>,
) {
  if (path.length === 0) return;
  let current: Record<string, unknown> | unknown[] = obj;
  for (let i = 0; i < path.length - 1; i += 1) {
    const key = path[i];
    if (typeof key === "number") {
      if (!Array.isArray(current)) return;
      current = current[key] as Record<string, unknown> | unknown[];
    } else {
      if (typeof current !== "object" || current == null) return;
      current = (current as Record<string, unknown>)[key] as Record<string, unknown> | unknown[];
    }
    if (current == null) return;
  }
  const lastKey = path[path.length - 1];
  if (typeof lastKey === "number") {
    if (Array.isArray(current)) current.splice(lastKey, 1);
    return;
  }
  if (typeof current === "object" && current != null) {
    delete (current as Record<string, unknown>)[lastKey];
  }
}

/**
 * 解析配置路径为路径数组
 * 支持点分隔的路径和括号表示法（如 "config.array[0]"）
 */
export function parseConfigPath(path: string): Array<string | number> {
  const result: Array<string | number> = [];
  const pattern = /([^\.\[\]]+)|(\[(\d+)\])/g;
  let match;

  while ((match = pattern.exec(path)) !== null) {
    if (match[1]) {
      result.push(match[1]);
    } else if (match[3]) {
      result.push(parseInt(match[3], 10));
    }
  }

  return result;
}

/**
 * 获取嵌套对象中指定路径的值
 */
export function getPathValue(
  obj: Record<string, unknown> | unknown[] | null | undefined,
  path: Array<string | number>,
): unknown {
  if (!obj) return undefined;
  let current: unknown = obj;

  for (const key of path) {
    if (current == null) return undefined;
    if (typeof current !== "object") return undefined;

    if (Array.isArray(current)) {
      if (typeof key !== "number") return undefined;
      current = current[key];
    } else {
      current = (current as Record<string, unknown>)[key];
    }
  }

  return current;
}
