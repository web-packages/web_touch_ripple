import { GestureRecognizerListener, PointerPosition, PointerType } from "../type";
export declare enum GestureRecognizerResult {
    ACCEPT = 0,
    REJECT = 1,
    UPDATE = 2
}
export declare abstract class GestureRecognizer {
    /** A listeners that is called when accpeted or rejected. */
    listeners: GestureRecognizerListener[];
    /** Whether can be accepted naturally(case of being last alone and accepted) */
    isHold: boolean;
    abstract handlePointer(event: PointerEvent, type: PointerType): void;
    accept(): void;
    reject(): void;
    hold(): void;
    release(): void;
    onAccept(): void;
    onReject(): void;
    dispose(): void;
    private perform;
}
export declare class TouchRippleGestureRecogzier extends GestureRecognizer {
    constructor();
    /** A current or last handled pointer position by `handlePointer()` */
    position: PointerPosition;
    /** Returns the pointer-position object by the given pointer-event. */
    createPosition(event: PointerEvent): PointerPosition;
    handlePointer(event: PointerEvent, type: PointerType): void;
    pointerDown(position: PointerPosition): void;
    pointerMove(position: PointerPosition): void;
    pointerUp(position: PointerPosition): void;
    pointerCancel(position: PointerPosition): void;
}
