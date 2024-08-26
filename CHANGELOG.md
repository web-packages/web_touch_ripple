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

# 1.1.42
- Fixed an issue where `--ripple-tap-preview-duration` was 0 seconds and it was not start the ripple effect animation after pointer-down.
- Fixed an issue where `--ripple-fadeout-duration` was 0 seconds and it was not start the ripple effect animation of fade-out after fade-in animation ended.