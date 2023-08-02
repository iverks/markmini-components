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
  public open = false;

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

    if (this.isExpanding || this.open) {
      this.shrink();
    } else if (this.isShrinking || !this.open) {
      this.expand();
    }
  }

  private expand() {
    if (this.animation) {
      this.animation.cancel();
    }

    this.isExpanding = true;
    const endHeight = this.content.offsetHeight;
    this.open = true; // Note: changes visibility
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
      this.open = false;
      this.isShrinking = false;
    };
    this.animation.oncancel = () => {
      this.isShrinking = false;
    };
  }

  render() {
    return html`
      <details ?open=${this.open}>
        <summary class="header" @click=${this.onClick}>
          <slot name="header"><span>Spoiler</span></slot> <div id="triangle" class="triangle ${this.open && "rotated"}">▶</div>
        </summary>
        <div class="t-spoiler-content" id="content">
          <slot>Default text</slot>
        </div>
      </details>
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
      background-color: var(--t-spoiler-header-bg,  rgb(80, 80, 80));
      min-height: 1rem;
    }

    .triangle {
      display: inline-block;
      transition: transform 100ms;
    }

    .triangle.rotated {
      transform: rotate(90deg);
    }

    .t-spoiler-content {
      position: relative;
      overflow: hidden;
      background-color: var(--t-spoiler-header-bg, rgb(60, 60, 60));
      padding-inline: 1rem;
      padding-block: 0.1rem;
      min-height: 2rem;
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
