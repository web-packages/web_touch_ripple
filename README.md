<div align="center">
    <img src="https://github.com/user-attachments/assets/221bce7d-dbf7-4559-9b8a-aaffee96d064">
    <h1>Web Touch Ripple</h1>
    <table>
        <thead>
          <tr>
            <th>Version</th>
            <th>v1.1.42</th>
          </tr>
        </tbody>
    </table>
</div>

# Introduction
This package provides visual representation of the pointer event to users, And using web components to implement efficient and simple and flexible touch ripple effects.

> See Also, If you want the change-log by version for this package. refer to [Change Log](CHANGELOG.md) for details.

## Preview
This is just a preview of a simple example of that package.

> This may be different from the real thing (by gif)

![ezgif-2-d586f8046c](https://github.com/MTtankkeo/web_touch_ripple/assets/122026021/eb0c866c-fb18-4f2c-8f08-c706214e01f9)

## How to apply ripple element
Please refer to the following codes for details!

### Staticly
This is a solution of converting a string into a function and using it.

> Not recommended to use it in this way and it can mainly be used for debugging purposes.

```html
<!-- Called when a user taps or clicks. -->
<touch-ripple ontap="console.log('tap!')">
    <!-- child of the touch-ripple element must be one. -->
    <h1 style="padding: 15px;">
        Hello, world!
    </h1>
</touch-ripple>
```

### Locally
This is the most ideal and widely used solution.

```html
<touch-ripple id="ripple">...</touch-ripple>
<script>
    // in script.
    const ripple = document.getElementById("ripple");

    // Called when a user taps or clicks.
    ripple.ontap = () => console.log("tap!");

    // Called when a user double taps or clicks.
    ripple.ondoubletap = () => console.log("double tap!");

    // Called when a user long press or long clicks or long pointer-down.
    ripple.onlongtap = () => console.log("long tap!");
</script>
```

### How to wait callback until ripple effects are spread all?
This is can implement by adding a attribute `wait` to a touch-ripple element.

```html
<!-- Called when a ripple effect has spread all, after a user taps and clicks. -->
<touch-ripple ontap="() => ..." wait>
```

### How to connect gestures in parent to a child touch-ripple element?
To connect gestures from a parent element to a child touch-ripple element, you need to using `<touch-ripple-connection>` element, so it can be done very easily.

#### Example
> __See Also__<br>
> For the sake of example code simplicity, style definitions have been omitted.

```html
<touch-ripple-connection>
    <div style="display: flex; justify-content: center; padding: 50px;"> <!-- from -->
        <touch-ripple ontap="console.log('hello world')">
            <div> <!-- to -->
                <h1>Touch Ripple Connection</h1>
                <span>When using touch-ripple-connection element (by declarating in the parent.)</span>
            </div>
        </touch-ripple>
    </div>
</touch-ripple-connection>
```

#### Example Preview
![touch-ripple-connection](https://github.com/user-attachments/assets/5a946016-b3db-4275-bfae-48f2a10459b4)

### How to use with react in typescript?
This is can easily implement this by adding import like the code below.

> Refer to [Github](https://github.com/MTtankkeo/web_touch_ripple/tree/main/jsx) or [NPM](https://www.npmjs.com/package/web-touch-ripple-jsx) for details about JSX.

```jsx
import "web-touch-ripple";
import { TouchRipple } from "web-touch-ripple/jsx";

export function TestPage() {
    return (
        <TouchRipple onTap={() => console.log("tap!")}>
            <h1>Hello, world!</h1>
        </TouchRipple>
    );
}
```

## Variables of CSS
| Name | Description | Default Value
| ------ | ------ | ------
| --ripple | The background color of touch-ripple effect. | rgba(0, 0, 0, 0.2)
| --ripple-hover | The background color of touch-ripple effect when the hover state. | rgba(0, 0, 0, 0.1)
| --ripple-hover-duration | This is duration of fade-in or fade-out about the hover effect. | 0.25s
| --ripple-spread-duration | The duration until the ripple effect completely fills the element. | 0.25s
| --ripple-spread-curve | This is curve for fade-in and spread animation of ripples. | cubic-bezier(.2,.3,.4,1)
| --ripple-fadein-duration | The duration of fade-in animation about a ripple effect. | 0.25s
| --ripple-fadein-curve | This is curve for fade-in animation about a ripple effect. | default of browser
| --ripple-fadeout-duration | The duration until the ripple effect disappears. | 0.4s
| --ripple-fadeout-curve | This is curve for fade-out animation of ripples. | default of browser
| --ripple-cancel-duration | This is curve for fade-out animation of ripples when cancels. | 0s
| --ripple-cancel-curve | This is curve for fade-out animation of ripples when cancels. | default of browser
| --ripple-blur-radius | The blur effect radius of touch ripple. | 15px
| --ripple-lower-scale | The ripple scale of start point. | 0.3
| --ripple-upper-scale | The ripple scale of end point. | 1
| --ripple-tap-preview-duration | The rejectable duration about tap event. | 0.15s
| --ripple-tappable-duration | After a pointer down occurs, gestures are rejected after this duration. | none
| --ripple-double-tappable-duration | This duration required to define if it is a double tap. | 0.1s
| --ripple-long-tappable-duration | This duration required to define if it is a long tap. | 1s
| --ripple-long-tappable-curve | This is curve for fade-in animation of ripples about long tap. | linear
| --ripple-overlap-behavior | This option defines the behavior of a touch ripple when it overlaps. (overlappable, cancel, ignoring) | overlappable
| --ripple-use-hover | Whether or not to apply the hover effect. | 1 (true)

## How to customize gestures?
Use the `Gesture Arena` and `Gesture Recognizer` provide on this package.

```js
// for gestures competition for accept on the place.
this.arena = new GestureArena();
```

```js
// for factory function registering about the gesture-recognizer.
this.arena.registerBuilder(() =>
    new TapGestureRecognizer(...args)
);
```

### How to make gesture recognizer?
Please refer to the following codes for details!

```ts
// in `gesture_recognizer.ts`
export class TouchRippleGestureRecogzier extends GestureRecognizer { ... }
```

```ts
// e.g.
export class TestGestureRecognizer extends TouchRippleGestureRecogzier {
    constructor(
        public callback1: GestureEventCallback,
        public callback2: GestureEventCallback,
        public callback3: GestureEventCallback,
    ) {
        super();
    }

    pointerDown(position: PointerPosition): void { ... }
    pointerMove(positoin: PointerPosition): void { ... }
    pointerUp(positoin: PointerPosition): void { ... }
    pointerCancel(positoin: PointerPosition): void { ... }

    dispose(): void {
        // Defines all values defined for judgment as null.
    }

    onAccept(): void { ... }
    onReject(): void { ... }
}
```
