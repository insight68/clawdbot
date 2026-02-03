import { consume } from "@lit/context";
import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import type { SkillStatusEntry } from "../types";
import {
  filterMarketingSkills,
  groupSkillsByCategory,
  type SkillMappingEntry,
} from "../../config/skill-mappings";
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

  @consume({ context: appContext, subscribe: true })
  @state()
  app?: any;

  @state()
  selectedSkillKey: string | null = null;

  @state()
  panelCollapsed = false;

  @state()
  allSkills: SkillStatusEntry[] = [];

  @state()
  loading = true;

  @state()
  error: string | null = null;

  protected createRenderRoot() {
    return this;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.loadSkills();
  }

  private async loadSkills() {
    try {
      this.loading = true;
      // 从后端获取所有 Skills
      const report = await this.app?.skillsController?.getReport();
      this.allSkills = report?.skills ?? [];
      this.error = null;
    } catch (err) {
      console.error("Failed to load skills:", err);
      this.error = "加载技能失败，请稍后重试。";
    } finally {
      this.loading = false;
    }
  }

  private handleSkillClick(skill: SkillStatusEntry, mapping: SkillMappingEntry) {
    const { type, prompt, link } = mapping.interaction;

    // 设置选中状态
    this.selectedSkillKey = skill.skillKey;

    switch (type) {
      case "prompt":
        // 将提示词注入到聊天输入框
        this.dispatchEvent(
          new CustomEvent("inject-prompt", {
            detail: {
              prompt,
              skillKey: skill.skillKey,
              displayName: mapping.displayName ?? skill.name,
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

  private renderSkillCard(skill: SkillStatusEntry, mapping: SkillMappingEntry) {
    const { visual, interaction } = mapping;
    const { variant, size, icon } = visual;
    const displayName = mapping.displayName ?? skill.name;
    const description = mapping.description ?? skill.description;
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
    const iconMap: Record<string, string> = {
      megaphone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l6-6 6 6M13 5l6 6-6 6M5 19l4-4"/></svg>`,
      sparkles: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4"/></svg>`,
      barChart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20V10M18 20V4M6 20v-6"/></svg>`,
      target: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
      mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
      share: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
      penTool: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>`,
      users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
      trendingUp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
      flask: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 2v7.31L6 14v6h12v-6l-4-4.69V2h-4z"/><path d="M8.5 2h7"/></svg>`,
    };

    return iconMap[iconName] ?? `<span>${iconName}</span>`;
  }

  render() {
    // 筛选 Marketing 相关的 Skills
    const marketingSkills = filterMarketingSkills(this.allSkills);

    // 分离 Featured Skills 和普通 Skills
    const featuredSkills = marketingSkills.filter((item) => item.mapping.visual.featured);
    const regularSkills = marketingSkills.filter((item) => !item.mapping.visual.featured);

    // 按分类组织普通 Skills
    const groupedSkills = groupSkillsByCategory(regularSkills);

    const categoryLabels: Record<string, string> = {
      campaign: "营销活动策划",
      content: "内容生成",
      analyze: "数据分析",
      optimize: "策略优化",
      automation: "自动化工具",
      other: "其他",
    };

    return html`
      <div class="assistant-container">
        <!-- 功能面板区域 -->
        <div class="function-panel ${this.panelCollapsed ? "function-panel--collapsed" : ""}">
          <div class="panel-header">
            <div class="panel-header-text">
              <h1 class="panel-title">营销助手</h1>
              <p class="panel-subtitle">营销活动策划、内容生成和效果分析</p>
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
            this.loading
              ? html`
                  <div class="empty-state">
                    <div class="empty-state-icon">⏳</div>
                    <div class="empty-state-text">正在加载技能...</div>
                  </div>
                `
              : this.error
                ? html`
                    <div class="empty-state">
                      <div class="empty-state-icon">⚠️</div>
                      <div class="empty-state-text">${this.error}</div>
                    </div>
                  `
                : marketingSkills.length === 0
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
