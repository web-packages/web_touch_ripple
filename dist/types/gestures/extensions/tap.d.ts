import { GestureEventCallback, PointerPosition } from "../../type";
import { TouchRippleGestureRecogzier } from "../gesture_recognizer";
export declare class TapGestureRecognizer extends TouchRippleGestureRecogzier {
    onTap: GestureEventCallback;
    onTapRejectable: GestureEventCallback;
    onTapAccept: GestureEventCallback;
    onTapReject: GestureEventCallback;
    rejectableDuration: number;
    tappableDuration: number;
    timerIds: number[];
    /** Whether the gesture can be rejected in the middle. */
    isRejectable: boolean;
    constructor(onTap: GestureEventCallback, onTapRejectable: GestureEventCallback, onTapAccept: GestureEventCallback, onTapReject: GestureEventCallback, rejectableDuration: number, // tap preview duration
    tappableDuration: number);
    pointerDown(position: PointerPosition): void;
    pointerUp(_: PointerPosition): void;
    dispose(): void;
    onAccept(): void;
    onReject(): void;
    toString(): string;
}
