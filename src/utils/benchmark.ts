import { getCssSelector } from 'css-selector-generator';
import { finder } from '@medv/finder';
// @ts-ignore - CommonJS module
import uniqueSelector from '@cypress/unique-selector/lib/index.js';

const unique = uniqueSelector.default || uniqueSelector;

export interface LibraryResult {
  element: Element;
  selector: string | null;
  time: number;
  isUnique: boolean;
  matchCount: number;
}

export interface LibraryStats {
  name: string;
  totalTime: number;
  successCount: number;
  totalCount: number;
  uniqueCount: number;
  fastestTime: number;
  slowestTime: number;
  averageTime: number;
  shortestSelector: number;
  longestSelector: number;
  averageSelectorLength: number;
  results: LibraryResult[];
}

export interface BenchmarkResults {
  libraries: LibraryStats[];
  htmlContent: string;
}

export interface BenchmarkProgress {
  libraryName: string;
  currentElement: number;
  totalElements: number;
}

function getAllElements(container: HTMLElement): Element[] {
  const elements: Element[] = [];
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_ELEMENT,
    null
  );

  let node;
  while ((node = walker.nextNode())) {
    elements.push(node as Element);
  }

  return elements;
}

function testSelector(
  selector: string | null,
  element: Element,
  container: HTMLElement
): { isUnique: boolean; matchCount: number } {
  if (!selector) {
    return { isUnique: false, matchCount: 0 };
  }

  try {
    const matches = container.querySelectorAll(selector);
    const matchCount = matches.length;
    const isUnique = matchCount === 1 && matches[0] === element;
    return { isUnique, matchCount };
  } catch (e) {
    return { isUnique: false, matchCount: 0 };
  }
}

async function runLibraryBenchmark(
  name: string,
  elements: Element[],
  container: HTMLElement,
  generator: (element: Element) => string | null,
  onProgress?: (progress: BenchmarkProgress) => void
): Promise<LibraryStats> {
  const results: LibraryResult[] = [];
  let totalTime = 0;
  let successCount = 0;
  let uniqueCount = 0;
  let fastestTime = Infinity;
  let slowestTime = 0;
  const selectorLengths: number[] = [];

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];

    // Report progress and allow UI to update
    if (onProgress) {
      onProgress({
        libraryName: name,
        currentElement: i + 1,
        totalElements: elements.length,
      });
      // Allow UI to update every 10 elements
      if (i % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }

    const startTime = performance.now();
    let selector: string | null = null;

    try {
      selector = generator(element);
    } catch (e) {
      selector = null;
    }

    const endTime = performance.now();
    const time = endTime - startTime;

    totalTime += time;

    if (selector) {
      successCount++;
      selectorLengths.push(selector.length);
      fastestTime = Math.min(fastestTime, time);
      slowestTime = Math.max(slowestTime, time);
    }

    const { isUnique, matchCount } = testSelector(selector, element, container);

    if (isUnique) {
      uniqueCount++;
    }

    results.push({
      element,
      selector,
      time,
      isUnique,
      matchCount,
    });
  }

  const averageTime = totalTime / elements.length;
  const shortestSelector = selectorLengths.length > 0 ? Math.min(...selectorLengths) : 0;
  const longestSelector = selectorLengths.length > 0 ? Math.max(...selectorLengths) : 0;
  const averageSelectorLength =
    selectorLengths.length > 0
      ? selectorLengths.reduce((sum, len) => sum + len, 0) / selectorLengths.length
      : 0;

  return {
    name,
    totalTime,
    successCount,
    totalCount: elements.length,
    uniqueCount,
    fastestTime: fastestTime === Infinity ? 0 : fastestTime,
    slowestTime,
    averageTime,
    shortestSelector,
    longestSelector,
    averageSelectorLength,
    results,
  };
}

export async function runBenchmark(
  htmlContent: string,
  onProgress?: (progress: BenchmarkProgress) => void
): Promise<BenchmarkResults> {
  // Create an iframe to test in real DOM
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument || iframe.contentWindow!.document;
  iframeDoc.open();
  iframeDoc.write(`<!DOCTYPE html><html><head></head><body>${htmlContent}</body></html>`);
  iframeDoc.close();

  const container = iframeDoc.body;
  const elements = getAllElements(container);

  const cssSelectorGeneratorStats = await runLibraryBenchmark(
    'css-selector-generator',
    elements,
    container,
    (element) => getCssSelector(element, { root: container }),
    onProgress
  );

  const cssSelectorGeneratorLimitedStats = await runLibraryBenchmark(
    'css-selector-generator (custom options)',
    elements,
    container,
    (element) =>
      getCssSelector(element, {
        root: container,
        selectors: ['id', 'class', 'tag', 'nthchild'],
      }),
    onProgress
  );

  const finderStats = await runLibraryBenchmark(
    '@medv/finder',
    elements,
    container,
    (element) => finder(element, { root: container }),
    onProgress
  );

  const uniqueSelectorStats = await runLibraryBenchmark(
    '@cypress/unique-selector',
    elements,
    container,
    (element) => unique(element),
    onProgress
  );

  // Clean up iframe
  document.body.removeChild(iframe);

  return {
    libraries: [
      cssSelectorGeneratorStats,
      cssSelectorGeneratorLimitedStats,
      finderStats,
      uniqueSelectorStats,
    ],
    htmlContent,
  };
}
