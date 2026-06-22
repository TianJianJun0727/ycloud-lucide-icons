import { allowedNonChineseTermSet } from './data/allowedNonChineseTerms.mts';

export const hasCjk = (value: string) => /[\u3400-\u9fff]/.test(value);

export const hasLatinLetter = (value: string) => /[A-Za-z]/.test(value);

export const isSlugLike = (value: string) => /^[a-z0-9]+(?:[-_][a-z0-9]+)+$/.test(value.trim());

export const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

export const isMeaningfulArray = (value: unknown): value is string[] =>
  isStringArray(value) && value.length > 0;

export const isReviewedNonChineseTerm = (value: string) =>
  allowedNonChineseTermSet.has(value.trim());

export const isValidChineseSideText = (value: string) =>
  hasCjk(value) || isReviewedNonChineseTerm(value);

export const hasUnreviewedNonChineseTerm = (value: string) =>
  !hasCjk(value) && hasLatinLetter(value) && !isReviewedNonChineseTerm(value);

export const hasInvalidChineseSideUseCases = (value: unknown) =>
  isStringArray(value) &&
  value.some((useCase) => useCase.trim().length > 0 && !isValidChineseSideText(useCase));

export const uniqueList = (items: string[]) =>
  items.filter((item, index, list) => list.indexOf(item) === index);
