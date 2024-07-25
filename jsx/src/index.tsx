import { useLayoutEffect, useRef } from "react";
import { TouchRippleElement } from "web-touch-ripple";

export function TouchRipple({onTap, onDoubleTap, onLongTap, wait, children}: {
    onTap?: VoidFunction,
    onDoubleTap?: VoidFunction,
    onLongTap?: VoidFunction,
    wait?: boolean,
    children: JSX.Element,
}) {
    const ref = useRef<TouchRippleElement>();

    useLayoutEffect(() => {
        const ripple = ref.current;
        ripple.ontap = onTap;
        ripple.ondoubletap = onDoubleTap;
        ripple.onlongtap = onLongTap;
        
        wait ? ripple.setAttribute("wait", "") : ripple.removeAttribute("wait");
    }, [onTap, onDoubleTap, onLongTap, wait]);

    return (
        /** @ts-ignore */
        <touch-ripple ref={ref}>{children}</touch-ripple>
    );
}