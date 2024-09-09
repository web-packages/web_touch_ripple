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