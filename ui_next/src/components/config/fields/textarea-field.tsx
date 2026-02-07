/**
 * 长文本字段组件
 * 用于 RJSF 表单中的多行文本输入
 */

'use client'

interface TextareaFieldProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  rows?: number
}

/**
 * 长文本字段组件
 */
export function TextareaField({
  value = '',
  onChange,
  placeholder,
  disabled = false,
  readonly = false,
  rows = 4,
}: TextareaFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  return (
    <textarea
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readonly}
      rows={rows}
      className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-y"
    />
  )
}

export default TextareaField
