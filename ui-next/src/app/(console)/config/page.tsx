'use client';

import { useState } from 'react';
import { useGateway } from '@/contexts/gateway-context';

export default function ConfigPage() {
  const { connected, request } = useGateway();
  const [config, setConfig] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  const loadConfig = async () => {
    if (!connected) return;
    setLoading(true);
    try {
      const result = await request<Record<string, unknown>>('config.get', {});
      setConfig(result);
    } catch (error) {
      console.error('Failed to load config:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1>配置</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          安全编辑 ~/.openclaw/openclaw.json
        </p>
        <button
          onClick={loadConfig}
          disabled={!connected || loading}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: connected ? 'var(--accent)' : 'var(--bg-tertiary)',
            color: 'white',
            borderRadius: '0.375rem',
            cursor: connected ? 'pointer' : 'not-allowed',
          }}
        >
          {loading ? '加载中...' : '加载配置'}
        </button>
      </div>

      {config && (
        <pre style={{
          padding: '1rem',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '0.375rem',
          overflow: 'auto',
        }}>
          {JSON.stringify(config, null, 2)}
        </pre>
      )}
    </div>
  );
}
