# CSS Selector Generator Benchmark

Benchmark to compare Javascript libraries for generating CSS selectors.

**[Run the benchmark](https://fczbkk.github.io/css-selector-generator-benchmark/)**

## Overview

Tests each library against a complex HTML document and measures various performance and quality metrics.

## Currently Tested Libraries

- [css-selector-generator](https://github.com/fczbkk/css-selector-generator) - Configurable CSS selector generator (default settings)
- [css-selector-generator (custom options)](https://github.com/fczbkk/css-selector-generator) - Same library with custom selectors: id, class, tag, nthchild
- [@medv/finder](https://github.com/antonmedv/finder) - Fast and efficient CSS selector generator
- [@cypress/unique-selector](https://github.com/cypress-io/unique-selector) - Maintained by Cypress, returns unique CSS selector for DOM nodes

## Metrics

The benchmark measures:

- **Total Elements**: Number of elements tested
- **Selectors Generated**: How many selectors were successfully created
- **Unique Selectors**: How many selectors uniquely match only their target element
- **Total Time**: Total time to generate all selectors
- **Average Time**: Average time per selector
- **Fastest/Slowest Time**: Performance range
- **Selector Length**: Shortest, longest, and average selector length

## Installation

```sh
npm install
```

## Usage

### Development

```sh
npm run dev
```

### Build

```sh
npm run build
```

### Preview

```sh
npm run preview
```

## Test Document

The benchmark uses `complex.html` from the css-selector-generator test suite, which contains a realistic web application interface with nested elements, multiple classes, IDs, and various attribute combinations.

## Adding New Libraries

To add a new library to the benchmark:

1. Install the library: `npm install <library-name>`
2. Update `src/utils/benchmark.ts` to include the library
3. Add the GitHub URL to `src/components/BenchmarkTable.tsx`

## License

Unlicense

## Bug Reports & Feature Requests

If you found any bugs or have feature requests, please [file an issue at GitHub](https://github.com/fczbkk/css-selector-generator-benchmark/issues).
