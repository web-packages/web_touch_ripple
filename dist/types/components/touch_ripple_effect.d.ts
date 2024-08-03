import { PointerPosition, TouchRippleEffectStatusListener } from "../type";
import { TouchRippleElement } from "./touch_ripple";
export declare enum TouchRippleEffectStatus {
    NONE = 0,
    ACCEPTED = 1,
    REJECTED = 2,
    DISPOSED = 3
}
export type TouchRippleEffectOption = {
    fadeInDuration: string;
    fadeInCurve: string;
};
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
    target?: HTMLElement;
    private _status;
    private _statusListeners;
    private _ripple;
    constructor(position: PointerPosition, callback: Function, isRejectable: boolean, 
    /**
     * Whether to postpone the invocation of the related event callback function until
     * the end of the ripple effect fade-in animation.
     */
    isWait: boolean, option: TouchRippleEffectOption, parent: TouchRippleElement, target?: HTMLElement);
    get status(): TouchRippleEffectStatus;
    set status(newValue: TouchRippleEffectStatus);
    set statusListener(callback: TouchRippleEffectStatusListener);
    notify(): void;
    fadeout(parent: HTMLElement, target?: HTMLElement): void;
    cancel(parent: HTMLElement, target?: HTMLElement): void;
    createElement(parent: TouchRippleElement, target: HTMLElement): HTMLElement;
    dispose(): void;
}
