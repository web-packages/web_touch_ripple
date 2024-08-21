import { PointerPosition } from "../type";
import { TouchRippleEffectHoverElement } from "./touch_ripple_effect_hover";
import { TouchRippleEffectElement, TouchRippleEffectOption } from "./touch_ripple_effect";
export declare class TouchRippleElement extends HTMLElement {
    private arena;
    /**
     * This value is defined and discarded only when this element
     * is in the hover state to a user.
     */
    private hoverEffectElement?;
    /**
     * This value is defining a touch ripple element that is remaining in this element,
     * i.e. the touch ripple effect element of active state.
     */
    private activeEffect?;
    /** Called when a user taps or clicks. */
    private _ontap;
    /** Sets a callback function that is called when a user taps or clicks. */
    set ontap(callback: Function);
    /** Called when a user double taps of double clicks. */
    private _ondoubletap;
    /** Sets a callback function that is called when a user double taps or double clicks. */
    set ondoubletap(callback: Function);
    private _onlongtap;
    /**
     * Sets a callback function that is called when a user long press or long clicks
     * or long pointer-down.
     */
    set onlongtap(callback: Function);
    get child(): HTMLElement;
    getPropertyByName(name: string, scope?: this): string;
    getDurationByName(name: string, scope?: this): number;
    getBooleanByName(name: string, scope?: this): boolean;
    /** Initializes gesture-recognizer builders for arena. */
    initBuiler(): void;
    initPointerEvent(element: HTMLElement): void;
    connectedCallback(): void;
    createHoverElement(): TouchRippleEffectHoverElement;
    /** Called when a user starts hovering over render area of this element. */
    onHoverStart(): void;
    /** Called when pointer position of a user leaves render area of this element. */
    onHoverEnd(): void;
    /** Returns a new instance of ripple effect by a given properties. */
    createEffect(position: PointerPosition, callback: Function, isRejectable: boolean, option?: Partial<TouchRippleEffectOption>): TouchRippleEffectElement;
    /** Returns a names of a touch-ripple events. */
    static get observedAttributes(): string[];
    attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void;
}
