"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { GatewayEventFrame } from "@/lib/gateway";
import { GatewayBrowserClient, type GatewayHelloOk } from "@/lib/gateway";

export interface UseGatewayConnectionOptions {
  url: string;
  token?: string;
  password?: string;
  onHello?: (hello: GatewayHelloOk) => void;
  onEvent?: (evt: GatewayEventFrame) => void;
  onClose?: (info: { code: number; reason: string }) => void;
}

export function useGatewayConnection(options: UseGatewayConnectionOptions) {
  const clientRef = useRef<GatewayBrowserClient | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hello, setHello] = useState<GatewayHelloOk | null>(null);

  // Store callbacks in refs to avoid recreating client
  const onHelloRef = useRef(options.onHello);
  const onEventRef = useRef(options.onEvent);
  const onCloseRef = useRef(options.onClose);

  // Update refs when options change
  useEffect(() => {
    onHelloRef.current = options.onHello;
    onEventRef.current = options.onEvent;
    onCloseRef.current = options.onClose;
  }, [options.onHello, options.onEvent, options.onClose]);

  useEffect(() => {
    // Only create client in browser environment
    if (typeof window === "undefined") return;

    // Defer state updates to avoid cascading renders
    const timeoutId = setTimeout(() => setConnecting(true), 0);

    const client = new GatewayBrowserClient({
      url: options.url,
      token: options.token,
      password: options.password,
      onHello: (hello) => {
        setHello(hello);
        setConnected(true);
        setConnecting(false);
        setError(null);
        onHelloRef.current?.(hello);
      },
      onEvent: (evt) => {
        onEventRef.current?.(evt);
      },
      onClose: (info) => {
        setConnected(false);
        setConnecting(false);
        onCloseRef.current?.(info);
      },
    });

    // Start connection
    client.start();
    clientRef.current = client;

    return () => {
      clearTimeout(timeoutId);
      client.stop();
      clientRef.current = null;
    };
  }, [options.url, options.token, options.password]);

  const request = useCallback(
    <T>(method: string, params?: unknown): Promise<T> => {
      if (!clientRef.current || !connected) {
        return Promise.reject(new Error("Gateway not connected"));
      }
      return clientRef.current.request<T>(method, params);
    },
    [connected],
  );

  return {
    client: clientRef.current,
    connected,
    connecting,
    error,
    hello,
    request,
  };
}
