import { consume } from "@lit/context";
import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { appContext } from "../app";

export interface TodoItem {
  id: string;
  text: string;
  done: boolean;
  category: "approval" | "config" | "review" | "deploy";
}

export interface SkillUsage {
  id: string;
  name: string;
  icon: string;
  time: string;
  category: string;
}

export interface ProjectStatus {
  activeTasks: number;
  completedTasks: number;
  progress: number;
}

/**
 * Home View Component
 *
 * 首页组件 - 展示欢迎语、项目进度、待办事项和最近使用的技能
 */
@customElement("openclaw-view-home")
export class HomeView extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `;

  @consume({ context: appContext, subscribe: true })
  @state()
  app?: any;

  @state()
  projectStatus: ProjectStatus = {
    activeTasks: 0,
    completedTasks: 0,
    progress: 0,
  };

  @state()
  todos: TodoItem[] = [];

  @state()
  recentSkills: SkillUsage[] = [];

  @state()
  loading = true;

  protected createRenderRoot() {
    return this;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.fetchHomeData();
  }

  private async fetchHomeData() {
    this.loading = true;

    try {
      // TODO: 从 Gateway API 获取真实数据
      // 目前使用模拟数据
      this.projectStatus = {
        activeTasks: 3,
        completedTasks: 12,
        progress: 85,
      };

      this.todos = [
        {
          id: "1",
          text: "Review pending approvals",
          done: false,
          category: "approval",
        },
        {
          id: "2",
          text: "Update channel configurations",
          done: false,
          category: "config",
        },
        {
          id: "3",
          text: "Check agent session logs",
          done: false,
          category: "review",
        },
        {
          id: "4",
          text: "Deploy gateway update",
          done: true,
          category: "deploy",
        },
      ];

      this.recentSkills = [
        {
          id: "1",
          name: "Data Analysis",
          icon: "📊",
          time: "2 min ago",
          category: "analysis",
        },
        {
          id: "2",
          name: "Email Campaign",
          icon: "📧",
          time: "15 min ago",
          category: "marketing",
        },
        {
          id: "3",
          name: "Image Generate",
          icon: "🎨",
          time: "1 hour ago",
          category: "creative",
        },
        {
          id: "4",
          name: "Document Write",
          icon: "📝",
          time: "3 hours ago",
          category: "writing",
        },
      ];
    } catch (error) {
      console.error("Failed to fetch home data:", error);
    } finally {
      this.loading = false;
    }
  }

  private toggleTodo(todoId: string) {
    this.todos = this.todos.map((todo) =>
      todo.id === todoId ? { ...todo, done: !todo.done } : todo,
    );
  }

  private getCategoryIcon(category: TodoItem["category"]): string {
    switch (category) {
      case "approval":
        return "✅";
      case "config":
        return "⚙️";
      case "review":
        return "🔍";
      case "deploy":
        return "🚀";
      default:
        return "📌";
    }
  }

  private navigateToSkill(skill: SkillUsage) {
    // 根据 skill 类别导航到对应的 AI 助手页面
    const categoryToTab: Record<string, string> = {
      marketing: "/marketing",
      analysis: "/market-analysis",
      creative: "/brand-management",
      writing: "/marketing",
    };

    const tab = categoryToTab[skill.category];
    if (tab) {
      window.location.href = tab;
    }
  }

  render() {
    if (this.loading) {
      return html`
        <div class="home-loading">Loading...</div>
      `;
    }

    return html`
      <div class="home-container">
        <!-- 欢迎区域 -->
        <section class="welcome-section">
          <h1 class="welcome-title">Welcome back</h1>
          <p class="welcome-subtitle">Your OpenClaw workspace is ready</p>
        </section>

        <!-- 项目进度卡片 -->
        <section class="progress-section">
          <div class="stat-card stagger-1">
            <div class="stat-icon">📋</div>
            <div class="stat-value">${this.projectStatus.activeTasks}</div>
            <div class="stat-label">Active Tasks</div>
          </div>
          <div class="stat-card stagger-2">
            <div class="stat-icon">✅</div>
            <div class="stat-value">${this.projectStatus.completedTasks}</div>
            <div class="stat-label">Completed</div>
          </div>
          <div class="stat-card stagger-3">
            <div class="stat-icon">📈</div>
            <div class="stat-value">${this.projectStatus.progress}%</div>
            <div class="stat-label">Progress</div>
          </div>
        </section>

        <!-- 待办事项 -->
        <section class="todos-section stagger-4">
          <div class="section-header">
            <h2>Todo</h2>
            <span class="section-badge">${this.todos.filter((t) => !t.done).length} pending</span>
          </div>
          <ul class="todo-list">
            ${this.todos.map(
              (todo) => html`
                <li class="todo-item ${todo.done ? "done" : ""}">
                  <input
                    type="checkbox"
                    .checked=${todo.done}
                    @change=${() => this.toggleTodo(todo.id)}
                    aria-label="Mark ${todo.text} as ${todo.done ? "incomplete" : "complete"}"
                  />
                  <span class="todo-category">${this.getCategoryIcon(todo.category)}</span>
                  <span class="todo-text">${todo.text}</span>
                  ${
                    todo.done
                      ? html`
                          <span class="todo-status">✓</span>
                        `
                      : html`
                          <span class="todo-status"></span>
                        `
                  }
                </li>
              `,
            )}
          </ul>
        </section>

        <!-- 最近使用的技能 -->
        <section class="skills-section stagger-5">
          <div class="section-header">
            <h2>Recent Skills</h2>
            <a href="/skills" class="section-link">View all →</a>
          </div>
          <div class="skills-grid">
            ${this.recentSkills.map(
              (skill) => html`
                <div
                  class="skill-card"
                  @click=${() => this.navigateToSkill(skill)}
                  role="button"
                  tabindex="0"
                  aria-label="Open ${skill.name}"
                >
                  <div class="skill-icon">${skill.icon}</div>
                  <div class="skill-info">
                    <div class="skill-name">${skill.name}</div>
                    <div class="skill-time">${skill.time}</div>
                  </div>
                  <div class="skill-arrow">→</div>
                </div>
              `,
            )}
          </div>
        </section>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "openclaw-view-home": HomeView;
  }
}
