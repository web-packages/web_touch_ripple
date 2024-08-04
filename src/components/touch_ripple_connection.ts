
export class TouchRippleConnectionElement extends HTMLElement {
    /**
     * Gets a touch ripple connection ancestor of a given element by
     * traversing the tree in reverse order.
     */
    static ancestorOf(element: Element) {
        let parent = element.parentElement;

        while (parent) {
            if (parent instanceof TouchRippleConnectionElement) {
                return parent;
            }

            parent = parent.parentElement;
        }
    }
}

customElements.define("touch-ripple-connection", TouchRippleConnectionElement);