import { useState, useEffect } from 'react';
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
  const [htmlContent, setHtmlContent] = useState(simpleHtml);
  const [isHtmlEditorExpanded, setIsHtmlEditorExpanded] = useState(false);

  const handlePresetChange = (preset: HtmlPreset) => {
    setHtmlContent(HTML_PRESETS[preset]);
  };

  const handleRunBenchmark = async () => {
    setIsRunning(true);
    setResults(null);
    setProgress(null);

    // Use setTimeout to allow UI to update before heavy computation
    setTimeout(async () => {
      const benchmarkResults = await runBenchmark(htmlContent, (prog) => {
        setProgress(prog);
      });
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
                className="html-editor"
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                placeholder="Enter your HTML here..."
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
