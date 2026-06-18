import { createContext, createElement, type ReactNode, useContext, useMemo } from 'react';

const YCloudContext = createContext<{
  size?: number;
  color?: string;
  strokeWidth?: number;
  absoluteStrokeWidth?: boolean;
}>({
  size: 24,
  color: 'currentColor',
  strokeWidth: 2,
  absoluteStrokeWidth: false,
});

interface YCloudIconsProviderProps {
  children: ReactNode;
  size?: number;
  color?: string;
  strokeWidth?: number;
  absoluteStrokeWidth?: boolean;
}

export function YCloudIconsProvider({
  children,
  size,
  color,
  strokeWidth,
  absoluteStrokeWidth,
}: YCloudIconsProviderProps) {
  const value = useMemo(
    () => ({
      size,
      color,
      strokeWidth,
      absoluteStrokeWidth,
    }),
    [size, color, strokeWidth, absoluteStrokeWidth],
  );

  return createElement(YCloudContext.Provider, { value }, children);
}

export const useYCloudContext = () => useContext(YCloudContext);
