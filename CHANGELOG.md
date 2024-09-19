# 1.1.20
- Added the long-tap gesture along with related options.

# 1.1.30
- Added TouchRippleConnectionElement for adding `<touch-ripple-connection>` html-element.

# 1.1.31
- Fixed an issue where the event callback function was called twice when the "wait" option was enabled and the `rejectable` state was false.

# 1.1.32
- Fixed an issue where events were called twice and an issue where the gesture cancellation was not detected.

# 1.1.41
- Added new options `--ripple-spread-duration` and `--ripple-spread-curve`.
- Fixed calculating the position about ripple effect.
- Fixed an issue where the ripple effect position was offset due to the margin of child elements.

# 1.1.42 ~ 43
- Fixed an issue where `--ripple-tap-preview-duration` was 0 seconds and it was not start the ripple effect animation after pointer-down.
- Fixed an issue where `--ripple-fadeout-duration` was 0 seconds and it was not start the ripple effect animation of fade-out after fade-in animation ended.

# 1.1.50
- Fixed an issue where the ripple effect was not fully expanding or was exceeding its bounds due to calculating the size of the target element without considering its padding.
- Updated --ripple-blur-radius to support percentage (%) values that adjust dynamically based on the size of the element, in addition to previously supporting only fixed pixel values.

# 1.1.60
- Added `selector` attribute and related features. For more details, please refer to the [README.md](README.md#how-to-register-an-event-at-the-parent-level-and-apply-a-ripple-effect-to-a-specific-child-element).

# 1.2.0
- Fixed an issue where elements wrapped by touch-ripple or touch-ripple-connection affected the styling of their parent elements, impacting the expected style definitions. For example, even if a child element's height is set to 100%, if the touch-ripple element is the parent, the child's styles may not be applied correctly due to the parent element's influence.

# 1.2.10
- Fixed an issue where all event callback functions were called twice when the `wait` option was enabled. The cause of this issue is suspected to have occurred during the transition from keyframe-based animation to an independent CSS transition method in a previous update.

# 1.2.20
- Fixed an issue where certain gesture actions were incorrectly considered as clicks by ensuring that only the main button (e.g., the left button of the mouse) is recognized as clicked.

# 1.2.30
- Fixed an issue where applying overflow: hidden to ensure that the touch ripple effect was confined within the child elements caused significant rendering performance degradation. The solution now avoids applying this style when the effect is not present or active, resulting in a substantial performance improvement.

# 1.3.0
- Fixed an issue where, in a gesture arena, if competing gestures (e.g., double-tap and long-tap) were present, the scenario where a gesture should ultimately win after pointer up, even if the competing gestures lose, was not being correctly handled.
- Fixed an issue where using elements like `<div class="ripple">`, which could lead to duplication, was replaced with a custom element like `<touch-ripple-effect>` to manage its own animation and DOM tree removal.

# 1.3.20
- Fixed an issue where the ripple effect would not fully expand when the size of the element changed during ripple spreading, by applying a temporary workaround to mitigate the inconvenience. (future update planned about it).

- Fixed an issue where the fade-in animation was skipped at the start of the ripple effect. This issue occurred because `requestAnimationFrame` was used to handle intermediate steps, causing the element not to reflow when it was unnecessary. As a result, the browser could not determine the transition animation's start and end properly.

- Updated the ripple effect to apply the willChange property, enabling GPU acceleration.

# 1.3.30
- Fixed an issue where the ripple effect now recalculates the layout when the target element's size changes, preventing problems during dynamic size changes.