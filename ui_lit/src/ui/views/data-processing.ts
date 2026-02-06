import { LitElement, html, css, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { SkillStatusEntry, SkillStatusReport } from "../types";
import {
  filterRealSkillsByCategory,
  type SkillWithViewMapping,
  type ViewSkillMapping,
} from "../../config/skill-category-mappings";

/**
 * Data Processing View Component
 *
 * 数据处理页面组件 - 混合模式：功能面板 + 聊天区域
 */
@customElement("openclaw-view-data-processing")
export class DataProcessingView extends LitElement {
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

  @property({ attribute: false })
  skillsReport?: SkillStatusReport | null;

  @state()
  selectedSkillKey: string | null = null;

  @state()
  panelCollapsed = false;

  @state()
  useMockData = false;

  protected createRenderRoot() {
    return this;
  }

  connectedCallback(): void {
    super.connectedCallback();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
  }

  // 获取模拟数据
  private getMockSkills(): SkillStatusEntry[] {
    return [
      {
        skillKey: "analytics-tracking",
        name: "数据分析",
        description: "追踪和分析用户行为数据",
        enabled: true,
        source: "builtin",
        messageCount: 0,
        editCount: 0,
        lastUsedAt: null,
        editedAt: null,
        messages: {},
      },
      {
        skillKey: "seo-audit",
        name: "SEO数据审计",
        description: "审计网站SEO数据和性能",
        enabled: true,
        source: "builtin",
        messageCount: 0,
        editCount: 0,
        lastUsedAt: null,
        editedAt: null,
        messages: {},
      },
      {
        skillKey: "session-logs",
        name: "会话日志分析",
        description: "分析用户会话日志和交互数据",
        enabled: true,
        source: "builtin",
        messageCount: 0,
        editCount: 0,
        lastUsedAt: null,
        editedAt: null,
        messages: {},
      },
      {
        skillKey: "model-usage",
        name: "成本追踪",
        description: "追踪模型使用成本和配额",
        enabled: true,
        source: "builtin",
        messageCount: 0,
        editCount: 0,
        lastUsedAt: null,
        editedAt: null,
        messages: {},
      },
      {
        skillKey: "ultimapper",
        name: "数据可视化",
        description: "创建数据可视化和图表",
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

  private handleSkillClick(skill: SkillStatusEntry, mapping: ViewSkillMapping) {
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

  private togglePanelCollapse() {
    this.panelCollapsed = !this.panelCollapsed;
  }

  private renderSkillCard(skill: SkillStatusEntry, mapping: ViewSkillMapping) {
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
        @keydown=${(e: KeyboardEvent) => {
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

  private renderIcon(iconName: string) {
    // SVG 图标映射（可扩展）
    const iconMap: Record<string, ReturnType<typeof svg>> = {
      chart: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-6"/></svg>`,
      search: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`,
      log: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
      dollar: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
      map: svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>`,
    };

    return iconMap[iconName] ?? html`<span>${iconName}</span>`;
  }

  render() {
    // 获取技能数据：优先使用 app 的真实数据，否则使用模拟数据
    const realSkills = this.skillsReport?.skills ?? [];
    const skillsToUse =
      this.useMockData || realSkills.length === 0 ? this.getMockSkills() : realSkills;

    // 筛选 Data 相关的 Skills
    const dataSkills = filterRealSkillsByCategory(skillsToUse, "data");

    // 分离 Featured Skills 和普通 Skills
    const featuredSkills = dataSkills.filter((item) => item.mapping.visual.featured);
    const regularSkills = dataSkills.filter((item) => !item.mapping.visual.featured);

    // 按分类组织普通 Skills
    const groupedSkills: Record<string, SkillWithViewMapping[]> = {
      analytics: [],
      seo: [],
      logs: [],
      cost: [],
      visualization: [],
      other: [],
    };

    for (const item of regularSkills) {
      const skillKey = item.skill.skillKey;
      if (skillKey.includes("analytics")) {
        groupedSkills.analytics.push(item);
      } else if (skillKey.includes("seo")) {
        groupedSkills.seo.push(item);
      } else if (skillKey.includes("session") || skillKey.includes("log")) {
        groupedSkills.logs.push(item);
      } else if (skillKey.includes("usage") || skillKey.includes("cost")) {
        groupedSkills.cost.push(item);
      } else if (skillKey.includes("mapper") || skillKey.includes("viz")) {
        groupedSkills.visualization.push(item);
      } else {
        groupedSkills.other.push(item);
      }
    }

    const categoryLabels: Record<string, string> = {
      analytics: "数据分析",
      seo: "SEO审计",
      logs: "日志分析",
      cost: "成本追踪",
      visualization: "数据可视化",
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
              <h1 class="panel-title">数据处理</h1>
              <p class="panel-subtitle">数据分析、清洗和可视化工具</p>
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
                    📝 开发模式：当前显示模拟数据。配置 Data Skills 后将自动显示真实数据。
                  </div>
                `
              : ""
          }

          ${
            dataSkills.length === 0
              ? html`
                  <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <div class="empty-state-text">暂无数据处理相关技能，请先安装或启用相关技能。</div>
                  </div>
                `
              : html`
                  <!-- 快捷操作 -->
                  ${
                    featuredSkills.length > 0
                      ? html`
                          <div class="quick-actions">
                            ${featuredSkills.map(({ skill, mapping }) =>
                              this.renderSkillCard(skill, mapping),
                            )}
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
                              ${skills.map(({ skill, mapping }) =>
                                this.renderSkillCard(skill, mapping),
                              )}
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
}

declare global {
  interface HTMLElementTagNameMap {
    "openclaw-view-data-processing": DataProcessingView;
  }
}
