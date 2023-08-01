import { LitElement, css, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('t-spoiler')
export class TSpoiler extends LitElement {
  @property({ type: Boolean })
  public isOpen = true;

  @state()
  private animation?: Animation = undefined;

  // State variables necessary for handling animation canceling
  @state()
  private isShrinking = false;
  @state()
  private isExpanding = false;

  @query("#content")
  private content!: HTMLElement;

  private onClick(e: Event) {
    e.preventDefault();

    if (this.isExpanding || this.isOpen) {
      this.shrink();
    } else if (this.isShrinking || !this.isOpen) {
      this.expand();
    }
  }

  private expand() {
    if (this.animation) {
      this.animation.cancel();
    }

    this.isExpanding = true;
    const endHeight = this.content.offsetHeight;
    this.isOpen = true; // Note: changes visibility
    this.animation = this.content.animate({
      height: ["0px", `${endHeight}px`]
    },
      100);
    this.animation.oncancel = () => {
      this.isExpanding = false;
    };
  }

  private shrink() {
    if (this.animation) {
      this.animation.cancel();
    }

    this.isShrinking = true;
    const startHeight = this.content.offsetHeight;
    this.animation = this.content.animate({
      height: [`${startHeight}px`, "0px"]
    },
      100);
    this.animation.onfinish = () => {
      this.isOpen = false;
      this.isShrinking = false;
    };
    this.animation.oncancel = () => {
      this.isShrinking = false;
    };
  }

  render() {
    return html`
      <details ?open=${this.isOpen} @click=${this.onClick}>
        <summary class="header">
          <slot name="header">Spoiler</slot><span>▶</span>
        </summary>
        <div class="content" id="content">
          <slot>Default text</slot>
        </div>
      </details>
    `;
  }

  static styles = css`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      text-align: left;
    }

    .header {
      border: 1px solid gray;
      background-color: firebrick;

    }

    .content {
      border: 1px solid gray;
      position: relative;
      overflow: hidden;
    }

    details > summary {
      list-style: none;
    }

    details > summary::-webkit-details-marker {
      display: none;
    }
    `;
}

declare global {
  interface HTMLElementTagNameMap {
    't-spoiler': TSpoiler;
  }
}
