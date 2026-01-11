/// <reference types="vite/client" />

declare module '*.css' {
  const content: string;
  export default content;
}

declare module '*.html?raw' {
  const content: string;
  export default content;
}

declare module '@cypress/unique-selector' {
  export default function unique(
    element: Element,
    options?: {
      selectorTypes?: string[];
    }
  ): string;
}
