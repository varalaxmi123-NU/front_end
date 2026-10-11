# Changelog

All notable changes to the **PULSE 30** project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2026-10-11

### Added
- **50/30/20 Macro Allocation Radar Donut**: Real-time visual comparison of Needs vs Wants vs Vault savings.
- **48-Hour Impulse Wishlist Cool-off Sandbox**: Cognitive delay tool for curbing impulsive UPI splurges.
- **Telemetry Export Service**: Client-side JSON and CSV data export for financial health audits.
- **Comprehensive Responsive Media Queries**: Breakpoint coverage for mobile, tablet, and wide desktop viewports.
- **Accessibility Enhancements**: Skip-navigation links, focus-visible outlines, and WCAG 2.1 AA compliant contrast.
- **Unit Test Suite**: Native Node test runner covering calculation formulas and simulation cascades.

### Changed
- Refactored state management to separate business logic into dedicated services (`financialCalculationService`, `storageService`, `exportService`).
- Split bundle into optimized vendor chunks using Vite rollup configuration (<100kB main chunk).

### Fixed
- Donut SVG auto-expansion on mobile viewports constrained to exact 170px dimensions.
- Wishlist metadata divider and price layout spacing.
