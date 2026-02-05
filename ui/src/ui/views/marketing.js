var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
            ? (desc = Object.getOwnPropertyDescriptor(target, key))
            : desc,
      d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return (c > 3 && r && Object.defineProperty(target, key, r), r);
  };
import { LitElement, html, css, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { filterMarketingSkills, groupSkillsByCategory } from "../../config/skill-mappings";
/**
 * Marketing Assistant View Component
 *
 * 营销助手页面组件 - 混合模式：功能面板 + 聊天区域
 */
let MarketingView = class MarketingView extends LitElement {
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
      transition: max-height 300ms var(--ease-out);
    }
    
    .function-panel--collapsed {
      max-height: 0;
      padding: 0;
      border-width: 0;
      overflow: hidden;
    }
    
    .panel-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: var(--space-lg);
    }
    
    .panel-header-text {
      flex: 1;
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
    
    .panel-controls {
      display: flex;
      gap: var(--space-sm);
    }
    
    .panel-control-button {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all 150ms var(--ease-out);
      color: var(--muted);
    }
    
    .panel-control-button:hover {
      background: var(--bg-hover);
      color: var(--text);
      border-color: var(--border-hover);
    }
    
    /* 分组标题 */
    .section-title {
      font-family: var(--font-body);
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: var(--space-lg) 0 var(--space-md) 0;
    }
    
    .section-title:first-of-type {
      margin-top: 0;
    }
    
    /* 快捷操作区域 */
    .quick-actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--space-md);
      margin-bottom: var(--space-xl);
    }
    
    /* Skills 网格区域 */
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: var(--space-md);
    }
    
    /* 聊天区域 - 60-70% 高度 */
    .chat-area {
      flex: 1;
      min-height: 0;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    
    .chat-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: var(--muted);
      font-family: var(--font-body);
    }
    
    /* 空状态 */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-3xl);
      text-align: center;
      color: var(--muted);
    }
    
    .empty-state-icon {
      font-size: 3rem;
      margin-bottom: var(--space-md);
      opacity: 0.5;
    }
    
    .empty-state-text {
      font-family: var(--font-body);
      font-size: 1rem;
    }
    
    @media (max-width: 768px) {
      .function-panel {
        max-height: 50vh;
        padding: var(--space-md);
      }
    
      .quick-actions {
        grid-template-columns: 1fr;
      }
    
      .panel-title {
        font-size: 1.5rem;
      }
    }
  `;
  skillsReport;
  selectedSkillKey = null;
  panelCollapsed = false;
  allSkills = [];
  // 模拟数据标志（开发模式）
  useMockData = false;
  createRenderRoot() {
    return this;
  }
  connectedCallback() {
    super.connectedCallback();
    // 不再需要 loadSkills，因为直接从 app.skillsReport 获取
  }
  disconnectedCallback() {
    super.disconnectedCallback();
  }
  // 获取模拟数据
  getMockSkills() {
    return [
      {
        skillKey: "marketing-campaign",
        name: "创建营销活动",
        description: "规划新的营销活动和推广策略",
        enabled: true,
        source: "builtin",
        messageCount: 0,
        editCount: 0,
        lastUsedAt: null,
        editedAt: null,
        messages: {},
      },
      {
        skillKey: "marketing-content",
        name: "生成营销内容",
        description: "创建广告文案、社交媒体帖子等",
        enabled: true,
        source: "builtin",
        messageCount: 0,
        editCount: 0,
        lastUsedAt: null,
        editedAt: null,
        messages: {},
      },
      {
        skillKey: "marketing-analyze",
        name: "分析营销数据",
        description: "分析营销效果和ROI",
        enabled: true,
        source: "builtin",
        messageCount: 0,
        editCount: 0,
        lastUsedAt: null,
        editedAt: null,
        messages: {},
      },
      {
        skillKey: "marketing-optimize",
        name: "优化投放策略",
        description: "优化广告投放和受众定位",
        enabled: true,
        source: "builtin",
        messageCount: 0,
        editCount: 0,
        lastUsedAt: null,
        editedAt: null,
        messages: {},
      },
      {
        skillKey: "email-campaign",
        name: "邮件营销",
        description: "创建和管理邮件营销活动",
        enabled: true,
        source: "builtin",
        messageCount: 0,
        editCount: 0,
        lastUsedAt: null,
        editedAt: null,
        messages: {},
      },
      {
        skillKey: "social-media-weibo",
        name: "社交媒体营销",
        description: "社交媒体内容发布和管理",
        enabled: true,
        source: "builtin",
        messageCount: 0,
        editCount: 0,
        lastUsedAt: null,
        editedAt: null,
        messages: {},
      },
      {
        skillKey: "ad-copy-generator",
        name: "广告文案生成器",
        description: "生成高转化率的广告文案",
        enabled: true,
        source: "builtin",
        messageCount: 0,
        editCount: 0,
        lastUsedAt: null,
        editedAt: null,
        messages: {},
      },
      {
        skillKey: "audience-insights",
        name: "受众分析",
        description: "分析目标受众和行为特征",
        enabled: true,
        source: "builtin",
        messageCount: 0,
        editCount: 0,
        lastUsedAt: null,
        editedAt: null,
        messages: {},
      },
      {
        skillKey: "roi-calculator",
        name: "ROI 分析",
        description: "计算和优化营销投资回报率",
        enabled: true,
        source: "builtin",
        messageCount: 0,
        editCount: 0,
        lastUsedAt: null,
        editedAt: null,
        messages: {},
      },
      {
        skillKey: "ab-test-manager",
        name: "A/B 测试",
        description: "设计和分析 A/B 测试实验",
        enabled: true,
        source: "builtin",
        messageCount: 0,
        editCount: 0,
        lastUsedAt: null,
        editedAt: null,
        messages: {},
      },
    ];
  }
  handleSkillClick(skill, mapping) {
    const { type, prompt, link } = mapping.interaction;
    // 设置选中状态
    this.selectedSkillKey = skill.skillKey;
    switch (type) {
      case "prompt":
        // 将提示词注入到聊天输入框
        this.dispatchEvent(
          new CustomEvent("inject-prompt", {
            detail: {
              prompt: prompt ?? "",
              skillKey: skill.skillKey,
              displayName: mapping.displayName ?? skill.name ?? "未命名技能",
            },
            bubbles: true,
            composed: true,
          }),
        );
        break;
      case "link":
        if (link) {
          window.open(link, "_blank");
        }
        break;
      case "tool":
        // TODO: 实现工具调用
        console.log("Tool invocation:", mapping.interaction.toolParams);
        break;
      case "modal":
        // TODO: 实现模态框
        console.log("Modal:", mapping.interaction.modal);
        break;
    }
  }
  togglePanelCollapse() {
    this.panelCollapsed = !this.panelCollapsed;
  }
  renderSkillCard(skill, mapping) {
    const { visual, interaction } = mapping;
    const { variant, size, icon } = visual;
    const displayName = mapping.displayName ?? skill.name ?? "未命名技能";
    const description = mapping.description ?? skill.description ?? "暂无描述";
    const isSelected = this.selectedSkillKey === skill.skillKey;
    // 生成卡片类名
    const cardClasses = [
      "skill-card",
      `skill-card--${variant}`,
      `skill-card--${size}`,
      isSelected ? "skill-card--selected" : "",
    ]
      .filter(Boolean)
      .join(" ");
    return html`
      <div
        class="${cardClasses}"
        @click=${() => this.handleSkillClick(skill, mapping)}
        role="button"
        tabindex="0"
        @keydown=${(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            this.handleSkillClick(skill, mapping);
          }
        }}
      >
        ${
          size === "large"
            ? html`
              <div class="skill-icon">${this.renderIcon(icon)}</div>
              <div class="skill-title">${displayName}</div>
              <div class="skill-description">${description}</div>
            `
            : html`
              <div class="skill-icon">${this.renderIcon(icon)}</div>
              <div class="skill-content">
                <div class="skill-title">${displayName}</div>
                <div class="skill-description">${description}</div>
              </div>
            `
        }
      </div>
    `;
  }
  renderIcon(iconName) {
    // SVG 图标映射（可扩展）
    const iconMap = {
      megaphone: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l6-6 6 6"/><path d="M13 5l6 6-6 6"/><path d="M5 19l4-4"/></svg>`,
      sparkles: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v18"/><path d="M3 12h18"/><path d="M5.6 5.6l12.8 12.8"/><path d="M18.4 5.6 5.6 18.4"/></svg>`,
      barChart: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-6"/></svg>`,
      target: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
      mail: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></svg>`,
      share: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
      penTool: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13 16.5 5.5 2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>`,
      users: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
      trendingUp: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
      flask: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 2v7.31L6 14v6h12v-6l-4-4.69V2h-4z"/><path d="M8.5 2h7"/></svg>`,
    };
    return iconMap[iconName] ?? html`<span>${iconName}</span>`;
  }
  render() {
    // 获取技能数据：优先使用外部传入的真实数据，否则使用模拟数据
    const realSkills = this.skillsReport?.skills ?? [];
    const skillsToUse =
      this.useMockData || realSkills.length === 0 ? this.getMockSkills() : realSkills;
    // 筛选 Marketing 相关的 Skills
    const marketingSkills = filterMarketingSkills(skillsToUse);
    // 分离 Featured Skills 和普通 Skills
    const featuredSkills = marketingSkills.filter((item) => item.mapping.visual.featured);
    const regularSkills = marketingSkills.filter((item) => !item.mapping.visual.featured);
    // 按分类组织普通 Skills
    const groupedSkills = groupSkillsByCategory(regularSkills);
    const categoryLabels = {
      campaign: "营销活动策划",
      content: "内容生成",
      analyze: "数据分析",
      optimize: "策略优化",
      automation: "自动化工具",
      other: "其他",
    };
    // 显示数据来源提示（仅在开发模式）
    const showMockDataHint = this.useMockData && realSkills.length === 0;
    return html`
      <div class="assistant-container">
        <!-- 功能面板区域 -->
        <div class="function-panel">
          <div class="panel-header">
            <div class="panel-header-text">
              <h1 class="panel-title">营销助手</h1>
              <p class="panel-subtitle">营销活动策划、内容生成和效果分析</p>
            </div>
            <div class="panel-controls panel-controls--text">全部展开</div>
          </div>

          ${
            showMockDataHint
              ? html`
                  <div
                    style="
                      padding: var(--space-sm) var(--space-md);
                      background: rgba(249, 115, 22, 0.1);
                      border: 1px solid rgba(249, 115, 22, 0.3);
                      border-radius: var(--radius-md);
                      margin-bottom: var(--space-md);
                      font-size: 0.875rem;
                      color: rgb(249, 115, 22);
                    "
                  >
                    📝 开发模式：当前显示模拟数据。配置 Marketing Skills 后将自动显示真实数据。
                  </div>
                `
              : ""
          }

          ${
            marketingSkills.length === 0
              ? html`
                  <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <div class="empty-state-text">暂无营销相关技能，请先安装或启用相关技能。</div>
                  </div>
                `
              : html`
                  <!-- 快捷操作 -->
                  ${
                    featuredSkills.length > 0
                      ? html`
                          <div class="quick-actions">
                            ${featuredSkills.map(({ skill, mapping }) => this.renderSkillCard(skill, mapping))}
                          </div>
                        `
                      : ""
                  }

                  <!-- Skills 网格（按分类） -->
                  ${Object.entries(groupedSkills).map(([category, skills]) =>
                    skills.length > 0
                      ? html`
                            <div class="section-title">
                              ${categoryLabels[category] ?? category}
                            </div>
                            <div class="skills-grid">
                              ${skills.map(({ skill, mapping }) => this.renderSkillCard(skill, mapping))}
                            </div>
                          `
                      : "",
                  )}
                `
          }
        </div>

        <!-- 聊天区域 -->
        <div class="chat-area">
          <div class="chat-placeholder">
            <div class="chat-cta">
              <div class="chat-cta__badge">Chat</div>
              <div class="chat-cta__title">开始对话，沿用你选中的技能提示词</div>
              <div class="chat-cta__desc">点击下方进入聊天面板，或直接在右侧输入区继续对话。</div>
              <div class="chat-cta__actions">
                <button class="chat-cta__primary" @click=${() => (window.location.href = "/chat")}>
                  打开聊天面板
                </button>
                <div class="chat-cta__hint">Tips: 在功能区点任意技能会把预设提示词注入输入框。</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};
__decorate([property({ attribute: false })], MarketingView.prototype, "skillsReport", void 0);
__decorate([state()], MarketingView.prototype, "selectedSkillKey", void 0);
__decorate([state()], MarketingView.prototype, "panelCollapsed", void 0);
__decorate([state()], MarketingView.prototype, "allSkills", void 0);
MarketingView = __decorate([customElement("openclaw-view-marketing")], MarketingView);
export { MarketingView };
