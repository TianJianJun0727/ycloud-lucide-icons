declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, any>;
  export default component;
}

declare module '*.data.ts' {
  const data: any;

  export { data };
}

declare module '*.data' {
  const data: any;

  export { data };
}

declare module '*.wasm' {}

declare module '*.css' {}

declare module '*?raw' {
  const content: string;
  export default content;
}

declare module 'virtual:group-icons.css' {}

declare module 'vitepress/dist/client/theme-default/support/utils' {
  export function throttleAndDebounce<T extends (...args: any[]) => void>(fn: T, delay: number): T;
}

interface ImportMetaEnv {
  readonly BASE_URL: string;
  readonly DEV: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const resvg_wasm: RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

declare module 'node:module' {
  function createRequire(filename: string): NodeRequire;
}

declare module '*.node.json' {
  import type { IconNode } from '@ycloud-web/icons-vue';

  const value: IconNode;
  export default value;
}

declare global {
  interface Window {
    ExpoSnack?: {
      /**
       * Initialize all snack players on the page
       */
      initialize(): void;
      /**
       * Remove a snack player container
       */
      remove(container: Element): void;
      /**
       * Append/add a snack player container
       */
      append(container: Element): void;
    };
    Tally: {
      // From https://tally.so/help/developer-resources#2f676e40530a460ea6a634b8441f6001
      openPopup: (
        formId: string,
        options?: {
          key?: string; // This is used as a unique identifier used for the "Show only once" and "Don't show after submit" functionality
          layout?: 'default' | 'modal';
          width?: number;
          alignLeft?: boolean;
          hideTitle?: boolean;
          overlay?: boolean;
          emoji?: {
            text: string;
            animation:
              | 'none'
              | 'wave'
              | 'tada'
              | 'heart-beat'
              | 'spin'
              | 'flash'
              | 'bounce'
              | 'rubber-band'
              | 'head-shake';
          };
          autoClose?: number; // in milliseconds
          showOnce?: boolean;
          doNotShowAfterSubmit?: boolean;
          customFormUrl?: string; // when you want to load the form via it's custom domain URL
          hiddenFields?: {
            [key: string]: any;
          };
          onOpen?: () => void;
          onClose?: () => void;
          onPageView?: (page: number) => void;
          onSubmit?: (payload: SubmissionPayload) => void;
        },
      ) => void;
    };
  }
}
