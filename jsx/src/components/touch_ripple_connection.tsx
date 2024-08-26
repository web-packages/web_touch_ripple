
/**
 * This component used when to connect gestures from a parent element
 * to a child touch-ripple element.
 */
export function TouchRippleConnection({children}: {
    children: JSX.Element,
}) {
    /** @ts-ignore */
    return <touch-ripple-connection children={children} />
}