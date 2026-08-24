# Changelog

All notable changes to Chi NAV are documented here.

## [3.1.4] - 2026-08-25

### Fixed
- Removed the hard-coded application version from the shared configuration so runtime version information comes exclusively from `data/version.json`.
- Removed the loader's dependency on a hard-coded fallback version when version metadata is unavailable.

## [3.1.3] - 2026-08-25

### Fixed
- Preserved the NAV hierarchy during data validation so links inside subcategories are rendered only under their corresponding subcategory instead of being duplicated under the parent taxonomy.

## [3.1.0] - 2026-08-24

### Changed
- Migrated the complete website catalog from `nav-old` into the new NAV data structure.
- Restored the full category and subcategory catalog from the legacy NAV.
- Preserved intentional cross-category duplicates, such as GitHub appearing in both 常用推薦 and 開發與服務.
- Increased `dataVersion` from 1 to 2 to reflect the migrated catalog.

## [3.0.2] - 2026-08-24

### Changed
- Unified the visual treatment of Favorites, Frequent, Recent, and normal website sections.
- Refined section spacing and heading hierarchy.
- Standardized card spacing and reserved space for the favorite control.
- Refined favorite button placement, hover, and focus states.
- Kept desktop and mobile card layouts consistent.

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
