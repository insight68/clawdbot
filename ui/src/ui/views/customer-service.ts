import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("openclaw-view-customer-service")
export class CustomerServiceView extends LitElement {
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
        <h1 class="panel-title">客户服务</h1>
        <p class="panel-subtitle">客户支持和问题解决方案</p>
        <p>功能开发中...</p>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "openclaw-view-customer-service": CustomerServiceView;
  }
}
