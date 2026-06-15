import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { BenchmarkTable } from './components/BenchmarkTable';
import { CapabilitiesComparison } from './components/CapabilitiesComparison';
import { SelectorComparison } from './components/SelectorComparison';
import { runBenchmark, type BenchmarkResults, type BenchmarkProgress } from './utils/benchmark';
import simpleHtml from './data/simple.html?raw';
import complexHtml from './data/complex.html?raw';

type HtmlPreset = 'simple' | 'complex';

const HTML_PRESETS: Record<HtmlPreset, string> = {
  simple: simpleHtml,
  complex: complexHtml,
};

function App() {
  const [results, setResults] = useState<BenchmarkResults | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState<BenchmarkProgress | null>(null);
  const htmlContentRef = useRef(simpleHtml);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isHtmlEditorExpanded, setIsHtmlEditorExpanded] = useState(false);

  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.value = htmlContentRef.current;
    const handleInput = () => { htmlContentRef.current = el.value; };
    el.addEventListener('input', handleInput);
    return () => el.removeEventListener('input', handleInput);
  }, [isHtmlEditorExpanded]);

  const handlePresetChange = (preset: HtmlPreset) => {
    htmlContentRef.current = HTML_PRESETS[preset];
    if (textareaRef.current) {
      textareaRef.current.value = htmlContentRef.current;
    }
  };

  const handleRunBenchmark = async () => {
    setIsRunning(true);
    setResults(null);
    setProgress(null);

    // Use setTimeout to allow UI to update before heavy computation
    setTimeout(async () => {
      const benchmarkResults = await runBenchmark(
        textareaRef.current?.value ?? htmlContentRef.current,
        (prog) => {
          setProgress(prog);
        }
      );
      setResults(benchmarkResults);
      setIsRunning(false);
      setProgress(null);
    }, 100);
  };

  // Run benchmark automatically on page load
  useEffect(() => {
    handleRunBenchmark();
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>CSS Selector Generator Benchmark</h1>
        <nav className="header-nav">
          <a href="#benchmark-results">Benchmark Results</a>
          <a href="#library-capabilities">Library Capabilities Comparison</a>
        </nav>
      </header>

      <main className="main">
        <div className="html-editor-section">
          <button
            className="html-editor-toggle"
            onClick={() => setIsHtmlEditorExpanded(!isHtmlEditorExpanded)}
          >
            {isHtmlEditorExpanded ? '▼' : '▶'} Custom HTML
          </button>
          {isHtmlEditorExpanded && (
            <>
              <div className="html-presets">
                <span>Load preset:</span>
                <button
                  className="preset-button"
                  onClick={() => handlePresetChange('simple')}
                >
                  Simple
                </button>
                <button
                  className="preset-button"
                  onClick={() => handlePresetChange('complex')}
                >
                  Complex
                </button>
              </div>
              <textarea
                ref={textareaRef}
                className="html-editor"
                placeholder="Enter your HTML here..."
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
            </>
          )}
        </div>

        <div className="controls">
          <button className="button" onClick={handleRunBenchmark} disabled={isRunning}>
            {isRunning ? 'Running benchmark...' : 'Re-run Benchmark'}
          </button>
        </div>

        {isRunning && progress && (
          <div className="loading">
            Testing {progress.libraryName}: {progress.currentElement}/{progress.totalElements} elements
          </div>
        )}

        {results && (
          <div className="results" id="benchmark-results">
            <BenchmarkTable libraries={results.libraries} />

            <SelectorComparison results={results} />
          </div>
        )}

        <div id="library-capabilities">
          <CapabilitiesComparison />
        </div>
      </main>
    </div>
  );
}

export default App;
