import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('t-quote')
export class TQuote extends LitElement {
  @property({ type: String })
  public name = "ukjent";

  render() {
    return html`
      <div>
        <div class="header">
          <span><slot name="header">${this.name}</slot> skrev:</span>
        </div>
        <div class="t-quote-content" id="content">
          <slot>Default text</slot>
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      max-width: 1280px;
      margin: 1rem 0;
      text-align: left;
      box-shadow: 0 0 2px black;
    }

    .header {
      padding-inline: 1rem;
      padding-block: 0.4rem;
      background-color: var(--t-quote-header-bg,  rgb(80, 80, 80));
      min-height: 1rem;
    }

    .t-quote-content {
      position: relative;
      overflow: hidden;
      background-color: var(--t-quote-header-bg, rgb(60, 60, 60));
      padding-inline: 1rem;
      padding-block: 0.1rem;
      min-height: 2rem;
    }
    `;
}

declare global {
  interface HTMLElementTagNameMap {
    't-quote': TQuote;
  }
}
