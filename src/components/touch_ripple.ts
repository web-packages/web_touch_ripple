import { TouchRippleEffect } from "../effect";
import { GestureArena } from "../gestures/gesture_arena";
import { TapGestureRecognizer } from "../gestures/tap";
import { PointerPosition, PointerType } from "../type";

export class TouchRippleElement extends HTMLElement {
    arena: GestureArena = new GestureArena();

    activeEffect: TouchRippleEffect;

    get child(): HTMLElement {
        return this.firstElementChild as HTMLElement;
    }

    getPropertyByName(name, scope = this) {
        return getComputedStyle(scope).getPropertyValue(name);
    }

    /** Initializes gesture-recognizer builders for arena. */
    initBuiler() {
        this.arena.registerBuilder(() => {
            return new TapGestureRecognizer(
                (p) => this.showEffect(p, () => console.log("onTap"), false),
                (p) => this.showEffect(p, () => console.log("onTapRejectable"), true),
                () => console.log("onTapAccept"),
                () => console.log("onTapReject"),
                150
            );
        });
    }

    connectedCallback() {
        const onTap = this.getAttribute("ontap");
        if (onTap == null) {
            throw "Required property value [ontap] is undefined";
        }

        requestAnimationFrame(() => {
            const wait = this.hasAttribute("wait");
            const child = this.child;
            if (child == null) {
                throw "This element must be exists child element.";
            }

            const asyncWait = this.hasAttribute("await");
            if (asyncWait && wait) {
                throw "A optional attributes [wait] and [wait] are both defined.";
            }

            child.style.position = "relative";
            child.style.overflow = "hidden";
            child.style.cursor = "pointer";
            child.style.userSelect = "none";
            child.style.transitionDuration = "var(--ripple-hover-fade-duration)";
            /*
            child.onclick = (event) => {
                if ((wait || asyncWait) && child.getElementsByClassName("ripple").length != 0)
                    return;
                if (wait) {
                    return this.show(event, () => eval(onTap));
                }
                this.show(event, null);
                eval(onTap);
            };
            */

            // A gestures competition related.
            {
                const _clearEventListener = () => {
                    document.removeEventListener("pointerup", _handlePointerUp);
                    document.removeEventListener("pointermove", _handlePointerMove);
                }
                const _handlePointerUp = (event: PointerEvent) => {
                    this.arena.handlePointer(event, PointerType.UP);
                    _clearEventListener();
                }
                const _handlePointerMove = (event: PointerEvent) => {
                    this.arena.handlePointer(event, PointerType.MOVE);
                }
                const _handlePointerCancel = (event: PointerEvent) => {
                    this.arena.handlePointer(event, PointerType.CANCEL);
                    _clearEventListener();
                }

                document.addEventListener("pointerup", _handlePointerUp);
                document.addEventListener("pointermove", _handlePointerMove);

                this.onpointerdown = event => {
                    this.arena.handlePointer(event, PointerType.DOWN);

                    document.addEventListener("pointerup", _handlePointerUp);
                    document.addEventListener("pointermove", _handlePointerMove);
                };
                this.onpointercancel = _handlePointerCancel;
                this.onpointerleave = _handlePointerCancel;
                
                this.initBuiler();
            }

            if (!('ontouchstart' in window || navigator.maxTouchPoints)) {
                child.onpointerenter = () => { child.style.backgroundColor = "var(--hover)"; };
                child.onpointerleave = () => { child.style.backgroundColor = ""; };
            }
        });
    }

    showEffect(
        position: PointerPosition,
        callback: Function,
        isRejectable: boolean,
    ) {
        const effect = new TouchRippleEffect(
            position,
            callback,
            isRejectable,
        );
        
        this.child.appendChild(effect.createElement(this, this.child));
    }
}

customElements.define("touch-ripple", TouchRippleElement);
