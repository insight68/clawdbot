/**
 * 代码编辑器字段组件
 * 用于 RJSF 表单中的 JSON/YAML 代码编辑
 */

'use client'

import { useState } from 'react'

interface CodeEditorFieldProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  language?: 'json' | 'yaml' | 'text'
  rows?: number
}

/**
 * 代码编辑器字段组件
 * 提供语法高亮和格式化功能（简化版）
 */
export function CodeEditorField({
  value = '',
  onChange,
  placeholder = '// Enter code here...',
  disabled = false,
  readonly = false,
  language = 'text',
  rows = 8,
}: CodeEditorFieldProps) {
  const [formatError, setFormatError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    onChange(newValue)

    // 验证 JSON/YAML 格式
    if (language === 'json' && newValue.trim()) {
      try {
        JSON.parse(newValue)
        setFormatError(null)
      } catch (err) {
        setFormatError((err as Error).message)
      }
    } else {
      setFormatError(null)
    }
  }

  const handleFormat = () => {
    if (language === 'json' && value.trim()) {
      try {
        const parsed = JSON.parse(value)
        const formatted = JSON.stringify(parsed, null, 2)
        onChange(formatted)
        setFormatError(null)
      } catch (err) {
        setFormatError((err as Error).message)
      }
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground uppercase font-medium">
          {language}
        </span>
        {language === 'json' && (
          <button
            type="button"
            onClick={handleFormat}
            disabled={disabled || readonly}
            className="text-xs px-2 py-1 bg-muted hover:bg-muted-foreground/10 rounded transition-colors disabled:opacity-50"
          >
            格式化
          </button>
        )}
      </div>

      <textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readonly}
        rows={rows}
        className={`w-full px-3 py-2 text-sm font-mono bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-y ${
          formatError ? 'border-red-500' : 'border-border'
        }`}
        spellCheck={false}
      />

      {formatError && (
        <p className="text-xs text-red-500">{formatError}</p>
      )}
    </div>
  )
}

export default CodeEditorField
