import { useState } from 'react';
import type { BenchmarkResults } from '../utils/benchmark';

interface SelectorComparisonProps {
  results: BenchmarkResults;
}

export function SelectorComparison({ results }: SelectorComparisonProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const libraries = results.libraries;
  const elementCount = libraries[0]?.results.length || 0;

  return (
    <div className="selector-comparison">
      <button
        className="details-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? '▼' : '▶'} Selector Comparison
      </button>

      {isExpanded && (
        <div className="comparison-content">
          {Array.from({ length: elementCount }).map((_, index) => {
            const elementResults = libraries.map(lib => lib.results[index]);
            const element = elementResults[0]?.element;

            return (
              <div key={index} className="element-comparison">
                <div className="element-header">
                  <strong>Element {index + 1}:</strong>{' '}
                  {element && (
                    <span className="element-info">
                      {element.tagName.toLowerCase()}
                      {element.id && `#${element.id}`}
                      {element.className &&
                        `.${element.className.toString().split(' ').slice(0, 2).join('.')}`
                      }
                    </span>
                  )}
                </div>
                <div className="selector-rows">
                  {libraries.map((lib) => {
                    const result = lib.results[index];
                    const selector = result?.selector || '(failed)';
                    const selectorClass = !result?.selector
                      ? 'failed'
                      : !result.isUnique
                      ? 'not-unique'
                      : '';

                    return (
                      <div key={lib.name} className={`selector-row ${selectorClass}`}>
                        <span className="library-name">{lib.name}</span>
                        <span className="selector-divider">|</span>
                        <span className="selector-value">{selector}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
