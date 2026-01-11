import { useState } from 'react';
import type { LibraryStats } from '../utils/benchmark';

interface LibraryResultProps {
  stats: LibraryStats;
}

export function LibraryResult({ stats }: LibraryResultProps) {
  const [showDetails, setShowDetails] = useState(false);

  const successRate = (stats.successCount / stats.totalCount) * 100;
  const uniqueRate = (stats.uniqueCount / stats.totalCount) * 100;

  return (
    <div className="library-result">
      <h2>{stats.name}</h2>

      <div className="stats-grid">
        <div className="stat">
          <div className="stat-label">Total Elements</div>
          <div className="stat-value">{stats.totalCount}</div>
        </div>

        <div className="stat">
          <div className="stat-label">Selectors Generated</div>
          <div className={`stat-value ${successRate === 100 ? 'success' : 'warning'}`}>
            {stats.successCount} ({successRate.toFixed(1)}%)
          </div>
        </div>

        <div className="stat">
          <div className="stat-label">Unique Selectors</div>
          <div className={`stat-value ${uniqueRate === 100 ? 'success' : 'error'}`}>
            {stats.uniqueCount} ({uniqueRate.toFixed(1)}%)
          </div>
        </div>

        <div className="stat">
          <div className="stat-label">Total Time</div>
          <div className="stat-value">{stats.totalTime.toFixed(2)}ms</div>
        </div>

        <div className="stat">
          <div className="stat-label">Average Time</div>
          <div className="stat-value">{stats.averageTime.toFixed(3)}ms</div>
        </div>

        <div className="stat">
          <div className="stat-label">Fastest Time</div>
          <div className="stat-value">{stats.fastestTime.toFixed(3)}ms</div>
        </div>

        <div className="stat">
          <div className="stat-label">Slowest Time</div>
          <div className="stat-value">{stats.slowestTime.toFixed(3)}ms</div>
        </div>

        <div className="stat">
          <div className="stat-label">Avg Selector Length</div>
          <div className="stat-value">{stats.averageSelectorLength.toFixed(1)}</div>
        </div>

        <div className="stat">
          <div className="stat-label">Shortest Selector</div>
          <div className="stat-value">{stats.shortestSelector}</div>
        </div>

        <div className="stat">
          <div className="stat-label">Longest Selector</div>
          <div className="stat-value">{stats.longestSelector}</div>
        </div>
      </div>

      <button className="details-toggle" onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? 'Hide' : 'Show'} Details
      </button>

      {showDetails && (
        <div className="details">
          {stats.results.map((result, index) => {
            const className = !result.selector
              ? 'detail-item failed'
              : !result.isUnique
              ? 'detail-item not-unique'
              : 'detail-item';

            return (
              <div key={index} className={className}>
                <div>
                  <strong>Element {index + 1}:</strong> {result.element.tagName.toLowerCase()}
                  {result.element.id && `#${result.element.id}`}
                  {result.element.className && `.${result.element.className.split(' ').join('.')}`}
                </div>
                <div>
                  <strong>Selector:</strong> {result.selector || '(failed)'}
                </div>
                <div>
                  <strong>Time:</strong> {result.time.toFixed(3)}ms |{' '}
                  <strong>Matches:</strong> {result.matchCount} |{' '}
                  <strong>Unique:</strong> {result.isUnique ? 'Yes' : 'No'}
                  {result.selector && (
                    <>
                      {' | '}
                      <strong>Length:</strong> {result.selector.length}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
