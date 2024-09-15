
export class TouchRippleBinding {
    static initialize() {
        const sheet = new CSSStyleSheet();
        sheet.insertRule(`
            touch-ripple, touch-ripple-connection {
                /* 
                * Defines the element to avoid having a separate stylesheet, thereby
                * addressing style issues caused by touch ripple wrapping.
                * For example, if the parent element has its own stylesheet,
                * the size of the child element might be affected as a result.
                */
                display: contents;

                /*
                * Needs to remove effects that interfere with touch ripple on
                * touch-based devices, such as in mobile environments.
                */
                -webkit-tap-highlight-color: transparent;
            }
        `);

        sheet.insertRule(`
            touch-ripple *:has(> touch-ripple-effect),
            touch-ripple *:has(> touch-ripple-effect-hover) {
                position: relative;
                overflow: hidden;
                user-select: none;
                touch-action: manipulation;
            }
        `);

        document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
    }
}