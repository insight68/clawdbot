'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { GatewayBrowserClient, type GatewayBrowserClientOptions, type GatewayHelloOk } from '@/lib/gateway';
import type { GatewayEventFrame } from '@/lib/gateway';

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

  // Use ref to keep callbacks stable without triggering re-renders
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    // Only create client in browser environment
    if (typeof window === 'undefined') return;

    const client = new GatewayBrowserClient({
      url: options.url,
      token: options.token,
      password: options.password,
      onHello: (hello) => {
        setHello(hello);
        setConnected(true);
        setConnecting(false);
        setError(null);
        optionsRef.current.onHello?.(hello);
      },
      onEvent: (evt) => {
        optionsRef.current.onEvent?.(evt);
      },
      onClose: (info) => {
        setConnected(false);
        setConnecting(false);
        optionsRef.current.onClose?.(info);
      },
    });

    // Start connection
    setConnecting(true);
    client.start();
    clientRef.current = client;

    return () => {
      client.stop();
      clientRef.current = null;
    };
  }, [options.url, options.token, options.password]);

  const request = useCallback(<T,>(method: string, params?: unknown): Promise<T> => {
    if (!clientRef.current || !connected) {
      return Promise.reject(new Error('Gateway not connected'));
    }
    return clientRef.current.request<T>(method, params);
  }, [connected]);

  return {
    client: clientRef.current,
    connected,
    connecting,
    error,
    hello,
    request,
  };
}
