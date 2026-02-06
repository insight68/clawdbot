"use client";

import { createContext, useContext, ReactNode } from "react";
import { useGatewayConnection } from "@/hooks/use-gateway-connection";
import { useUIStore } from "@/store/use-ui-store";

export interface GatewayContextValue {
  connected: boolean;
  connecting: boolean;
  error: Error | null;
  request: <T = unknown>(method: string, params?: unknown) => Promise<T>;
}

const GatewayContext = createContext<GatewayContextValue | null>(null);

export function useGateway() {
  const context = useContext(GatewayContext);
  if (!context) {
    throw new Error("useGateway must be used within GatewayProvider");
  }
  return context;
}

interface GatewayProviderProps {
  children: ReactNode;
}

export function GatewayProvider({ children }: GatewayProviderProps) {
  const { gatewayUrl } = useUIStore();

  const { connected, connecting, error, request } = useGatewayConnection({
    url: gatewayUrl || "ws://localhost:18789",
    onHello: (helloData) => {
      console.log("[GatewayProvider] Gateway hello:", helloData);
    },
    onEvent: (evt) => {
      console.log("[GatewayProvider] Gateway event:", evt);
    },
    onClose: (info) => {
      console.log("[GatewayProvider] Gateway closed:", info);
    },
  });

  const value: GatewayContextValue = {
    connected,
    connecting,
    error,
    request,
  };

  return <GatewayContext.Provider value={value}>{children}</GatewayContext.Provider>;
}
