/// <reference types="react" />
/**
 * This component provides visual representation of the pointer event to users.
 *
 * See Also, If you want to use this component in Preact,
 * you need to refer to [offical docs of Preact](https://preactjs.com/guide/v10/getting-started#aliasing-react-to-preact).
 */
export declare function TouchRipple({ onTap, onDoubleTap, onLongTap, wait, children }: {
    /** Called when a user taps or clicks. */
    onTap?: VoidFunction;
    /** Called when a user double taps or double clicks. */
    onDoubleTap?: VoidFunction;
    /** Called when a user long press or long clicks or long pointer-down. */
    onLongTap?: VoidFunction;
    /**
     * Whether to postpone the invocation of the related event callback function until
     * the end of the ripple effect fade-in animation.
     */
    wait?: boolean;
    children: JSX.Element;
}): import("react/jsx-runtime").JSX.Element;
