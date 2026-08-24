# Changelog

All notable changes to Chi NAV are documented here.

## [3.0.1] - 2026-08-24

### Added
- Added a centralized runtime state for NAV preferences.
- Added persistent local preferences for favorites, recent links, and frequent links.
- Added favorite toggling and a dedicated Favorites section.
- Added automatic recent-link tracking and a dedicated Recent section.
- Added usage-count tracking for frequent links.
- Added reusable Card rendering and centralized icon handling.
- Added loading, ready, error, and empty UI states.
- Added centralized event lifecycle handling.

### Changed
- Refined the NAV card hierarchy and responsive layout.
- Integrated preferences into the application startup lifecycle.
- Standardized Card rendering across personalized and normal sections.
- Improved HTML escaping and icon fallback handling.

## [3.0.0] - 2026-08-24

### Added
- Established the NAV 3.0 project structure.
- Added centralized version metadata.
- Defined application, data, and schema version fields.

### Changed
- Began rebuilding NAV from a clean architecture while keeping `nav-old` as the legacy reference.
