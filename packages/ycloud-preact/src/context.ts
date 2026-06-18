import { createContext, h, type ComponentChildren } from 'preact';
import { useContext, useMemo } from 'preact/hooks';

const YCloudContext = createContext<{
  size?: number;
  color?: string;
  strokeWidth?: number;
  absoluteStrokeWidth?: boolean;
  class?: string;
}>({
  size: 24,
  color: 'currentColor',
  strokeWidth: 2,
  absoluteStrokeWidth: false,
  class: '',
});

interface YCloudIconsProviderProps {
  children: ComponentChildren;
  size?: number;
  color?: string;
  strokeWidth?: number;
  absoluteStrokeWidth?: boolean;
  class?: string;
}

export function YCloudIconsProvider({
  children,
  size,
  color,
  strokeWidth,
  absoluteStrokeWidth,
  class: className,
}: YCloudIconsProviderProps) {
  const value = useMemo(
    () => ({
      size,
      color,
      strokeWidth,
      absoluteStrokeWidth,
      class: className,
    }),
    [size, color, strokeWidth, absoluteStrokeWidth, className],
  );

  return h(YCloudContext.Provider, { value }, children);
}

export const useYCloudContext = () => useContext(YCloudContext);
