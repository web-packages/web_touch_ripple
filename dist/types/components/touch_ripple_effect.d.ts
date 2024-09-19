import { PointerPosition, TouchRippleEffectStatusListener } from "../type";
import { TouchRippleElement } from "./touch_ripple";
/** Signature for the enumeration that defines status values about `TouchRippleEffectElement`. */
export declare enum TouchRippleEffectStatus {
    NONE = 0,
    ACCEPTED = 1,
    REJECTED = 2,
    DISPOSED = 3
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
export declare class TouchRippleEffectElement extends HTMLElement {
    position: PointerPosition;
    callback: Function;
    isRejectable: boolean;
    /**
     * Whether to postpone the invocation of the related event callback function until
     * the end of the ripple effect fade-in animation.
     */
    isWait: boolean;
    option: TouchRippleEffectOption;
    parent: TouchRippleElement;
    target: HTMLElement;
    private _status;
    private _statusListeners;
    /**
     * This value is used to exclude layout calculations when the observer is initially
     * triggered as it starts observing an element that is target.
    */
    private _markNeedsLayout;
    /**
     * The observer is defined to be called when the size of the element where a ripple effect
     * is applied changes, rather than a ripple effect itself.
     */
    private _resizeObserver;
    constructor(position: PointerPosition, callback: Function, isRejectable: boolean, 
    /**
     * Whether to postpone the invocation of the related event callback function until
     * the end of the ripple effect fade-in animation.
     */
    isWait: boolean, option: TouchRippleEffectOption, parent: TouchRippleElement, target: HTMLElement);
    get status(): TouchRippleEffectStatus;
    set status(newValue: TouchRippleEffectStatus);
    set statusListener(callback: TouchRippleEffectStatusListener);
    notify(): void;
    fadeout(parent?: HTMLElement): void;
    cancel(parent?: HTMLElement): void;
    /** Sets style properties for the ripple position and intrinsic size settings. */
    performLayout(): void;
    disconnectedCallback(): void;
    connectedCallback(): void;
    dispose(): void;
}
