import type { LibraryStats } from '../utils/benchmark';

interface BenchmarkTableProps {
  libraries: LibraryStats[];
}

const LIBRARY_URLS: Record<string, string> = {
  'css-selector-generator': 'https://github.com/fczbkk/css-selector-generator',
  'css-selector-generator (custom options)': 'https://github.com/fczbkk/css-selector-generator',
  '@medv/finder': 'https://github.com/antonmedv/finder',
  '@cypress/unique-selector': 'https://github.com/cypress-io/unique-selector',
};

export function BenchmarkTable({ libraries }: BenchmarkTableProps) {
  const getMetric = (stats: LibraryStats, metric: string): string | number => {
    const successRate = (stats.successCount / stats.totalCount) * 100;
    const uniqueRate = (stats.uniqueCount / stats.totalCount) * 100;

    switch (metric) {
      case 'totalElements':
        return stats.totalCount;
      case 'selectorsGenerated':
        return `${stats.successCount} (${successRate.toFixed(1)}%)`;
      case 'uniqueSelectors':
        return `${stats.uniqueCount} (${uniqueRate.toFixed(1)}%)`;
      case 'totalTime':
        return `${stats.totalTime.toFixed(2)}ms`;
      case 'averageTime':
        return `${stats.averageTime.toFixed(3)}ms`;
      case 'fastestTime':
        return `${stats.fastestTime.toFixed(3)}ms`;
      case 'slowestTime':
        return `${stats.slowestTime.toFixed(3)}ms`;
      case 'avgSelectorLength':
        return stats.averageSelectorLength.toFixed(1);
      case 'shortestSelector':
        return stats.shortestSelector;
      case 'longestSelector':
        return stats.longestSelector;
      default:
        return '';
    }
  };

  const getCellClass = (stats: LibraryStats, metric: string): string => {
    const successRate = (stats.successCount / stats.totalCount) * 100;
    const uniqueRate = (stats.uniqueCount / stats.totalCount) * 100;

    if (metric === 'selectorsGenerated') {
      return successRate === 100 ? 'success' : 'warning';
    }
    if (metric === 'uniqueSelectors') {
      return uniqueRate === 100 ? 'success' : 'error';
    }
    return '';
  };

  const metrics = [
    { key: 'totalElements', label: 'Total Elements' },
    { key: 'selectorsGenerated', label: 'Selectors Generated' },
    { key: 'uniqueSelectors', label: 'Unique Selectors' },
    { key: 'totalTime', label: 'Total Time' },
    { key: 'averageTime', label: 'Average Time' },
    { key: 'fastestTime', label: 'Fastest Time' },
    { key: 'slowestTime', label: 'Slowest Time' },
    { key: 'avgSelectorLength', label: 'Avg Selector Length' },
    { key: 'shortestSelector', label: 'Shortest Selector' },
    { key: 'longestSelector', label: 'Longest Selector' },
  ];

  return (
    <div className="table-container">
      <table className="benchmark-table">
        <thead>
          <tr>
            <th>Metric</th>
            {libraries.map((lib) => (
              <th key={lib.name}>
                <a
                  href={LIBRARY_URLS[lib.name]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="library-link"
                >
                  {lib.name}
                </a>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {metrics.map((metric) => (
            <tr key={metric.key}>
              <td className="metric-label">{metric.label}</td>
              {libraries.map((lib) => (
                <td key={lib.name} className={getCellClass(lib, metric.key)}>
                  {getMetric(lib, metric.key)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
