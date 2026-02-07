/**
 * 配置验证显示组件
 * 显示 Gateway 返回的配置验证问题
 * 从 ui_lit 迁移
 */

'use client'

import type { ConfigSnapshotIssue } from '@/types/config'

interface ConfigValidationProps {
  issues: ConfigSnapshotIssue[] | null | undefined
  valid: boolean | null | undefined
  className?: string
}

/**
 * 配置验证显示组件
 * 显示配置的有效性和验证问题列表
 */
export function ConfigValidation({
  issues,
  valid,
  className = '',
}: ConfigValidationProps) {
  // 如果没有验证信息，不显示
  if (valid === null && (!issues || issues.length === 0)) {
    return null
  }

  const hasErrors = issues && issues.length > 0
  const isValid = valid === true && !hasErrors

  return (
    <div className={`config-validation ${className}`}>
      {/* 验证状态徽章 */}
      <div className="flex items-center gap-2 mb-3">
        {isValid ? (
          <div className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="font-medium">配置有效</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span className="font-medium">
              {hasErrors ? `${issues.length} 个问题` : '配置验证中'}
            </span>
          </div>
        )}
      </div>

      {/* 问题列表 */}
      {hasErrors && (
        <div className="space-y-2">
          {issues.map((issue, index) => (
            <ValidationIssue key={index} issue={issue} />
          ))}
        </div>
      )}
    </div>
  )
}

interface ValidationIssueProps {
  issue: ConfigSnapshotIssue
}

/**
 * 单个验证问题显示
 */
function ValidationIssue({ issue }: ValidationIssueProps) {
  return (
    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
      {/* 路径 */}
      {issue.path && (
        <code className="text-xs font-mono text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded">
          {issue.path}
        </code>
      )}

      {/* 消息 */}
      <p className="text-sm text-amber-800 dark:text-amber-200 mt-1.5">
        {issue.message}
      </p>

      {/* 修复建议按钮（可选） */}
      <button
        type="button"
        className="mt-2 text-xs text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 underline"
        onClick={() => {
          // 可以在这里添加跳转到问题字段的逻辑
          console.log('Navigate to issue:', issue.path)
        }}
      >
        跳转到此字段
      </button>
    </div>
  )
}

/**
 * 紧凑型验证状态徽章
 * 用于工具栏或标题栏
 */
interface ValidationBadgeProps {
  valid: boolean | null | undefined
  issues: ConfigSnapshotIssue[] | null | undefined
  showText?: boolean
}

export function ValidationBadge({
  valid,
  issues,
  showText = false,
}: ValidationBadgeProps) {
  const hasErrors = issues && issues.length > 0
  const isValid = valid === true && !hasErrors
  const isInvalid = valid === false || hasErrors

  if (!isValid && !isInvalid) {
    return null
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
        isValid
          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
          : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
      }`}
    >
      {isValid ? (
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {showText && (
        <span>
          {isValid ? '有效' : hasErrors ? `${issues.length} 个问题` : '无效'}
        </span>
      )}
    </div>
  )
}

export default ConfigValidation
