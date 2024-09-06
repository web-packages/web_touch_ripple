<div align="center">
    <img src="https://github.com/user-attachments/assets/d4371f6b-3365-40af-a293-d1909e53badb">
    <h1>Web Touch Ripple JSX</h1>
    <table>
        <thead>
          <tr>
            <th>Version</th>
            <th>v1.0.50</th>
          </tr>
        </tbody>
    </table>
</div>

# Introduction
This package provides JSX module about web-touch-ripple package.

> __See Also:__<br>
> If you want to use this component in Preact, you need to refer to [offical docs of Preact](https://preactjs.com/guide/v10/getting-started#aliasing-react-to-preact).

## Properties of \<TouchRipple\>

| Identifier | Description | Type
| ------ | ------ | ------
| onTap | Called when a user taps or clicks. | VoidFunction
| onDoubleTap | Called when a user double taps or double clicks. | VoidFunction
| onLongTap | Called when a user long press or long clicks or long pointer-down. | VoidFunction
| wait | Whether to postpone the invocation of the related event callback function until the end of the ripple effect fade-in animation. | boolean
| selector | A CSS selector string used to target a specific child element within the component. The ripple effect will be applied to this element when a pointer event occurs. This allows you to control exactly which child element the ripple effect will affect, without changing the element tree structure. | string
| children | Hmm... This is just children elements of JSX about \<TouchRipple\>, And i'm think so easy, right?. | JSX.Element

## Properties of \<TouchRippleConnection\>

| Identifier | Description | Type
| ------ | ------ | ------
| children | Hmm... This is just children elements of JSX about \<TouchRippleConnection\>, And i'm think so easy, right?. | JSX.Element
