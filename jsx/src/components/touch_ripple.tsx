import { useLayoutEffect, useRef } from "react";
import { TouchRippleElement } from "web-touch-ripple";

/**
 * This component provides visual representation of the pointer event to users.
 * 
 * See Also, If you want to use this component in Preact,
 * you need to refer to [offical docs of Preact](https://preactjs.com/guide/v10/getting-started#aliasing-react-to-preact).
 */
export function TouchRipple({onTap, onDoubleTap, onLongTap, wait, selector, children}: {
    /** Called when a user taps or clicks. */
    onTap?: VoidFunction,
    /** Called when a user double taps or double clicks. */
    onDoubleTap?: VoidFunction,
    /** Called when a user long press or long clicks or long pointer-down. */
    onLongTap?: VoidFunction,
    /**
     * Whether to postpone the invocation of the related event callback function until
     * the end of the ripple effect fade-in animation.
     */
    wait?: boolean,
    /**
     * A CSS selector string used to target a specific child element within the component. 
     * The ripple effect will be applied to this element when a pointer event occurs. 
     * 
     * This allows you to control exactly which child element the ripple effect will affect, 
     * without changing the element tree structure.
     */
    selector?: string,
    children: JSX.Element,
}) {
    const ref = useRef<TouchRippleElement>();

    useLayoutEffect(() => {
        const ripple = ref.current;
        ripple.ontap = onTap;
        ripple.ondoubletap = onDoubleTap;
        ripple.onlongtap = onLongTap;

        wait ? ripple.setAttribute("wait", "") : ripple.removeAttribute("wait");

        selector != null
            ? ripple.setAttribute("selector", selector)
            : ripple.removeAttribute("selector");
    }, [onTap, onDoubleTap, onLongTap, wait]);

    return (
        <touch-ripple ref={ref} children={children} />
    );
}