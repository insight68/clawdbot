/**
 * 核心库函数统一导出
 */

// Gateway 相关
export { GatewayBrowserClient } from "./gateway";
export type {
  GatewayEventFrame,
  GatewayResponseFrame,
  GatewayHelloOk,
  GatewayBrowserClientOptions,
} from "./gateway";

// 设备身份验证
export type { DeviceIdentity } from "./device-identity";
export type { DeviceAuthEntry } from "./device-auth";
export {
  loadOrCreateDeviceIdentity,
  signDevicePayload,
} from "./device-identity";
export {
  loadDeviceAuthToken,
  storeDeviceAuthToken,
  clearDeviceAuthToken,
} from "./device-auth";

// 导航
export * from "./navigation";

// 浏览器兼容性
export { canUseBrowserAPI } from "./browser";

// 格式化工具
export * from "./format";

// 消息处理
export * from "./message-extract";
export * from "./message-normalizer";
export * from "./tool-cards";

// 配置表单工具
export * from "./config-form-utils";
