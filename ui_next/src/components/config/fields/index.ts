/**
 * 自定义字段组件导出
 * 用于 RJSF 表单
 */

'use client'

import React from 'react'

export { PasswordField } from './password-field'
export { TextareaField } from './textarea-field'
export { CodeEditorField } from './code-editor-field'

/**
 * RJSF widgets 映射
 * 将自定义字段注册到 RJSF
 */
import { PasswordField } from './password-field'
import { TextareaField } from './textarea-field'
import { CodeEditorField } from './code-editor-field'

// RJSF Widget 包装器
function wrapWidget(Component: React.ComponentType<any>) {
  return function WrappedWidget(props: any) {
    const { onChange, value, ...rest } = props
    return React.createElement(Component, { value, onChange, ...rest })
  }
}

export const customWidgets = {
  password: wrapWidget(PasswordField),
  textarea: wrapWidget(TextareaField),
  codeeditor: wrapWidget(CodeEditorField),
  'code-editor': wrapWidget(CodeEditorField),
}
