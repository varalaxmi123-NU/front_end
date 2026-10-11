# Contributing to PULSE 30

Thank you for your interest in contributing to **PULSE 30**!

## Development Workflow

1. Fork and clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Run tests before submitting a Pull Request:
   ```bash
   npm test
   ```
5. Run the linter to ensure high code quality:
   ```bash
   npm run lint
   ```

## Coding Guidelines
- All code must pass `oxlint` with 0 errors and 0 warnings.
- Components must support responsive breakpoints and meet WCAG 2.1 AA accessibility guidelines.
- Financial calculation functions must be accompanied by unit tests in `src/__tests__/`.
