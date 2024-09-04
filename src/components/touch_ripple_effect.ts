import { Point } from "../point";
import { PointerPosition, TouchRippleEffectStatusListener } from "../type";
import { ElementUtils } from "../utils/element";
import { TouchRippleElement } from "./touch_ripple";

export enum TouchRippleEffectStatus {
    NONE,
    ACCEPTED,
    REJECTED,
    DISPOSED
}

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
    private _ripple: HTMLElement;

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
        public target?: HTMLElement
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

    fadeout(
        parent: HTMLElement,
        target: HTMLElement = this._ripple
    ) {
        if (parent == null) return;
        if (target == null) return;
        target.style.transitionProperty = "opacity"
        target.style.transitionDuration = this.option.fadeOutDuration;
        target.style.transitionTimingFunction = this.option.fadeOutCurve;
        target.style.opacity = "0";
        requestAnimationFrame(() => {
            target.ontransitionend = () => parent.removeChild(target);
        });
        this.dispose();
    }

    cancel(
        parent: HTMLElement,
        target: HTMLElement = this._ripple
    ) {
        if (parent == null) return;
        if (target == null) return;
        target.style.transitionProperty = "opacity"
        target.style.transitionDuration = "var(--ripple-cancel-duration, 0s)";
        target.style.transitionTimingFunction = "var(--ripple-cancel-curve)";
        target.style.opacity = "0";
        requestAnimationFrame(() => {
            target.ontransitionend = () => parent.removeChild(target);
        });
        this.dispose();
    }

    createElement(
        parent: TouchRippleElement,
        target: HTMLElement,
    ) {
        const parentRect = parent.getBoundingClientRect();
        const targetStyle = getComputedStyle(target);
        const targetSize = ElementUtils.sizeOf(targetStyle);
        const targetShiftLeft = parseFloat(targetStyle.marginLeft);
        const targetShiftTop = parseFloat(targetStyle.marginTop);
        const targetMax = Math.max(targetSize.width, targetSize.height);
        const targetX = (this.position.x - parentRect.left) - targetShiftLeft;
        const targetY = (this.position.y - parentRect.top) - targetShiftTop;
        const centerX = targetSize.width / 2;
        const centerY = targetSize.height / 2;
        let transitionStartCount = 0;
        let transitionEndCount = 0;
        const performFadeout = () => {
            if (this.isWait) this.notify();

            // In this case, transition is independently defined to 'opacity', 'transform'
            // and has a separate life-cycle.
            if (++transitionEndCount == transitionStartCount) {
                this.fadeout(target);

                // Clean up a registered event callback to prevent a redemption called.
                ripple.ontransitionend = null;
            }
        }

        // Initializes setting values.
        {
            var blurRadius = parent.getPropertyByName("--ripple-blur-radius") || "6%";
            if (blurRadius.endsWith("%")) {
                const percent = Number(blurRadius.replace("%", "")) / 100;
                const pixcels = targetMax * percent;
                var blurRadiusValue = Number(pixcels);
            } else {
                var blurRadiusValue = Number(blurRadius.replace("px", ""));
            }
        }

        let rippleSize  = new Point(centerX, centerY).distance(0, 0) * 2;
            rippleSize += new Point(centerX, centerY).distance(targetX, targetY) * 2;
            rippleSize += blurRadiusValue * 2;

        this._ripple = document.createElement("div");
        const ripple = this._ripple;
        ripple.classList.add("ripple");
        ripple.style.position = "absolute";
        ripple.style.left = `${targetX}px`;
        ripple.style.top = `${targetY}px`;
        ripple.style.width = `${rippleSize}px`;
        ripple.style.height = `${rippleSize}px`;
        ripple.style.pointerEvents = "none";
        ripple.style.translate = "-50% -50%";
        ripple.style.borderRadius = "50%";
        ripple.style.backgroundColor = "var(--ripple, rgba(0, 0, 0, 0.2))";
        ripple.style.filter = `blur(${blurRadiusValue}px)`;

        { // is fade-in animation ready.
            ripple.style.opacity = "0";
            ripple.style.transform = "scale(var(--ripple-lower-scale, 0.3))";
            ripple.style.transformOrigin = "center";

            // Sets transition settings by related properties.
            ripple.style.transitionProperty = "opacity, transform";
            ripple.style.transitionDuration = `${this.option.fadeInDuration}, ${this.option.spreadDuration}`;
            ripple.style.transitionTimingFunction = `${this.option.fadeInCurve}, ${this.option.spreadCurve}`;
        }

        queueMicrotask(() => { // is fade-in animation forward.
            ripple.getBoundingClientRect(); // reflowed
            ripple.style.opacity = "1";
            ripple.style.transform = "scale(var(--ripple-upper-scale, 1))";
        });

        // Called when a transition animation started by property.
        ripple.addEventListener("transitionstart", () => {
            transitionStartCount += 1;
        });

        let isFadeInEnd = false;
        ripple.addEventListener("transitionend", () => {
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
                    ripple.ontransitionend = performFadeout;
                }
            }
        } else {
            if (this.isWait == false) {
                this.notify();
            }

            // When don't need to hold the event call,
            // process it according to the current touch ripple status.
            ripple.ontransitionend = performFadeout;
        }

        return ripple;
    }

    dispose() {
        this.status = TouchRippleEffectStatus.DISPOSED;
        this._statusListeners = null;
        this._ripple = null;
    }
}

customElements.define("touch-ripple-effect", TouchRippleEffectElement);