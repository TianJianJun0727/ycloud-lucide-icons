import { shallowRef } from 'vue';

const useFetchCategories = () =>
  ({
    data: shallowRef<Record<string, string[]> | null>(null),
    execute: () => Promise.resolve(null),
  }) as const;

export default useFetchCategories;
