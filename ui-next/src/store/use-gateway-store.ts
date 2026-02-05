'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GatewayState {
  gatewayUrl: string;
  token: string;
  deviceToken: string | null;
  sessionKey: string;

  // Actions
  setGatewayUrl: (url: string) => void;
  setToken: (token: string) => void;
  setDeviceToken: (token: string) => void;
  setSessionKey: (key: string) => void;
  clearDeviceToken: () => void;
}

export const useGatewayStore = create<GatewayState>()(
  persist(
    (set) => ({
      gatewayUrl: '',
      token: '',
      deviceToken: null,
      sessionKey: '',

      setGatewayUrl: (url) => set({ gatewayUrl: url }),
      setToken: (token) => set({ token }),
      setDeviceToken: (token) => set({ deviceToken: token }),
      setSessionKey: (key) => set({ sessionKey: key }),
      clearDeviceToken: () => set({ deviceToken: null }),
    }),
    {
      name: 'openclaw-gateway-storage',
      partialize: (state) => ({
        gatewayUrl: state.gatewayUrl,
        token: state.token,
        deviceToken: state.deviceToken,
        sessionKey: state.sessionKey,
      }),
    }
  )
);
