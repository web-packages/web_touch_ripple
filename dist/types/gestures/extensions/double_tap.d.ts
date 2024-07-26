import { GestureEventCallback, PointerPosition } from "../../type";
import { TouchRippleGestureRecogzier } from "../gesture_recognizer";
export declare class DoubleTapGestureRecognizer extends TouchRippleGestureRecogzier {
    onDoubleTap: GestureEventCallback;
    doubleTappableDuration: number;
    /** A total number of taps or clicks by a user. */
    tapCount: number;
    timeId: number;
    constructor(onDoubleTap: GestureEventCallback, doubleTappableDuration: number);
    pointerDown(position: PointerPosition): void;
    onAccept(): void;
    dispose(): void;
    toString(): string;
}
