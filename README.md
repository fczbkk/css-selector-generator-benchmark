# CSS Selector Generator Benchmark

This is an attempt to create a benchmark for various JavaScript libraries for generating CSS selectors. It is inspired by @dandv's [question](https://github.com/fczbkk/css-selector-generator/issues/2).

## Results

### @bimech [ellocate.js](https://github.com/bimech/ellocate.js)

* supports Bower
* depends on Jquery
* has tests
* has documentation
* no license
* average speed
* uses ID, class and tag selectors
* **WARNING:** doesn't use `nth-child` selectors, so it **produces a lot of non-unique selectors**

Longest selector:

```
html > body > div > div#wrap > div#main > div.container > div.main-content > div.row > div.span12 > div.row > div.span4.sidebar > div.block.clearfix > div.block-header.clearfix > div.block-action > a.btn.btn-success.btn-small > i.icon-plus.icon-white
```

### Chromium's [DOMPresentationUtils](https://chromium.googlesource.com/chromium/blink/+/master/Source/devtools/front_end/components/DOMPresentationUtils.js)

NOTE: [Used version adapted to use in browser from NPM.](https://www.npmjs.com/package/cssman)

* supports NPM
* no dependencies
* no tests
* has documentation
* see source code for license
* average speed
* uses ID, class, tag, attribute (for inputs) and `nth-child` child selectors
* **WARNING: produces a lot of non-unique selectors** in both optimized and non-optimized version

Example of non-unique selector:

```
div#main > div > div > div > div > div > div.span4.sidebar > div.block.clearfix > div.block-content > ul > li.show-all > a

[
  <a href=​"/​organizations">​Show all​</a>​,
  <a href=​"/​topics">​Show all​</a>​,
  <a href=​"/​topics?scope=starred">​Show all​</a>​,
  <a href=​"/​topics?scope=public">​Show all​</a>​
]
```

Longest selector:

```
div#main > div > div > div > div > div > div.span4.sidebar > div.block.clearfix > div.block-content > ul > li:nth-child(1) > a
```

### @desmondw [snowflake](https://github.com/desmondw/snowflake)

This is a Chrome extension, not a stand-alone library.

* average speed
* uses combination of tag and class or `nth-child`

Longest selector:

```
div.span12 > div:nth-of-type(1) > div:nth-of-type(1) > ul:nth-of-type(1) > li:nth-of-type(10) > div:nth-of-type(1) > div:nth-of-type(2) > span:nth-of-type(1)
```

### @fczbkk [css-selector-generator](https://github.com/fczbkk/css-selector-generator)

* supports Bower and NPM
* no dependencies
* has tests
* has documentation
* Unlicense license
* tries to use optimized ID, class, tag child selectors or their combination, uses `nth-child` as fallback
* generates **shortest selectors** among all tested libraries

Longest selector:

```
.span12 > :nth-child(1) > .span8 > ul > :nth-child(1) > :nth-child(1)
```

### @jhartikainen [dompath](https://github.com/jhartikainen/dompath)

* no support for Bower or NPM
* no dependencies
* has tests
* has documentation
* no license
* very fast
* uses ID or tagg + `nth-child` child selector, so the selectors tend to become quite long

Longest selector:

```
#main > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > ul:nth-child(2) > li:nth-child(10) > div:nth-child(2) > div:nth-child(2) > span:nth-child(4)
```

### @martinsbalodis [css-selector](https://github.com/martinsbalodis/css-selector)

Sorry, I wasn't able to make it work.


### @ngs [jquery-selectorator](https://github.com/ngs/jquery-selectorator)

* supports NPM and Bower
* depends on Jquery
* has tests
* has documentation
* MIT license
* **very slow**
* generates selectors using Jquery's `:eq()` selector, so most of the results are not valid CSS selectors and are only usable within Jquery

Longest selector: n/a


### @olivierrr [selector-query](https://github.com/olivierrr/selector-query)

* supports NPM only
* no dependencies
* no tests
* has documentation
* MIT license
* quite fast
* generates most complex descendant selector for each element (ID, class, tag, `nth-child`), so it produces **longest selectors** among tested libraries
* **WARNING:** uses descendant selectors instead of child selectors, so it sometimes **produces non-unique selectors**

Longest selector:

```
#main div.container:nth-child(1) div.main-content:nth-child(1) div.row:nth-child(1) div.span12:nth-child(1) div.row:nth-child(1) div.span4.sidebar:nth-child(2) div.block.clearfix:nth-child(2) div.block-header.clearfix:nth-child(1) div.block-action:nth-child(2) a.btn.btn-success.btn-small:nth-child(1) i.icon-plus.icon-white:nth-child(1)
```

### @rishihahs [domtalk](https://github.com/rishihahs/domtalk)

* supports NPM only
* no dependencies
* has tests
* has documentation
* MIT license
* very fast
* uses ID or `nth-child` descendant selector, selectors are of average length
* **WARNING:** uses descendant selectors instead of child selectors, so it **produces a lot of non-unique selectors**

Longest selector:

```
#wrap *:nth-child(1) *:nth-child(1) *:nth-child(1) *:nth-child(3) *:nth-child(1) *:nth-child(1) *:nth-child(1) *:nth-child(3) *:nth-child(11) *:nth-child(1) *:nth-child(1)
```

### @stevoland [CSSelector.js](https://github.com/stevoland/CSSelector.js)

* supports NPM (claims to support Bower, but I could not find it in the registry)
* supports AMD
* no dependencies
* no tests
* has documentation
* MIT license
* very fast
* uses ID or tag + `nth-child` child selectors, selectors are quite long

Longest selector:

```
#main > DIV:nth-child(1) > DIV:nth-child(1) > DIV:nth-child(1) > DIV:nth-child(1) > DIV:nth-child(1) > DIV:nth-child(1) > UL:nth-child(2) > LI:nth-child(10) > DIV:nth-child(2) > DIV:nth-child(2) > SPAN:nth-child(4)
```

### @thomaspeklak [get-query-selector](https://github.com/thomaspeklak/get-query-selector)

* supports NPM only
* no dependencies
* no tests
* has documentation
* looks like BSD license
* very fast
* uses ID or `nth-child` child selector, selectors are of average length

Longest selector:

```
#wrap>:nth-child(1)>:nth-child(1)>:nth-child(1)>:nth-child(3)>:nth-child(1)>:nth-child(1)>:nth-child(1)>:nth-child(3)>:nth-child(11)>:nth-child(1)>:nth-child(1)
```

### @tildeio [selector-generator](https://github.com/tildeio/selector-generator)

* no NPM or Bower
* requires RequireJS
* has tests
* no documentation
* looks like MIT license
* very fast
* uses tag or tag + `nth-child` child selectors
* **WARNING: produces a lot of non-unique selectors**

Longest selector:

```
html > body > div > div > div > div > div > div > div > div > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(2) > ul > li:nth-of-type(2) > a
```


## TODO

It would be nice to automate the process, run the tests in PhantomJS, etc. Pull requests are welcome.

## Bug reports, feature requests and contact

If you found any bugs, if you have feature requests or any questions, please, either [file an issue at GitHub](https://github.com/fczbkk/css-selector-generator-benchmark/issues) or send me an e-mail at [riki@fczbkk.com](mailto:riki@fczbkk.com?subject=CSSSelectorGeneratorBenchmark)
