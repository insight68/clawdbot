/**
 * FormEditor - JSON Schema 表单编辑器
 * 使用 @rjsf/shadcn 渲染配置表单
 *
 * 从 ui_lit/src/ui/views/config-form.render.ts 迁移
 */

'use client'

import Form from '@rjsf/shadcn'
import validator from '@rjsf/validator-ajv8'
import type { IChangeEvent } from '@rjsf/core'
import type { RJSFSchema } from '@rjsf/utils'
import { useConfigStore } from '@/store/use-config-store'
import type { ConfigUiHint, ConfigUiHints } from '@/types/config'
import { cloneConfigObject } from '@/lib/config-form-utils'
import { customWidgets } from './fields'

/**
 * UiSchema 类型定义
 * 用于配置 RJSF 表单的 UI 行为
 */
type UiSchema = Record<string, {
  'ui:widget'?: string
  'ui:placeholder'?: string
  'ui:help'?: string
  'ui:title'?: string
  'ui:description'?: string
  'ui:disabled'?: boolean
  'ui:readonly'?: boolean
  'ui:options'?: {
    label?: boolean
    rows?: number
    inputType?: string
    [key: string]: unknown
  }
  'ui:order'?: string[]
  'ui:classNames'?: string
  items?: any
  [key: string]: any
} | string[] | undefined>

/**
 * RJSF UiSchema 字段类型
 */
interface UiSchemaField {
  'ui:widget'?: string
  'ui:placeholder'?: string
  'ui:help'?: string
  'ui:title'?: string
  'ui:description'?: string
  'ui:disabled'?: boolean
  'ui:readonly'?: boolean
  'ui:options'?: {
    label?: boolean
    rows?: number
    inputType?: string
    [key: string]: unknown
  }
  'ui:order'?: string[]
  'ui:classNames'?: string
  items?: UiSchemaField
}

/**
 * Gateway Schema 属性类型
 */
interface GatewayPropertySchema {
  type?: string
  title?: string
  description?: string
  default?: unknown
  enum?: unknown[]
  const?: unknown
  properties?: Record<string, GatewayPropertySchema>
  items?: GatewayPropertySchema
  additionalProperties?: boolean | GatewayPropertySchema
  required?: string[]
  anyOf?: GatewayPropertySchema[]
  oneOf?: GatewayPropertySchema[]
  allOf?: GatewayPropertySchema[]
  pattern?: string
  format?: string
  minimum?: number
  maximum?: number
  minLength?: number
  maxLength?: number
  minItems?: number
  maxItems?: number
  uniqueItems?: boolean
  hint?: string
  tags?: string[]
}

interface GatewaySchema {
  type?: string
  title?: string
  description?: string
  properties?: Record<string, GatewayPropertySchema>
  required?: string[]
  definitions?: Record<string, RJSFSchema>
}

/**
 * 转换 Gateway Schema 为 RJSF Schema
 * 处理 hint 字段和其他特殊属性
 */
function transformGatewaySchemaToRJSF(
  gatewaySchema: GatewaySchema | null | undefined,
): RJSFSchema {
  if (!gatewaySchema) {
    return {
      type: 'object',
      title: '配置',
      properties: {},
    }
  }

  const transformProperty = (prop: GatewayPropertySchema | any): RJSFSchema => {
    // 处理 false 或 boolean 类型（用于禁用属性）
    if (typeof prop === 'boolean') {
      return { type: 'boolean' }
    }

    const { hint, tags, ...rest } = prop || {}
    const result: RJSFSchema = { ...(rest || {}) } as RJSFSchema

    // 将 hint 添加到 description 中
    if (hint && !result.description) {
      result.description = hint
    } else if (hint && result.description) {
      result.description = `${result.description}\n\n${hint}`
    }

    // 处理嵌套属性
    if (result.properties) {
      const transformedProperties: Record<string, RJSFSchema> = {}
      for (const [key, value] of Object.entries(result.properties)) {
        transformedProperties[key] = transformProperty(value)
      }
      result.properties = transformedProperties
    }

    // 处理数组项
    if (result.items) {
      result.items = transformProperty(result.items)
    }

    return result
  }

  const result = {
    ...gatewaySchema,
    properties: {},
  } as RJSFSchema

  if (gatewaySchema.properties) {
    for (const [key, value] of Object.entries(gatewaySchema.properties)) {
      if (result.properties) {
        (result.properties as Record<string, RJSFSchema>)[key] = transformProperty(value)
      }
    }
  }

  if (gatewaySchema.definitions) {
    result.definitions = gatewaySchema.definitions
  }

  return result
}

/**
 * 从 ConfigUiHints 构建 RJSF uiSchema
 * uiHints 是 Gateway 返回的 UI 提示信息
 */
function buildUiSchemaFromHints(
  uiHints: ConfigUiHints | null | undefined,
): UiSchema {
  if (!uiHints) {
    return {}
  }

  const uiSchema: UiSchema = {}

  for (const [key, hint] of Object.entries(uiHints)) {
    const fieldSchema: UiSchemaField = {}

    // 设置字段类型 widget
    if (hint.widget) {
      fieldSchema['ui:widget'] = hint.widget
    }

    // 设置输入占位符
    if (hint.placeholder) {
      fieldSchema['ui:placeholder'] = hint.placeholder
    }

    // 设置帮助文本
    if (hint.help) {
      fieldSchema['ui:help'] = hint.help
    }

    // 自定义标题
    if (hint.label) {
      fieldSchema['ui:title'] = hint.label
    }

    // 自定义描述
    if (hint.description) {
      fieldSchema['ui:description'] = hint.description
    }

    // 禁用状态
    if (hint.disabled) {
      fieldSchema['ui:disabled'] = true
    }

    // 只读状态
    if (hint.readonly) {
      fieldSchema['ui:readonly'] = true
    }

    // 设置选项
    if (hint.options) {
      fieldSchema['ui:options'] = {
        ...hint.options,
      }
    }

    // 设置 CSS 类
    if (hint.className) {
      fieldSchema['ui:classNames'] = hint.className
    }

    // 设置字段顺序
    if (hint.order && Array.isArray(hint.order)) {
      fieldSchema['ui:order'] = hint.order
    }

    // 如果有任何配置，添加到 uiSchema
    if (Object.keys(fieldSchema).length > 0) {
      uiSchema[key] = fieldSchema
    }
  }

  return uiSchema
}

/**
 * 合并嵌套的 uiHints
 * 将点分隔的路径转换为嵌套对象
 */
function flattenUiHints(
  uiHints: ConfigUiHints | null | undefined,
): ConfigUiHints {
  if (!uiHints) return {}

  const result: ConfigUiHints = {}

  for (const [key, hint] of Object.entries(uiHints)) {
    // 如果 key 包含点，需要处理嵌套
    if (key.includes('.')) {
      // 顶级键，直接添加
      const topLevelKey = key.split('.')[0]
      if (!result[topLevelKey]) {
        result[topLevelKey] = { items: { ...hint } } as any
      }
    } else {
      result[key] = hint
    }
  }

  return result
}

interface FormEditorProps {
  className?: string
}

/**
 * FormEditor 组件
 * 使用 @rjsf/shadcn 渲染 JSON Schema 表单
 */
export function FormEditor({ className = '' }: FormEditorProps) {
  const {
    schema,
    snapshot,
    editedValues,
    setEditedValue,
    viewMode,
  } = useConfigStore()

  // 仅在 form 模式下渲染
  if (viewMode !== 'form') {
    return null
  }

  // 从 schema 获取 uiHints
  const uiHints = schema?.uiHints || null

  // 转换 Gateway schema 为 RJSF 格式
  const rjsfSchema = transformGatewaySchemaToRJSF(schema as GatewaySchema | null)

  // 生成 uiSchema
  const flattenedHints = flattenUiHints(uiHints)
  const rjsfUiSchema = buildUiSchemaFromHints(flattenedHints)

  // 获取表单数据：优先使用编辑值，其次使用快照配置
  const formData = editedValues || snapshot?.config || {}

  // 处理表单变化
  const handleChange = ({ formData: newData }: IChangeEvent<unknown>) => {
    // 深拷贝新数据
    const clonedData = cloneConfigObject(newData)

    // 更新 store 中的编辑值
    setEditedValue('', clonedData as Record<string, unknown>)
  }

  // 处理错误
  const handleError = (errors: unknown[]) => {
    console.warn('[FormEditor] Validation errors:', errors)
  }

  // 自定义表单组件
  const widgets = customWidgets

  // 如果没有 schema 或配置，显示加载状态
  if (!schema) {
    return (
      <div className={`h-full flex items-center justify-center ${className}`}>
        <div className="text-center text-muted-foreground">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-current mb-4" />
          <p className="text-sm">加载配置 Schema...</p>
        </div>
      </div>
    )
  }

  // 如果没有配置数据，显示空状态
  if (!snapshot?.config && !editedValues) {
    return (
      <div className={`h-full flex items-center justify-center ${className}`}>
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium mb-2">暂无配置数据</p>
          <p className="text-sm">请先加载配置</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`form-editor ${className}`}>
      <Form
        schema={rjsfSchema}
        uiSchema={rjsfUiSchema}
        formData={formData}
        onChange={handleChange}
        onError={handleError}
        validator={validator}
        widgets={widgets}
        liveValidate
        idSeparator="."
        omitExtraData={false}
        liveOmit
      />
    </div>
  )
}

export default FormEditor
