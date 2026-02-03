import { consume } from "@lit/context";
import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { appContext } from "../app";

/**
 * Marketing Assistant View Component
 *
 * 营销助手页面组件 - 混合模式：功能面板 + 聊天区域
 */
@customElement("openclaw-view-marketing")
export class MarketingView extends LitElement {
  static styles = css`
    :host {
      display: block;
      height: 100%;
    }
    
    .assistant-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }
    
    /* 功能面板区域 - 30-40% 高度 */
    .function-panel {
      flex: 0 0 auto;
      padding: var(--space-xl) var(--space-2xl);
      background: var(--card);
      border-bottom: 1px solid var(--border);
      overflow-y: auto;
      max-height: 40vh;
    }
    
    .panel-header {
      margin-bottom: var(--space-lg);
    }
    
    .panel-title {
      font-family: var(--font-display);
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-strong);
      margin: 0 0 var(--space-sm) 0;
    }
    
    .panel-subtitle {
      font-family: var(--font-body);
      font-size: 0.9375rem;
      color: var(--muted);
      margin: 0;
    }
    
    .quick-actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--space-md);
      margin-bottom: var(--space-xl);
    }
    
    .action-card {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: var(--space-lg);
      cursor: pointer;
      transition: all var(--duration-fast) var(--ease-out);
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
    }
    
    .action-card:hover {
      border-color: var(--accent);
      background: var(--bg-hover);
      transform: translateY(-2px);
    }
    
    .action-icon {
      font-size: 1.5rem;
    }
    
    .action-title {
      font-family: var(--font-body);
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-strong);
    }
    
    .action-description {
      font-family: var(--font-body);
      font-size: 0.875rem;
      color: var(--muted);
    }
    
    .tools-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: var(--space-md);
    }
    
    .tool-card {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: var(--space-md);
      transition: all var(--duration-fast) var(--ease-out);
    }
    
    .tool-card:hover {
      border-color: var(--accent);
    }
    
    .tool-name {
      font-family: var(--font-body);
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--text-strong);
      margin-bottom: var(--space-xs);
    }
    
    .tool-description {
      font-family: var(--font-body);
      font-size: 0.8125rem;
      color: var(--muted);
    }
    
    /* 聊天区域 - 60-70% 高度 */
    .chat-area {
      flex: 1;
      min-height: 0;
      overflow: hidden;
    }
    
    .chat-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: var(--muted);
      font-family: var(--font-body);
    }
    
    @media (max-width: 768px) {
      .function-panel {
        max-height: 50vh;
        padding: var(--space-md);
      }
    
      .quick-actions {
        grid-template-columns: 1fr;
      }
    }
  `;

  @consume({ context: appContext, subscribe: true })
  @state()
  app?: any;

  @state()
  selectedAction: string | null = null;

  protected createRenderRoot() {
    return this;
  }

  private handleActionClick(action: string) {
    this.selectedAction = action;
    // TODO: 将操作注入到聊天界面作为提示词
  }

  private handleToolClick(tool: string) {
    // TODO: 触发工具调用
  }

  render() {
    return html`
      <div class="assistant-container">
        <!-- 功能面板区域 -->
        <div class="function-panel">
          <div class="panel-header">
            <h1 class="panel-title">营销助手</h1>
            <p class="panel-subtitle">营销活动策划、内容生成和效果分析</p>
          </div>

          <!-- 快捷操作 -->
          <div class="quick-actions">
            <div
              class="action-card"
              @click=${() => this.handleActionClick("campaign")}
              role="button"
              tabindex="0"
            >
              <div class="action-icon">📢</div>
              <div class="action-title">创建营销活动</div>
              <div class="action-description">规划新的营销活动和推广策略</div>
            </div>

            <div
              class="action-card"
              @click=${() => this.handleActionClick("content")}
              role="button"
              tabindex="0"
            >
              <div class="action-icon">✍️</div>
              <div class="action-title">生成营销内容</div>
              <div class="action-description">创建广告文案、社交媒体帖子等</div>
            </div>

            <div
              class="action-card"
              @click=${() => this.handleActionClick("analyze")}
              role="button"
              tabindex="0"
            >
              <div class="action-icon">📊</div>
              <div class="action-title">分析营销数据</div>
              <div class="action-description">分析营销效果和ROI</div>
            </div>

            <div
              class="action-card"
              @click=${() => this.handleActionClick("optimize")}
              role="button"
              tabindex="0"
            >
              <div class="action-icon">🎯</div>
              <div class="action-title">优化投放策略</div>
              <div class="action-description">优化广告投放和受众定位</div>
            </div>
          </div>

          <!-- 相关工具 -->
          <div class="tools-grid">
            <div
              class="tool-card"
              @click=${() => this.handleToolClick("email-campaign")}
              role="button"
              tabindex="0"
            >
              <div class="tool-name">📧 邮件营销</div>
              <div class="tool-description">创建和管理邮件营销活动</div>
            </div>

            <div
              class="tool-card"
              @click=${() => this.handleToolClick("social-media")}
              role="button"
              tabindex="0"
            >
              <div class="tool-name">📱 社交媒体</div>
              <div class="tool-description">社交媒体内容发布和管理</div>
            </div>

            <div
              class="tool-card"
              @click=${() => this.handleToolClick("ad-copy")}
              role="button"
              tabindex="0"
            >
              <div class="tool-name">📝 广告文案</div>
              <div class="tool-description">生成高转化率的广告文案</div>
            </div>

            <div
              class="tool-card"
              @click=${() => this.handleToolClick("audience")}
              role="button"
              tabindex="0"
            >
              <div class="tool-name">👥 受众分析</div>
              <div class="tool-description">分析目标受众和行为特征</div>
            </div>
          </div>
        </div>

        <!-- 聊天区域 -->
        <div class="chat-area">
          <div class="chat-placeholder">
            聊天区域（集成现有 chat 组件）
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "openclaw-view-marketing": MarketingView;
  }
}
