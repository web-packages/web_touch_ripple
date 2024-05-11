import { GestureRecognizer, GestureRecognizerResult } from "./gesture_recognizer.js";
import { GestureRecognizerBuilder, PointerType } from "../type.js";

export type GestureArenaOption = {
    // Whether to defer the gesture-recognizer about define to accept or reject
    // until a pointer-up event occurs.
    isKeepAlivePointerUp: boolean,
}

/** This arena is based on the cycle. */
export class GestureArena {
    constructor(
        public option?: GestureArenaOption
    ) {
        this.option = {
            ...{ isKeepAlivePointerUp: true }, // default
            ...this.option
        };
    }

    /** Just a items of factory functions for gesture-recognizer. */
    builders: GestureRecognizerBuilder[] = [];

    /** A currently living gesture-recognizers. */
    private recognizers: GestureRecognizer[] = [];

    /** Registers gesture-recognizer factory builder */
    registerBuilder(builder: GestureRecognizerBuilder) {
        this.builders.push(builder);
    }

    attach(recognizer: GestureRecognizer) {
        this.recognizers.push(recognizer);
    }

    detach(recognizer: GestureRecognizer) {
        this.recognizers = this.recognizers.filter(r => r != recognizer);
    }

    /** Rejects a given recognizer on this arena. */
    rejectBy(target: GestureRecognizer) {
        this.detach(target);
        this.checkCycle();
    }

    /** Accepts all a recognizers except a given recognizer. */
    acceptBy(target: GestureRecognizer) {
        this.recognizers.forEach(r => r != target ? r.reject() : undefined);
        this.recognizers = [];
    }

    acceptWith(target: GestureRecognizer) {
        target.accept(), this.acceptBy(target);
    }

    /** Resets builders and recognizers in this arena. */
    reset() {
        this.builders = [];
        this.recognizers = [];
    }

    createRecognizer(builder: GestureRecognizerBuilder): GestureRecognizer {
        const recognizer = builder();

        // Called when the gesture accepted or rejected.
        recognizer.listeners.push(result => {
            result == GestureRecognizerResult.REJECT
                ? this.rejectBy(recognizer)
                : this.acceptBy(recognizer);
        });

        return recognizer;
    }

    /**
     * Called when a recognizer is attached or detached or when
     * the others related state changes.
     */
    private checkCycle(type?: PointerType) {

        // When possible and if pointer-down event, creates recognizers by builder.
        if (type == PointerType.DOWN && this.recognizers.length == 0) {
            this.recognizers = this.builders.map(e => this.createRecognizer(e));
        } else

        // Accept a last recognizer that is survivor.
        if (this.recognizers.length == 1) {
            const last = this.recognizers[0];

            if(last.isHold == false) this.acceptWith(last);
        }
    }

    handlePointer(event: PointerEvent, type: PointerType) {
        if (type == PointerType.DOWN) {
            this.checkCycle(type);
        }

        // When the pointer are received all, need to accept the last survivor.
        if (!this.option.isKeepAlivePointerUp || type == PointerType.UP) {
            queueMicrotask(() => this.checkCycle(type));
        }

        this.recognizers.forEach(r => r.handlePointer(event, type));
    }
}