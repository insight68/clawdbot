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
import { filterRealSkillsByCategory } from "../../config/skill-category-mappings";
/**
 * Customer Service View Component
 *
 * 客户服务页面组件 - 混合模式：功能面板 + 聊天区域
 */
let CustomerServiceView = class CustomerServiceView extends LitElement {
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
  // 获取模拟数据
  getMockSkills() {
    return [
      {
        skillKey: "imsg",
        name: "iMessage客服",
        description: "通过iMessage提供客户支持服务",
        enabled: true,
        source: "builtin",
        messageCount: 0,
        editCount: 0,
        lastUsedAt: null,
        editedAt: null,
        messages: {},
      },
      {
        skillKey: "wacli",
        name: "WhatsApp客服",
        description: "通过WhatsApp提供客户支持服务",
        enabled: true,
        source: "builtin",
        messageCount: 0,
        editCount: 0,
        lastUsedAt: null,
        editedAt: null,
        messages: {},
      },
      {
        skillKey: "bluebubbles",
        name: "BlueBubbles",
        description: "BlueBubbles消息平台集成",
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
      message: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
      phone: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
      chat: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
    };
    return iconMap[iconName] ?? html`<span>${iconName}</span>`;
  }
  render() {
    // 获取技能数据：优先使用 app 的真实数据，否则使用模拟数据
    const realSkills = this.skillsReport?.skills ?? [];
    const skillsToUse =
      this.useMockData || realSkills.length === 0 ? this.getMockSkills() : realSkills;
    // 筛选 Service 相关的 Skills
    const serviceSkills = filterRealSkillsByCategory(skillsToUse, "service");
    // 分离 Featured Skills 和普通 Skills
    const featuredSkills = serviceSkills.filter((item) => item.mapping.visual.featured);
    const regularSkills = serviceSkills.filter((item) => !item.mapping.visual.featured);
    // 按分类组织普通 Skills
    const groupedSkills = {
      messaging: [],
      other: [],
    };
    for (const item of regularSkills) {
      const skillKey = item.skill.skillKey;
      if (
        skillKey.includes("imsg") ||
        skillKey.includes("wacli") ||
        skillKey.includes("bluebubbles")
      ) {
        groupedSkills.messaging.push(item);
      } else {
        groupedSkills.other.push(item);
      }
    }
    const categoryLabels = {
      messaging: "消息平台",
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
              <h1 class="panel-title">客户服务</h1>
              <p class="panel-subtitle">客户支持和问题解决方案</p>
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
                    📝 开发模式：当前显示模拟数据。配置 Service Skills 后将自动显示真实数据。
                  </div>
                `
              : ""
          }

          ${
            serviceSkills.length === 0
              ? html`
                  <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <div class="empty-state-text">暂无客户服务相关技能，请先安装或启用相关技能。</div>
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
__decorate([property({ attribute: false })], CustomerServiceView.prototype, "skillsReport", void 0);
__decorate([state()], CustomerServiceView.prototype, "selectedSkillKey", void 0);
__decorate([state()], CustomerServiceView.prototype, "panelCollapsed", void 0);
__decorate([state()], CustomerServiceView.prototype, "useMockData", void 0);
CustomerServiceView = __decorate(
  [customElement("openclaw-view-customer-service")],
  CustomerServiceView,
);
export { CustomerServiceView };
