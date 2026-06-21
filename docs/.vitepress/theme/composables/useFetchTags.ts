import { shallowRef } from 'vue';

const useFetchTags = () =>
  ({
    data: shallowRef<Record<string, string[]> | null>(null),
    execute: () => Promise.resolve(null),
  }) as const;

export default useFetchTags;
