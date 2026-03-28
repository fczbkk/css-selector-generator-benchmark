import packageJson from '../../package.json';

type LibraryName = 'css-selector-generator' | '@medv/finder' | '@cypress/unique-selector';

interface LibraryCapability {
  support: boolean;
  note?: string;
}

interface Capability {
  name: string;
  description: string;
  libraries: Record<LibraryName, LibraryCapability>;
  hideIndicators?: boolean;
}

const LIBRARY_URLS: Record<LibraryName, string> = {
  'css-selector-generator': 'https://github.com/fczbkk/css-selector-generator',
  '@medv/finder': 'https://github.com/antonmedv/finder',
  '@cypress/unique-selector': 'https://github.com/cypress-io/unique-selector',
};

function getLibraryVersion(libraryName: LibraryName): string {
  const version = packageJson.dependencies[libraryName];
  return version ? version.replace(/^\^/, '') : 'unknown';
}

export function CapabilitiesComparison() {
  const capabilities: Capability[] = [
    {
      name: 'Current version',
      description: '',
      hideIndicators: true,
      libraries: {
        'css-selector-generator': { support: true, note: getLibraryVersion('css-selector-generator') },
        '@medv/finder': { support: true, note: getLibraryVersion('@medv/finder') },
        '@cypress/unique-selector': { support: true, note: getLibraryVersion('@cypress/unique-selector') },
      },
    },
    {
      name: 'Customization options',
      description: '',
      hideIndicators: true,
      libraries: {
        'css-selector-generator': { support: true, note: '10+ options: selector types, whitelist/blacklist, root, combining, optimization limits' },
        '@medv/finder': { support: true, note: 'Filter functions, optimization params, timeout' },
        '@cypress/unique-selector': { support: false, note: 'Only selector types array' },
      },
    },
    {
      name: 'Multiple elements',
      description: 'Generate a single selector that matches multiple elements at once',
      libraries: {
        'css-selector-generator': { support: true, note: 'Accepts array of elements, finds common selector' },
        '@medv/finder': { support: false },
        '@cypress/unique-selector': { support: false },
      },
    },
    {
      name: 'Multiple selectors',
      description: 'Generate multiple unique selectors for the same element(s)',
      libraries: {
        'css-selector-generator': { support: true, note: 'cssSelectorGenerator() returns iterator' },
        '@medv/finder': { support: false },
        '@cypress/unique-selector': { support: false },
      },
    },
    {
      name: 'Performance optimization',
      description: 'Options to control and limit selector generation performance',
      libraries: {
        'css-selector-generator': { support: true, note: 'maxCombinations and maxCandidates options limit computation' },
        '@medv/finder': { support: true, note: 'timeout control, threshold, maxNumberOfTries options' },
        '@cypress/unique-selector': { support: false },
      },
    },
    {
      name: 'Shadow DOM support',
      description: 'Generate selectors for elements within Shadow DOM',
      libraries: {
        'css-selector-generator': { support: true },
        '@medv/finder': { support: false, note: 'Not documented' },
        '@cypress/unique-selector': { support: true },
      },
    },
    {
      name: 'Filter functions',
      description: 'Custom validation functions to allow/disallow specific selector values',
      libraries: {
        'css-selector-generator': { support: true, note: 'whitelist/blacklist, with support for regex and filter functions' },
        '@medv/finder': { support: true, note: 'idName, className, tagName, attr filter functions' },
        '@cypress/unique-selector': { support: false },
      },
    },
  ];

  const libraryNames: LibraryName[] = ['css-selector-generator', '@medv/finder', '@cypress/unique-selector'];

  return (
    <div className="capabilities-comparison">
      <h2 className="section-heading">Library Capabilities Comparison</h2>
      <div className="table-container">
        <table className="capabilities-table">
          <thead>
            <tr>
              <th className="capability-header">Capability</th>
              {libraryNames.map((name) => (
                <th key={name} className="library-header">
                  <a
                    href={LIBRARY_URLS[name]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="library-link"
                  >
                    {name}
                  </a>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {capabilities.map((capability) => (
              <tr key={capability.name}>
                <td className="capability-name">
                  <strong>{capability.name}</strong>
                  {capability.description && (
                    <div className="capability-description">{capability.description}</div>
                  )}
                </td>
                {libraryNames.map((libName) => {
                  const lib = capability.libraries[libName];
                  return (
                    <td key={libName} className="capability-cell">
                      {!capability.hideIndicators && (
                        <div className="support-indicator">
                          {lib.support ? '✅' : '❌'}
                        </div>
                      )}
                      {lib.note && <div className="capability-note">{lib.note}</div>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
