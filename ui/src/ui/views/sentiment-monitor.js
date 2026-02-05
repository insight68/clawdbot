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
import { filterSkillsByMultipleCategories } from "../../config/skill-category-mappings";
/**
 * Sentiment Monitor View Component
 *
 * 舆情监控页面组件 - 混合模式：功能面板 + 聊天区域
 * 展示同时属于 Communication 和 Brand 类别的技能
 */
let SentimentMonitorView = class SentimentMonitorView extends LitElement {
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
  useMockData = false;
  createRenderRoot() {
    return this;
  }
  connectedCallback() {
    super.connectedCallback();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
  }
  // 获取模拟数据（同时属于 communication 和 brand 的技能）
  getMockSkills() {
    return [
      {
        skillKey: "social-content",
        name: "社交媒体内容监控",
        description: "监控社交媒体平台上的品牌提及和用户反馈",
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
      search: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`,
      trend: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
      shield: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    };
    return iconMap[iconName] ?? html`<span>${iconName}</span>`;
  }
  render() {
    // 获取技能数据：优先使用 app 的真实数据，否则使用模拟数据
    const realSkills = this.skillsReport?.skills ?? [];
    const skillsToUse =
      this.useMockData || realSkills.length === 0 ? this.getMockSkills() : realSkills;
    // 筛选同时属于 Communication 和 Brand 的 Skills（交集）
    const sentimentSkills = filterSkillsByMultipleCategories(skillsToUse, [
      "communication",
      "brand",
    ]);
    // 分离 Featured Skills 和普通 Skills
    const featuredSkills = sentimentSkills.filter((item) => item.mapping.visual.featured);
    const regularSkills = sentimentSkills.filter((item) => !item.mapping.visual.featured);
    // 按分类组织普通 Skills
    const groupedSkills = {
      monitoring: [],
      analysis: [],
      other: [],
    };
    for (const item of regularSkills) {
      const skillKey = item.skill.skillKey;
      if (skillKey.includes("social") || skillKey.includes("monitor")) {
        groupedSkills.monitoring.push(item);
      } else if (skillKey.includes("sentiment") || skillKey.includes("analysis")) {
        groupedSkills.analysis.push(item);
      } else {
        groupedSkills.other.push(item);
      }
    }
    const categoryLabels = {
      monitoring: "社交媒体监控",
      analysis: "情感分析",
      other: "其他",
    };
    // 显示数据来源提示（仅在开发模式）
    const showMockDataHint = this.useMockData && realSkills.length === 0;
    return html`
      <div class="assistant-container">
        <!-- 功能面板区域 -->
        <div class="function-panel ${this.panelCollapsed ? "function-panel--collapsed" : ""}">
          <div class="panel-header">
            <div class="panel-header-text">
              <h1 class="panel-title">舆情监控</h1>
              <p class="panel-subtitle">舆情监测和声誉管理（通讯+品牌）</p>
            </div>
            <div class="panel-controls">
              <button
                class="panel-control-button"
                @click=${this.togglePanelCollapse}
                title="${this.panelCollapsed ? "展开面板" : "折叠面板"}"
              >
                ${
                  this.panelCollapsed
                    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>`
                    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>`
                }
              </button>
            </div>
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
                    📝 开发模式：当前显示模拟数据。配置相关 Skills 后将自动显示真实数据。
                  </div>
                `
              : ""
          }

          ${
            sentimentSkills.length === 0
              ? html`
                  <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <div class="empty-state-text">暂无舆情监控相关技能。</div>
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
            <div>
              <div style="margin-bottom: var(--space-sm); color: var(--text-strong); font-weight: 600;">
                聊天区：已选技能会把提示词注入聊天输入框
              </div>
              <button
                class="panel-control-button"
                style="padding: 0 var(--space-md); height: 40px; border-radius: var(--radius-lg); font-weight: 600;"
                @click=${() => (window.location.href = "/chat")}
              >
                打开聊天面板
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};
__decorate(
  [property({ attribute: false })],
  SentimentMonitorView.prototype,
  "skillsReport",
  void 0,
);
__decorate([state()], SentimentMonitorView.prototype, "selectedSkillKey", void 0);
__decorate([state()], SentimentMonitorView.prototype, "panelCollapsed", void 0);
__decorate([state()], SentimentMonitorView.prototype, "useMockData", void 0);
SentimentMonitorView = __decorate(
  [customElement("openclaw-view-sentiment-monitor")],
  SentimentMonitorView,
);
export { SentimentMonitorView };
