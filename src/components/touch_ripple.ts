import { GestureArena } from "../gestures/gesture_arena";
import { PointerPosition, PointerType } from "../type";
import { TapGestureRecognizer } from "../gestures/extensions/tap";
import { DoubleTapGestureRecognizer } from "../gestures/extensions/double_tap";
import { LongTapGestureRecognizer } from "../gestures/extensions/long_tap";
import { TouchRippleEffectHoverElement } from "./touch_ripple_effect_hover";
import { TouchRippleEffectElement, TouchRippleEffectOption, TouchRippleEffectStatus } from "./touch_ripple_effect";
import { TouchRippleConnectionElement } from "./touch_ripple_connection";

export class TouchRippleElement extends HTMLElement {
    private arena: GestureArena = new GestureArena({isKeepAliveLastPointerUp: true});

    /**
     * This value is defined and discarded only when this element
     * is in the hover state to a user.
     */
    private hoverEffectElement?: TouchRippleEffectHoverElement;

    /**
     * This value is defining a touch ripple element that is remaining in this element,
     * i.e. the touch ripple effect element of active state.
     */
    private activeEffect?: TouchRippleEffectElement;

    /** Called when a user taps or clicks. */
    private _ontap: Function;

    /** Sets a callback function that is called when a user taps or clicks. */
    set ontap(callback: Function) {
        this._ontap = callback;
        this.initBuiler();
    }

    /** Called when a user double taps of double clicks. */
    private _ondoubletap: Function;

    /** Sets a callback function that is called when a user double taps or double clicks. */
    set ondoubletap(callback: Function) {
        this._ondoubletap = callback;
        this.initBuiler();
    }

    /* Called when a user long press or long clicks or long pointer-down. */
    private _onlongtap: Function;

    /** 
     * Sets a callback function that is called when a user long press or long clicks
     * or long pointer-down.
     */
    set onlongtap(callback: Function) {
        this._onlongtap = callback;
        this.initBuiler();
    }

    get child(): HTMLElement {
        const selector = this.getAttribute("selector");

        // When exists a given ripple selector about CSS.
        if (selector) {
            return this.querySelector(selector) ?? this.firstElementChild as HTMLElement;
        }

        return this.firstElementChild as HTMLElement;
    }

    getPropertyByName(name: string, scope = this): string {
        return getComputedStyle(scope).getPropertyValue(name);
    }

    getDurationByName(name: string, scope = this): number {
        const value = this.getPropertyByName(name, scope);

        return value == "" || value == "none" ? null : value.endsWith("ms")
            ? Number(value.replace("ms", ""))
            : Number(value.replace("s", "")) * 1000;
    }

    getBooleanByName(name: string, scope = this): boolean {
        const value = this.getPropertyByName(name, scope);
        if (value == "") {
            return;
        }

        return value == "1";
    }

    /** Initializes gesture-recognizer builders for arena. */
    initBuiler() {
        this.arena.reset();

        const previewDuration = this.getDurationByName("--ripple-tap-preview-duration") ?? 150;

        if (this._ontap != null) {
            const tappableDuration = this.getDurationByName("--ripple-tappable-duration") ?? 0;
            const rejectableDuration = this._onlongtap || this._ondoubletap
                ? Infinity
                : previewDuration;

            this.arena.registerBuilder(() => {
                let effect = null;

                return new TapGestureRecognizer(
                    (p) => effect = this.createEffect(p, this._ontap, false),
                    (p) => effect = this.createEffect(p, this._ontap, true),
                    () => effect.status = TouchRippleEffectStatus.ACCEPTED,
                    () => effect.status = TouchRippleEffectStatus.REJECTED,
                    rejectableDuration, // ms
                    tappableDuration,   // ms
                )
            });
        }

        if (this._ondoubletap != null) {
            const doubleTappableDuration = this.getDurationByName("--ripple-double-tappable-duration") ?? 300;

            this.arena.registerBuilder(() =>
                new DoubleTapGestureRecognizer(
                    p => this.createEffect(p, this._ondoubletap, false),
                    doubleTappableDuration, // ms
                )
            );
        }

        if (this._onlongtap != null) {
            const longtappableDuration = this.getDurationByName("--ripple-long-tappable-duration") ?? 1000;

            this.arena.registerBuilder(() => {
                let effect = null;

                return new LongTapGestureRecognizer(
                    p => effect = this.createEffect(
                        p,
                        this._onlongtap,
                        true,
                        {
                            spreadDuration: "var(--ripple-long-tappable-duration, 1s)",
                            fadeInDuration: "var(--ripple-long-tappable-duration, 1s)",
                            spreadCurve: "var(--ripple-long-tappable-curve, linear(0, 1))",
                            fadeInCurve: "var(--ripple-long-tappable-curve, linear(0, 1))"
                        }
                    ),
                    () => effect.status = TouchRippleEffectStatus.REJECTED,
                    () => effect.status = TouchRippleEffectStatus.ACCEPTED,
                    previewDuration,
                    longtappableDuration
                )
            });
        }
    }

    initPointerEvent(element: HTMLElement) {
        const useHoverEffect = this.getBooleanByName("--ripple-use-hover") ?? true;

        element.onpointerdown   = e => this.arena.handlePointer(e, PointerType.DOWN);
        element.onpointermove   = e => this.arena.handlePointer(e, PointerType.MOVE);
        element.onpointerup     = e => this.arena.handlePointer(e, PointerType.UP);
        element.onpointercancel = e => this.arena.handlePointer(e, PointerType.CANCEL);
        element.onpointerleave  = e => this.arena.handlePointer(e, PointerType.CANCEL);
        element.onmouseleave    = e => this.arena.handlePointer(e as PointerEvent, PointerType.CANCEL); // for touch env

        if (!('ontouchstart' in window) && useHoverEffect) {
            element.onmouseenter = () => this.onHoverStart();
            element.onmouseleave = () => this.onHoverEnd();
        }
    }

    connectedCallback() {
        requestAnimationFrame(() => {
            const child = this.child;
            if (child == null || this.children.length > 1) {
                throw "The <touch-ripple> element must be have a child element.";
            }

            // A gestures competition related.
            this.initPointerEvent(TouchRippleConnectionElement.ancestorOf(this) ?? child);
        });
    }

    createHoverElement(): TouchRippleEffectHoverElement {
        return document.createElement("touch-ripple-effect-hover") as TouchRippleEffectHoverElement;
    }

    /** Called when a user starts hovering over render area of this element. */
    onHoverStart() {
        const parent = this.child;

        if (this.hoverEffectElement == null) {
            parent.appendChild(this.hoverEffectElement = this.createHoverElement());
        }

        this.hoverEffectElement.ontransitionend = null;
        this.hoverEffectElement.getBoundingClientRect(); // for reflow
        this.hoverEffectElement.style.opacity = "1";
    }

    /** Called when pointer position of a user leaves render area of this element. */
    onHoverEnd() {
        if (this.hoverEffectElement) {
            const hoverEffect = this.hoverEffectElement;
            hoverEffect.style.opacity = "0";
            hoverEffect.ontransitionend = () => {
                this.child.removeChild(hoverEffect);
                this.hoverEffectElement = null;
            }
        }
    }

    /** Returns a new instance of ripple effect by a given properties. */
    createEffect(
        position: PointerPosition,
        callback: Function,
        isRejectable: boolean,
        option?: Partial<TouchRippleEffectOption>,
    ): TouchRippleEffectElement {
        const overlapBehavior = this.getPropertyByName("--ripple-overlap-behavior") ?? "overlappable";
        if (overlapBehavior == "\"cancel\"") {
            this.activeEffect?.cancel(this.child);
        } else if (overlapBehavior == "\"ignoring\"" && this.activeEffect != null) {
            return;
        }

        const OPTION: TouchRippleEffectOption = {...{
            spreadDuration: "var(--ripple-spread-duration, 0.3s)",
            spreadCurve: "var(--ripple-spread-curve, cubic-bezier(.2,.3,.4,1))",
            fadeInDuration: "var(--ripple-fadein-duration, 0.15s)",
            fadeInCurve: "var(--ripple-fadein-curve)",
            fadeOutDuration: "var(--ripple-fadeout-duration, 0.3s)",
            fadeOutCurve: "var(--ripple-fadeout-curve, cubic-bezier(.15,.5,.5,1))"
        }, ...option};

        const isWait = this.hasAttribute("wait");
        const effect = new TouchRippleEffectElement(
            position,
            callback,
            isRejectable,
            isWait,
            OPTION,
            this,      // parent
            this.child // target
        )

        this.child.appendChild(effect);
        return effect;
    }

    /** Returns a names of a touch-ripple events. */
    static get observedAttributes() {
        return ["ontap", "ondoubletap", "onlongtap"];
    }

    attributeChangedCallback(
        attrName: string,
        oldVal: string,
        newVal: string
    ) {
        if (newVal != null) {
            const callback = new Function(newVal);
            if (attrName == "ontap") this.ontap = callback;
            if (attrName == "ondoubletap") this.ondoubletap = callback;
            if (attrName == "onlongtap") this.onlongtap = callback;
        }
    }
}

customElements.define("touch-ripple", TouchRippleElement);