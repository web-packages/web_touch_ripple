import { HTMLAttributes, RefAttributes } from "react";
import { TouchRippleConnectionElement, TouchRippleElement } from "web-touch-ripple";
/** Signature for the types that defines a component of React/Preact. */
type JSXCustomElement<T extends HTMLElement> = HTMLAttributes<T> & RefAttributes<T>;
declare module "react/jsx-runtime" {
    namespace JSX {
        interface IntrinsicElements {
            "touch-ripple": JSXCustomElement<TouchRippleElement>;
            "touch-ripple-connection": JSXCustomElement<TouchRippleConnectionElement>;
        }
    }
}
export {};
