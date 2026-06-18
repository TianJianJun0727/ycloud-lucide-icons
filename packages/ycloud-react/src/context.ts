'use client';

import { createContext, createElement, type ReactNode, useContext, useMemo } from 'react';
import { YCloudIconsProps } from './types';

type YCloudConfig = {
  size: number;
  color: string;
  strokeWidth: number;
  absoluteStrokeWidth: boolean;
  className: string;
};

const YCloudContext = createContext<YCloudIconsProps>({});

type YCloudIconsProviderProps = {
  children: ReactNode;
} & Partial<YCloudConfig>;

export function YCloudIconsProvider({
  children,
  size,
  color,
  strokeWidth,
  absoluteStrokeWidth,
  className,
}: YCloudIconsProviderProps) {
  const value = useMemo(
    () => ({
      size,
      color,
      strokeWidth,
      absoluteStrokeWidth,
      className,
    }),
    [size, color, strokeWidth, absoluteStrokeWidth, className],
  );

  return createElement(YCloudContext.Provider, { value }, children);
}

export const useYCloudContext = () => useContext(YCloudContext);
