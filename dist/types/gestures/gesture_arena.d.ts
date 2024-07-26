import { GestureRecognizer } from "./gesture_recognizer.js";
import { GestureRecognizerBuilder, PointerType } from "../type.js";
export type GestureArenaOption = {
    isKeepAliveLastPointerUp: boolean;
};
/**
 * Gesture Arena is a simple gesture competition system.
 * See also, this arena is based on the cycle.
 *
 * Gestures are accepted and rejected according to the proper rules.
 */
export declare class GestureArena {
    option?: GestureArenaOption;
    constructor(option?: GestureArenaOption);
    /** Just a items of factory functions for gesture recognizer. */
    builders: GestureRecognizerBuilder[];
    /** A currently living gesture recognizers. */
    private recognizers;
    /** Registers gesture recognizer factory builder */
    registerBuilder(builder: GestureRecognizerBuilder): void;
    /** Adds a given gesture recognizer in the Arena. */
    attach(recognizer: GestureRecognizer): void;
    /** Removes a given gesture recognizer in the Arena. */
    detach(recognizer: GestureRecognizer): void;
    /** Rejects a given recognizer on this arena. */
    rejectBy(target: GestureRecognizer): void;
    /** Accepts all a recognizers except a given recognizer. */
    acceptBy(target: GestureRecognizer): void;
    /** Resets builders and recognizers in this arena. */
    reset(): void;
    createRecognizer(builder: GestureRecognizerBuilder): GestureRecognizer;
    /**
     * Called when a recognizer is attached or detached or when
     * the others related state changes.
     */
    private checkCycle;
    /**
     * Handles a given pointer event properly.
     *
     * When a pointer-down event occurs,
     * it is considered the beginning of a new gesture cycle.
     */
    handlePointer(event: PointerEvent, type: PointerType): void;
}
