import { TestBed } from '@angular/core/testing';
import { YCLOUD_CONFIG, ycloudDefaultConfig, provideYCloudConfig } from './ycloud-config';

describe('YCloud config', () => {
  describe('YCLOUD_CONFIG', () => {
    it('should use default', () => {
      expect(TestBed.inject(YCLOUD_CONFIG)).toBe(ycloudDefaultConfig);
    });
  });
  describe('provideYCloudConfig', () => {
    it('should use defaults', () => {
      TestBed.configureTestingModule({
        providers: [
          provideYCloudConfig({
            size: 18,
          }),
        ],
      });
      expect(TestBed.inject(YCLOUD_CONFIG)).toEqual({
        ...ycloudDefaultConfig,
        size: 18,
      });
    });
  });
});
