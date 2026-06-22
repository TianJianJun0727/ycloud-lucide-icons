import { describe, expect, it } from 'vitest';
import { normalizeTagPairs, normalizeUseCases, parseCliArgs } from './polishIconTagsByCategory.mts';

describe('parseCliArgs', () => {
  it('parses category batch options', () => {
    expect(
      parseCliArgs([
        '--',
        '--category',
        'medical,science',
        '--icon',
        'activity.json,brain',
        '--limit',
        '12',
        '--batch-size',
        '3',
        '--concurrency',
        '4',
        '--start-after',
        'activity.json',
        '--use-cases',
        '--write',
      ]),
    ).toEqual({
      categories: ['medical', 'science'],
      icons: ['activity', 'brain'],
      limit: 12,
      batchSize: 3,
      concurrency: 4,
      startAfter: 'activity',
      write: true,
      list: false,
      useCases: true,
    });
  });

  it('rejects unknown options', () => {
    expect(() => parseCliArgs(['--unknown'])).toThrow('Unknown option: --unknown');
  });
});

describe('normalizeUseCases', () => {
  it('keeps translated use-cases paired and removes duplicate pairs', () => {
    expect(
      normalizeUseCases(
        ['调试代码问题', '报告软件缺陷', '调试代码问题'],
        ['Debugging code issues', 'Reporting software defects', 'Debugging code issues'],
      ),
    ).toEqual({
      useCasesZh: ['调试代码问题', '报告软件缺陷'],
      useCasesEn: ['Debugging code issues', 'Reporting software defects'],
    });
  });

  it('rejects mismatched use-case lengths', () => {
    expect(() => normalizeUseCases(['调试代码问题'], [])).toThrow(
      'AI returned mismatched use-case lengths: zh=1, en=0',
    );
  });
});

describe('normalizeTagPairs', () => {
  it('deduplicates Chinese and English tags independently', () => {
    expect(
      normalizeTagPairs(['波形', '急救', '波形', '医疗'], ['waveform', 'first aid', 'waveform']),
    ).toEqual({
      tagsZh: ['波形', '急救', '医疗'],
      tagsEn: ['waveform', 'first aid'],
    });
  });

  it('rejects empty Chinese or English tag results', () => {
    expect(() => normalizeTagPairs([''], ['waveform'])).toThrow(
      'AI returned no usable Chinese tags.',
    );
    expect(() => normalizeTagPairs(['波形'], [''])).toThrow('AI returned no usable English tags.');
  });
});
