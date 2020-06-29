# CSS Selector Generator Benchmark

This is an attempt to create a benchmark for various JavaScript libraries for generating CSS selectors. It is inspired by @dandv's [question](https://github.com/fczbkk/css-selector-generator/issues/2).

## Benchmarks

| library                                                                     | unique | matching | average speed | longest selector | version | last update |
| :-------------------------------------------------------------------------- | :----: | :------: | ------------: | ---------------: | :------ | :---------- |
| [css-selector-generator](https://github.com/fczbkk/css-selector-generator/) |    ✅   |     ✅    |       0.661ms |              206 | 2.1.1   | 2020-6-18   |
| [simmerjs](https://github.com/gmmorris/simmerjs#readme)                     |    ❌   |     ❌    |       0.134ms |               78 | 0.5.6   | 2017-6-27   |
| [@medv/finder](https://github.com/antonmedv/finder)                         |    ✅   |     ✅    |       0.362ms |               52 | 2.0.0   | 2020-5-23   |
| [optimal-select](https://github.com/Autarc/optimal-select)                  |    ✅   |     ✅    |       0.169ms |               57 | 4.0.1   | 2017-1-7    |
| [selector-query](https://github.com/olivierrr/selector-query)               |    ❌   |     ❌    |       0.023ms |              338 | 1.0.1   | 2015-2-4    |
| [get-query-selector](https://github.com/thomaspeklak/get-query-selector)    |    ✅   |     ✅    |       0.013ms |              160 | 0.0.1   | 2013-11-11  |

## Notes

-   TODO

## Bug reports, feature requests and contact

If you found any bugs, if you have feature requests or any questions, please, either [file an issue at GitHub](https://github.com/fczbkk/css-selector-generator-benchmark/issues) or send me an e-mail at [riki@fczbkk.com](mailto:riki@fczbkk.com?subject=CSSSelectorGeneratorBenchmark)
