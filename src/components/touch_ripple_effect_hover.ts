
export class TouchRippleEffectHoverElement extends HTMLElement {
    connectedCallback() {
        this.style.position = "absolute";
        this.style.top = "0px";
        this.style.left = "0px";
        this.style.width = "100%";
        this.style.height = "100%";
        this.style.backgroundColor = "var(--ripple-hover, rgba(0, 0, 0, 0.1))";
        this.style.opacity = "0";
        this.style.transitionProperty = "opacity";
        this.style.transitionDuration = "var(--ripple-hover-duration, 0.25s)";
        this.style.pointerEvents = "none";
    }
}

customElements.define("touch-ripple-effect-hover", TouchRippleEffectHoverElement);