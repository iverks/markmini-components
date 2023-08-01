import { LitElement, css, html } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { animate } from '@lit-labs/motion';


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
  private isExpanding = false;

  @state()
  private isClosing = false;

  @state()
  private animation?: Animation = undefined;

  @query("details")
  private el!: HTMLElement;

  @query("summary")
  private summary!: HTMLElement;

  @query(".content")
  private content!: HTMLElement;

  private open() {
    this.el.style.height = `${this.el.offsetHeight}px`;
    this.isOpen = true;
    window.requestAnimationFrame(() => this.expand());
  }

  expand() {
    // Set the element as "being expanding"
    this.isExpanding = true;
    // Get the current fixed height of the element
    const startHeight = `${this.el.offsetHeight}px`;
    // Calculate the open height of the element (summary height + content height)
    const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight}px`;

    // If there is already an animation running
    if (this.animation) {
      // Cancel the current animation
      this.animation.cancel();
    }
    console.log(startHeight, endHeight);

    // Start a WAAPI animation
    this.animation = this.el.animate({
      height: [startHeight, endHeight]
    }, {
      duration: 400,
      easing: 'ease-out'
    });
    // When the animation is complete, call onAnimationFinish()
    this.animation.onfinish = () => this.onAnimationFinish(true);
    // If the animation is cancelled, isExpanding variable is set to false
    this.animation.oncancel = () => this.isExpanding = false;
  }

  private shrink() {
    this.isClosing = true;

    // Store the current height of the element
    const startHeight = this.el.offsetHeight;
    // Calculate the height of the summary
    const endHeight = this.summary.offsetHeight;

    // If there is already an animation running
    if (this.animation) {
      // Cancel the current animation
      this.animation.cancel();
    }

    // Start a WAAPI animation
    this.animation = this.el.animate({
      height: [`${startHeight}px`, `${endHeight}px`],
      // transform: ["translate(0)", `translate(${startHeight - endHeight}px)`]
    }, {
      duration: 400,
      easing: 'ease-out'
    });

    // When the animation is complete, call onAnimationFinish()
    this.animation.onfinish = () => this.onAnimationFinish(false);
    // If the animation is cancelled, isClosing variable is set to false
    this.animation.oncancel = () => this.isClosing = false;
  }

  onAnimationFinish(open: boolean) {
    // Set the open attribute based on the parameter
    this.isOpen = open;
    // Clear the stored animation
    this.animation = undefined;
    // Reset isClosing & isExpanding
    this.isClosing = false;
    this.isExpanding = false;
    // Remove the overflow hidden and the fixed height
    this.el.style.height = this.el.style.overflow = '';
  }


  private onClick(e: Event) {
    e.preventDefault();
    // Add an overflow on the <details> to avoid content overflowing
    this.el.style.overflow = 'hidden';

    if (this.isClosing || !this.isOpen) {
      this.open();
    } else if (this.isExpanding || this.isOpen) {
      this.shrink();
    }
  }

  render() {
    return html`
      <details ?open=${this.isOpen} @click=${this.onClick}>
        <summary class="header">
          <slot name="header">Spoiler</slot><span>▶</span>
        </summary>
        <div class="content ${this.isOpen ? 'shown' : 'hidden'}" ${animate()}>
          <slot></slot>
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
