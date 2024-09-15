import { PointerPosition, TouchRippleEffectStatusListener } from "../type";
import { TouchRippleElement } from "./touch_ripple";
export declare enum TouchRippleEffectStatus {
    NONE = 0,
    ACCEPTED = 1,
    REJECTED = 2,
    DISPOSED = 3
}
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
    connectedCallback(): void;
    dispose(): void;
}
