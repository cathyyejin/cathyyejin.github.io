# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-XX

### Added
- Initial wedding invitation website
- Full-screen banner images with scroll-triggered animations
- Calendar with wedding date countdown
- Photo gallery with swipe navigation
- Location section with Kakao Maps integration
- Guest book with Supabase database integration
- Contact information popup
- Account information section
- Background music with mute/unmute functionality
- Kakao Share integration with template support
- Responsive design for mobile and desktop
- Scroll-triggered slide-up animations for sections

### Fixed
- Android gallery swipe behavior (picture-by-picture snapping)
- Vertical bounce prevention on Android browsers
- Image resizing issues when Android address bar shows/hides
- Image stretching on Android browsers
- Music continues playing after browser closes (mobile)
- Kakao Share template variable support
- Contact popup overflow on smaller screens
- Gallery popup showing correct clicked image
- Account number copying functionality

### Changed
- Gallery grid from 3x3 to 3x5
- Sunday color in calendar to pink/red
- Contact popup from dark to light theme
- Image cropping for better full-screen display
- Scroll animations to apply to entire sections instead of individual text elements

### Technical
- Integrated Supabase for guest book messages
- Added environment variable support for API keys
- Implemented viewport height locking for Android browser UI
- Added overscroll behavior prevention
- Optimized touch gestures for mobile devices
