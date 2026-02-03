import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("openclaw-view-market-analysis")
export class MarketAnalysisView extends LitElement {
  static styles = css`
    :host {
      display: block;
      height: 100%;
    }
    .assistant-container {
      padding: var(--space-3xl) var(--space-2xl);
      max-width: 1400px;
      margin: 0 auto;
    }
    .panel-title {
      font-family: var(--font-display);
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-strong);
      margin: 0 0 var(--space-sm) 0;
    }
    .panel-subtitle {
      font-family: var(--font-body);
      font-size: 1rem;
      color: var(--muted);
      margin: 0 0 var(--space-xl) 0;
    }
  `;

  protected createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <div class="assistant-container">
        <h1 class="panel-title">市场分析</h1>
        <p class="panel-subtitle">市场趋势分析和竞争情报</p>
        <p>功能开发中...</p>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "openclaw-view-market-analysis": MarketAnalysisView;
  }
}
