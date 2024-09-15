import { GestureArena, GestureArenaOption } from "./gesture_arena";
/**
 * This class provides the ability to create and remove instances of gesture arenas only when they are in use,
 * preventing memory usage from escalating due to multiple (e.g. 100 to 1000) unique gesture arenas and reducing
 * delays in graphical rendering operations.
 */
export declare class GestureArenaBinding {
    private static _instance;
    private constructor();
    static get instance(): GestureArenaBinding;
    protected activeArena: WeakMap<HTMLElement, GestureArena>;
    getArenaByElement(element: HTMLElement, option: GestureArenaOption): GestureArena;
}
