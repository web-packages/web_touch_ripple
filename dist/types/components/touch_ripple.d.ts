import { TouchRippleEffect, TouchRippleEffectOption } from "../effect";
import { PointerPosition } from "../type";
export declare class TouchRippleElement extends HTMLElement {
    private arena;
    /** This element is defined when the hover state. */
    private hoverEffectElement?;
    /** Is defined for update the status of added a touch effect. */
    private activeEffect?;
    private effects;
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
    connectedCallback(): void;
    private createHoverEffectElement;
    onHoverStart(): void;
    onHoverEnd(): void;
    /** Returns a new instance of ripple effect by a given properties. */
    createEffect(position: PointerPosition, callback: Function, isRejectable: boolean, option?: TouchRippleEffectOption): TouchRippleEffect;
    /** Returns a names of a touch-ripple events. */
    static get observedAttributes(): string[];
    attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void;
}
