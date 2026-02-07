/**
 * 密码字段组件
 * 用于 RJSF 表单中的敏感信息输入
 */

'use client'

import { useState } from 'react'

interface PasswordFieldProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
}

/**
 * 密码字段组件
 * 带显示/隐藏切换功能
 */
export function PasswordField({
  value = '',
  onChange,
  placeholder = '••••••••',
  disabled = false,
  readonly = false,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const toggleVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="flex gap-2">
      <input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readonly}
        className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <button
        type="button"
        onClick={toggleVisibility}
        disabled={disabled || readonly}
        className="px-3 py-2 text-sm bg-muted border border-border rounded-md hover:bg-muted-foreground/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        tabIndex={-1}
      >
        {showPassword ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        )}
      </button>
    </div>
  )
}

export default PasswordField
