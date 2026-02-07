import { LitElement, html, css, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { TemplateResult } from "lit";
import type { SkillStatusEntry, SkillStatusReport } from "../types";
import {
  filterSkillsByCategory,
  type SkillCategoryMapping,
  type SkillWithViewMapping,
  type ViewSkillMapping,
} from "../../config/skill-category-mappings";
import type { ChatProps } from "./chat";

type MarketingPrimaryCategory =
  | "strategy"
  | "content"
  | "social"
  | "email"
  | "seo"
  | "paid"
  | "cro"
  | "analytics"
  | "research";

type MarketingCategoryId = MarketingPrimaryCategory | "other";

interface MarketingCategoryRule {
  id: MarketingPrimaryCategory;
  label: string;
  keywords: string[];
}

const MARKETING_CATEGORY_RULES: MarketingCategoryRule[] = [
  {
    id: "strategy",
    label: "营销策略",
    keywords: ["strategy", "launch", "pricing", "referral", "free-tool", "idea", "psychology"],
  },
  {
    id: "content",
    label: "内容创作",
    keywords: ["content", "copy", "writing", "editing"],
  },
  {
    id: "social",
    label: "社交媒体",
    keywords: ["social", "instagram", "linkedin", "tiktok"],
  },
  {
    id: "email",
    label: "邮件营销",
    keywords: ["email"],
  },
  {
    id: "seo",
    label: "SEO优化",
    keywords: ["seo", "schema", "keyword"],
  },
  {
    id: "paid",
    label: "付费广告",
    keywords: ["paid", "ads"],
  },
  {
    id: "cro",
    label: "转化优化",
    keywords: ["cro", "form", "page", "popup", "onboarding", "signup", "paywall"],
  },
  {
    id: "analytics",
    label: "数据分析",
    keywords: ["analytics", "tracking", "metric"],
  },
  {
    id: "research",
    label: "用户研究",
    keywords: ["research", "ab-test", "survey"],
  },
];

const MARKETING_CATEGORY_ORDER: MarketingCategoryId[] = [
  ...MARKETING_CATEGORY_RULES.map((rule) => rule.id),
  "other",
];

const FEATURED_MARKETING_SKILL_KEYS = new Set<string>([
  "launch-strategy",
  "copywriting",
  "analytics-tracking",
  "paid-ads",
]);

const MARKETING_CATEGORY_LABELS: Record<MarketingCategoryId, string> = MARKETING_CATEGORY_RULES.reduce(
  (acc, rule) => {
    acc[rule.id] = rule.label;
    return acc;
  },
  { other: "其他" } as Record<MarketingCategoryId, string>,
);

const MARKETING_SVG_ICONS: Record<string, ReturnType<typeof svg>> = {
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

const resolveMarketingCategory = (skillKey: string): MarketingCategoryId => {
  const normalized = skillKey.toLowerCase();
  for (const rule of MARKETING_CATEGORY_RULES) {
    if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
      return rule.id;
    }
  }
  return "other";
};

const createEmptyRequirementBuckets = () => ({
  bins: [],
  env: [],
  config: [],
  os: [],
});

const createPlaceholderSkillEntry = (definition: SkillCategoryMapping): SkillStatusEntry => {
  const displayName = definition.displayName ?? definition.skillName;
  return {
    name: displayName,
    description: `营销助手已为你预置「${displayName}」提示词`,
    source: "definition",
    filePath: "",
    baseDir: "",
    skillKey: definition.skillName,
    always: false,
    disabled: true,
    blockedByAllowlist: false,
    eligible: false,
    requirements: createEmptyRequirementBuckets(),
    missing: createEmptyRequirementBuckets(),
    configChecks: [],
    install: [],
  };
};

const buildMarketingSkillEntries = (skills: SkillStatusEntry[]): SkillWithViewMapping[] => {
  const definitions = filterSkillsByCategory("marketing");
  const skillMap = new Map(skills.map((skill) => [skill.skillKey, skill]));
  const entries: SkillWithViewMapping[] = [];

  definitions.forEach((definition, index) => {
    const matchedSkill = skillMap.get(definition.skillName);
    const isVirtual = !matchedSkill;
    const isFeatured = FEATURED_MARKETING_SKILL_KEYS.has(definition.skillName);
    const skill = matchedSkill ?? createPlaceholderSkillEntry(definition);

    entries.push({
      skill,
      mapping: {
        skillKeyPattern: definition.skillName,
        displayName: definition.displayName ?? skill.name,
        description: matchedSkill?.description ?? skill.description ?? "暂无描述",
        category: definition.category,
        visual: {
          variant: isFeatured ? "primary" : isVirtual ? "subtle" : "secondary",
          icon: definition.icon || "📦",
          size: isFeatured ? "large" : "medium",
          featured: isFeatured,
        },
        interaction: {
          type: "prompt",
          prompt: `/${definition.skillName}`,
        },
        priority: definitions.length - index,
      },
    });
  });

  return entries;
};

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

  @property({ attribute: false })
  chatProps?: ChatProps | null;

  @property({ attribute: false })
  renderChat?: (props: ChatProps) => TemplateResult;

  @state()
  selectedSkillKey: string | null = null;

  protected createRenderRoot() {
    return this;  // 禁用 Shadow DOM，使用全局样式
  }

  connectedCallback(): void {
    super.connectedCallback();
    // 不再需要 loadSkills，因为直接从 app.skillsReport 获取
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
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

  private renderSkillCard(skill: SkillStatusEntry, mapping: ViewSkillMapping) {
    const { visual } = mapping;
    const { variant, size, icon } = visual;
    const displayName = mapping.displayName ?? skill.name ?? "未命名技能";
    const description = mapping.description ?? skill.description ?? "暂无描述";
    const isSelected = this.selectedSkillKey === skill.skillKey;

    // 生成卡片类名
    const cardClasses = [
      "skill-card",
      "marketing-skill-card",
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
    return MARKETING_SVG_ICONS[iconName] ?? html`<span>${iconName}</span>`;
  }

  private renderChatDock(selectedSkillTitle: string, selectedSkillDesc: string) {
    if (!this.chatProps || !this.renderChat) {
      return html``;
    }

    const skillCommand = this.selectedSkillKey ? `/${this.selectedSkillKey}` : null;

    return html`
      <div class="marketing-chat-dock">
        ${skillCommand ? html`
          <div class="marketing-chat-dock__header">
            <span class="marketing-chat-dock__skill-tag">${skillCommand}</span>
            <span class="marketing-chat-dock__hint">${selectedSkillDesc}</span>
          </div>
        ` : ''}
        <div class="marketing-chat-dock__content">
          ${this.renderChat(this.chatProps)}
        </div>
      </div>
    `;
  }

  render() {
    const realSkills = this.skillsReport?.skills ?? [];
    const marketingSkills = buildMarketingSkillEntries(realSkills);
    const featuredSkills = marketingSkills.filter((item) => item.mapping.visual.featured);
    const regularSkills = marketingSkills.filter((item) => !item.mapping.visual.featured);

    const groupedSkills = new Map<MarketingCategoryId, SkillWithViewMapping[]>();
    for (const categoryId of MARKETING_CATEGORY_ORDER) {
      groupedSkills.set(categoryId, []);
    }

    for (const item of regularSkills) {
      const categoryId = resolveMarketingCategory(item.skill.skillKey);
      groupedSkills.get(categoryId)?.push(item);
    }

    const hasMarketingSkills = marketingSkills.length > 0;
    const selectedSkillEntry = this.selectedSkillKey
      ? marketingSkills.find((item) => item.skill.skillKey === this.selectedSkillKey)
      : null;
    const selectedSkillTitle = selectedSkillEntry
      ? selectedSkillEntry.mapping.displayName ?? selectedSkillEntry.skill.name ?? this.selectedSkillKey
      : "尚未选择技能";
    const selectedSkillDesc = selectedSkillEntry?.mapping.description ?? "点击上方任意技能，将提示词注入营销聊天";

    return html`
      <div class="assistant-container marketing-assistant">
        <div class="function-panel marketing-function-panel">
          <div class="panel-header">
            <div class="panel-header-text">
              <h1 class="panel-title">营销助手</h1>
              <p class="panel-subtitle">营销活动策划、内容生成和效果分析</p>
            </div>
          </div>

          ${hasMarketingSkills
            ? html`
                ${
                  featuredSkills.length > 0
                    ? html`
                        <div class="section-title">快捷操作</div>
                        <div class="quick-actions">
                          ${featuredSkills.map(({ skill, mapping }) =>
                            this.renderSkillCard(skill, mapping),
                          )}
                        </div>
                      `
                    : ""
                }

                ${MARKETING_CATEGORY_ORDER.map((categoryId) => {
                  const skills = groupedSkills.get(categoryId) ?? [];
                  return skills.length === 0
                    ? ""
                    : html`
                        <div class="section-title">
                          ${MARKETING_CATEGORY_LABELS[categoryId]}
                        </div>
                        <div class="skills-grid">
                          ${skills.map(({ skill, mapping }) =>
                            this.renderSkillCard(skill, mapping),
                          )}
                        </div>
                      `;
                })}
              `
            : html`
                <div class="empty-state">
                  <div class="empty-state-icon">📭</div>
                  <div class="empty-state-text">暂无营销相关技能，请先安装或启用相关技能。</div>
                </div>
              `}
        </div>

        ${this.renderChatDock(selectedSkillTitle, selectedSkillDesc)}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "openclaw-view-marketing": MarketingView;
  }
}
