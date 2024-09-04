
export class ElementUtils {
    static sizeOf(style: CSSStyleDeclaration): {width: number, height: number} {
        const width = parseFloat(style.width);
        const height = parseFloat(style.height);
        const paddingL = parseFloat(style.paddingLeft);
        const paddingR = parseFloat(style.paddingRight);
        const paddingT = parseFloat(style.paddingTop);
        const paddingB = parseFloat(style.paddingBottom);

        return {
            width: width + paddingL + paddingR,
            height: height + paddingT + paddingB
        }
    }
}