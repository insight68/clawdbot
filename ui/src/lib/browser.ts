// Browser API Utilities for Next.js SSR compatibility

export function canUseBrowserAPI(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof document !== "undefined" &&
    typeof localStorage !== "undefined" &&
    typeof WebSocket !== "undefined"
  );
}

export function getLocalStorage(): Storage | null {
  if (canUseBrowserAPI()) {
    try {
      return window.localStorage;
    } catch {
      return null;
    }
  }
  return null;
}

export function getDefaultGatewayUrl(): string {
  if (!canUseBrowserAPI()) {
    return ""; // SSR returns empty string
  }
  const proto = window.location.protocol === "https:" ? "wss" : "ws";
  return `${proto}://${window.location.host}`;
}
