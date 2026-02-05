'use client';

import { useState } from 'react';
import { useGatewayConnection } from '@/hooks/use-gateway-connection';
import { useUIStore } from '@/store/use-ui-store';

export default function TestGatewayPage() {
  const { gatewayUrl, setGatewayUrl } = useUIStore();
  const [urlInput, setUrlInput] = useState(gatewayUrl || 'ws://localhost:18789');

  const { client, connected, connecting, error, hello } = useGatewayConnection({
    url: urlInput,
    onHello: (helloData) => {
      console.log('Gateway hello:', helloData);
    },
    onEvent: (evt) => {
      console.log('Gateway event:', evt);
    },
    onClose: (info) => {
      console.log('Gateway closed:', info);
    },
  });

  const handleConnect = () => {
    setGatewayUrl(urlInput);
  };

  const handleTestRequest = async () => {
    if (!connected || !client) return;
    try {
      const result = await client.request('status', {});
      console.log('Status result:', result);
      alert('请求成功！查看控制台获取结果');
    } catch (err) {
      console.error('Request error:', err);
      alert(`请求失败: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1>Gateway 连接测试</h1>
        <p style={{ color: 'var(--text-secondary)' }}>测试与 OpenClaw Gateway 的 WebSocket 连接</p>
      </header>

      <main style={{ maxWidth: '800px' }}>
        {/* 连接配置 */}
        <section style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '0.5rem' }}>
          <h2>连接配置</h2>
          <div style={{ marginTop: '1rem' }}>
            <label htmlFor="gateway-url" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Gateway URL
            </label>
            <input
              id="gateway-url"
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="ws://localhost:18789"
              style={{ width: '100%', padding: '0.75rem' }}
            />
            <button
              onClick={handleConnect}
              disabled={connecting}
              style={{
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: connected ? 'var(--success)' : 'var(--accent)',
                color: 'white',
                borderRadius: '0.375rem',
                cursor: connecting ? 'not-allowed' : 'pointer',
                opacity: connecting ? 0.6 : 1,
              }}
            >
              {connecting ? '连接中...' : connected ? '已连接' : '连接'}
            </button>
          </div>
        </section>

        {/* 连接状态 */}
        <section style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '0.5rem' }}>
          <h2>连接状态</h2>
          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: connected ? 'var(--success)' : 'var(--text-tertiary)' }}></span>
              <span>状态: {connected ? '已连接' : '未连接'}</span>
            </div>
            {error && (
              <p style={{ color: 'var(--error)', marginTop: '0.5rem' }}>
                错误: {error.message}
              </p>
            )}
            {hello && (
              <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '0.375rem' }}>
                <p><strong>协议版本:</strong> {hello.protocol}</p>
                <p><strong>功能:</strong> {hello.features?.methods?.length || 0} 方法, {hello.features?.events?.length || 0} 事件</p>
                {hello.auth && (
                  <p><strong>认证:</strong> {hello.auth.role} (scope: {hello.auth.scopes?.join(', ')})</p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* 测试请求 */}
        <section style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '0.5rem' }}>
          <h2>测试请求</h2>
          <div style={{ marginTop: '1rem' }}>
            <button
              onClick={handleTestRequest}
              disabled={!connected}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: connected ? 'var(--accent)' : 'var(--bg-tertiary)',
                color: connected ? 'white' : 'var(--text-tertiary)',
                borderRadius: '0.375rem',
                cursor: connected ? 'pointer' : 'not-allowed',
              }}
            >
              发送状态请求
            </button>
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              发送一个 status 请求测试 Gateway 通信
            </p>
          </div>
        </section>

        {/* 事件日志 */}
        <section style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '0.5rem' }}>
          <h2>使用说明</h2>
          <ol style={{ marginLeft: '1.5rem', marginTop: '1rem', lineHeight: '1.8' }}>
            <li>确保 OpenClaw Gateway 正在运行（默认端口 18789）</li>
            <li>输入 Gateway URL（如果是同域部署，可以使用相对路径）</li>
            <li>点击"连接"按钮建立 WebSocket 连接</li>
            <li>连接成功后，可以看到协议版本和认证信息</li>
            <li>点击"发送状态请求"测试 API 调用</li>
          </ol>
        </section>
      </main>

      <footer style={{ marginTop: '3rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <a href="/" style={{ color: 'var(--accent)' }}>← 返回首页</a>
      </footer>
    </div>
  );
}
