import { DOMRectUtil, ElementUtil } from "@web-package/utility";
import { Point } from "../point";
import { PointerPosition, TouchRippleEffectStatusListener } from "../type";
import { TouchRippleElement } from "./touch_ripple";

/** Signature for the enumeration that defines status values about `TouchRippleEffectElement`. */
export enum TouchRippleEffectStatus {
    NONE,
    ACCEPTED,
    REJECTED,
    DISPOSED
}

/**
 * Signature for the interface that defines custom property animation-related
 * identifiers about `TouchRippleEffectElement`.
 */
export interface TouchRippleEffectOption {
    spreadDuration: string;
    spreadCurve: string;
    fadeInDuration: string;
    fadeInCurve: string;
    fadeOutDuration: string;
    fadeOutCurve: string;
}

export class TouchRippleEffectElement extends HTMLElement {
    private _status: TouchRippleEffectStatus;
    private _statusListeners: TouchRippleEffectStatusListener[] = [];

    /**
     * This value is used to exclude layout calculations when the observer is initially
     * triggered as it starts observing an element that is target.
    */
    private _markNeedsLayout: boolean = false;

    /**
     * The observer is defined to be called when the size of the element where a ripple effect
     * is applied changes, rather than a ripple effect itself.
     */
    private _resizeObserver: ResizeObserver;

    constructor(
        public position: PointerPosition,
        public callback: Function,
        public isRejectable: boolean,
        /**
         * Whether to postpone the invocation of the related event callback function until
         * the end of the ripple effect fade-in animation.
         */
        public isWait: boolean,
        public option: TouchRippleEffectOption,
        public parent: TouchRippleElement,
        public target: HTMLElement
    ) {
        super();
        this.target ??= this.parent.firstElementChild as HTMLElement;
    }

    get status() { return this._status };

    set status(newValue: TouchRippleEffectStatus) {
        if (this._status != newValue) {
            this._status = newValue;
            this._statusListeners.forEach(l => l(newValue));
        }
    }

    set statusListener(callback: TouchRippleEffectStatusListener) {
        this._statusListeners.push(callback);
    }

    notify() {
        if (this.callback) this.callback();
    }

    fadeout(parent: HTMLElement = this.parent) {
        if (parent == null) return;
        this.style.transitionProperty = "opacity"
        this.style.transitionDuration = this.option.fadeOutDuration;
        this.style.transitionTimingFunction = this.option.fadeOutCurve;
        this.style.opacity = "0";
        requestAnimationFrame(() => {
            this.ontransitionend = () => this.dispose();
        });
    }

    cancel(parent: HTMLElement = this.parent) {
        if (parent == null) return;
        this.style.transitionProperty = "opacity"
        this.style.transitionDuration = "var(--ripple-cancel-duration, 0s)";
        this.style.transitionTimingFunction = "var(--ripple-cancel-curve)";
        this.style.opacity = "0";
        requestAnimationFrame(() => {
            this.ontransitionend = () => this.dispose();
        });
    }

    /** Sets style properties for the ripple position and intrinsic size settings. */
    performLayout() {
        const target = this.target;
        const parent = this.parent;
        const targetStyle = getComputedStyle(target);
        const targetRect = DOMRectUtil.intrinsicOf(target, targetStyle);
        const targetSize = {
            width: targetRect.width,
            height: targetRect.height
        };
        const targetShiftLeft = parseFloat(targetStyle.marginLeft);
        const targetShiftTop = parseFloat(targetStyle.marginTop);
        const targetMax = Math.max(targetSize.width, targetSize.height);
        const targetX = (this.position.x - targetRect.left) - targetShiftLeft;
        const targetY = (this.position.y - targetRect.top) - targetShiftTop;
        const centerX = targetSize.width / 2;
        const centerY = targetSize.height / 2;

        const getBlurRadius = function() {
            const blurRadius = parent.getPropertyByName("--ripple-blur-radius") || "5%";
            if (blurRadius.endsWith("%")) {
                const minBlurRadius = Number.parseFloat(parent.getPropertyByName("--ripple-min-blur-radius") || "0px");
                const maxBlurRadius = Number.parseFloat(parent.getPropertyByName("--ripple-max-blur-radius") || "30px");
                const percent = Number(blurRadius.replace("%", "")) / 100;
                const pixcels = targetMax * percent;

                if (pixcels > maxBlurRadius) return maxBlurRadius;
                if (pixcels < minBlurRadius) return minBlurRadius;

                return pixcels;
            }

            return Number.parseFloat(blurRadius);
        }

        const getRippleSize = function(blurRadius: number) {
            let rippleSize  = new Point(centerX, centerY).distance(0, 0) * 2;
                rippleSize += new Point(centerX, centerY).distance(targetX, targetY) * 2;
                rippleSize += blurRadius * 2;

            return rippleSize;
        }

        const blurRedius = getBlurRadius();
        const rippleSize = getRippleSize(blurRedius);

        this.style.position = "absolute";
        this.style.left = `${targetX}px`;
        this.style.top = `${targetY}px`;
        this.style.width = `${rippleSize}px`;
        this.style.height = `${rippleSize}px`;
        this.style.pointerEvents = "none";
        this.style.translate = "-50% -50%";
        this.style.borderRadius = "50%";
        this.style.backgroundColor = "var(--ripple, rgba(0, 0, 0, 0.2))";
        this.style.willChange = "transform";
        this.style.filter = `blur(${blurRedius}px)`;
    }

    disconnectedCallback() {
        this._resizeObserver.disconnect();
        this._resizeObserver = null;
    }

    connectedCallback() {
        const target = this.target;
        let transitionStartCount = 0;
        let transitionEndCount = 0;
        const performFadeout = () => {
            // In this case, transition is independently defined to 'opacity', 'transform'
            // and has a separate life-cycle.
            if (++transitionEndCount == transitionStartCount) {
                this.fadeout(target);

                // When the effect must be invoked after completion for spread animation,
                // the callback function should be invoked separately during the fadeout stage.
                if (this.isWait) {
                    this.notify();
                }

                // Clean up a registered event callback to prevent a redemption called.
                this.ontransitionend = null;
            }
        }

        // Performs layout calculation based on a target element size.
        this.performLayout();

        // See also, size changes of the target element should be observed starting in
        // the next frame after the initial layout by calling `requestAnimationFrame`.
        requestAnimationFrame(() => {
            this._resizeObserver = new ResizeObserver(entries => {
                // Disposes the target element when it is display none or when layout is not active.
                if (entries.length != 0
                 && entries[0].contentRect.width == 0
                 && entries[0].contentRect.height == 0) {
                    this.dispose();
                }

                if (this._markNeedsLayout == false) {
                    this._markNeedsLayout = true;
                    return;
                }
                this.performLayout();
            });

            this._resizeObserver.observe(target);
        });

        // Sets style properties for fade-in animation to ready phase. (start)
        this.style.opacity = "0";
        this.style.transform = "scale(var(--ripple-lower-scale, 0.3))";
        this.style.transformOrigin = "center";

        ElementUtil.reflow(target);

        // Sets style properties for fade-in animation to forward. (end)
        this.style.transitionProperty = "opacity, transform";
        this.style.transitionDuration = `${this.option.fadeInDuration}, ${this.option.spreadDuration}`;
        this.style.transitionTimingFunction = `${this.option.fadeInCurve}, ${this.option.spreadCurve}`;
        this.style.opacity = "1";
        this.style.transform = "scale(var(--ripple-upper-scale, 1))";

        // Called when a transition animation started by property.
        this.addEventListener("transitionstart", () => {
            transitionStartCount += 1;
        });

        let isFadeInEnd = false;
        this.addEventListener("transitionend", () => {
            isFadeInEnd = true;
        });

        if (this.isRejectable) {
            this.statusListener = status => {
                if (status == TouchRippleEffectStatus.REJECTED) this.fadeout(target);
                if (status == TouchRippleEffectStatus.ACCEPTED) {
                    if (isFadeInEnd) return this.notify(), this.fadeout(target);
                    if (this.isWait == false) {
                        this.notify();
                    }
                    this.ontransitionend = performFadeout;
                }
            }
        } else {
            if (this.isWait == false) {
                this.notify();
            }

            // When don't need to hold the event call,
            // process it according to the current touch ripple status.
            this.ontransitionend = performFadeout;
        }
    }

    dispose() {
        this.status = TouchRippleEffectStatus.DISPOSED;
        this._statusListeners = null;
        this.remove();
    }
}

customElements.define("touch-ripple-effect", TouchRippleEffectElement);