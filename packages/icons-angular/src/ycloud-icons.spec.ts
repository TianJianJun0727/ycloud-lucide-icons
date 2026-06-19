import { TestBed } from '@angular/core/testing';
import {
  YCLOUD_ICONS,
  ycloudLegacyIcon,
  ycloudLegacyIconMap,
  provideYCloudIcons,
} from './ycloud-icons';
import { YCloudIconData } from './types';
import { YCloudCircle } from './icons/circle';

describe('YCloud icons', () => {
  describe('YCLOUD_ICONS', () => {
    it('should default to empty map', () => {
      expect(TestBed.inject(YCLOUD_ICONS)).toEqual({});
    });
  });
  describe('provideYCloudIcons', () => {
    const mockIcon: YCloudIconData = {
      name: 'mock-icon',
      node: [['polyline', { points: '1 1 22 22' }]],
    };
    const mockIcon2: YCloudIconData = {
      name: 'mock-icon-circle',
      node: [['circle', { cx: 12, cy: 12, r: 8 }]],
      aliases: ['mock-icon-2'],
    };
    const legacyIconNode: YCloudIconData['node'] = [['circle', { cx: 12, cy: 12, r: 8 }]];
    const legacyAlias = 'legacy-old-name';
    const OtherLegacyIcon = legacyIconNode;
    it('should accept list of icon object, icon components or legacy icons', () => {
      TestBed.configureTestingModule({
        providers: [
          provideYCloudIcons(
            mockIcon,
            mockIcon2,
            YCloudCircle,
            ycloudLegacyIcon('legacy-icon', legacyIconNode, [legacyAlias]),
            ...ycloudLegacyIconMap({ OtherLegacyIcon }),
          ),
        ],
      });
      const legacyIconData = {
        name: 'legacy-icon',
        node: legacyIconNode,
        aliases: [legacyAlias],
      };
      const otherLegacyIconData = {
        name: 'other-legacy-icon',
        node: legacyIconNode,
        aliases: ['OtherLegacyIcon'],
      };
      expect(TestBed.inject(YCLOUD_ICONS)).toEqual({
        'mock-icon': mockIcon,
        'mock-icon-circle': mockIcon2,
        'mock-icon-2': mockIcon2,
        'legacy-icon': legacyIconData,
        'legacy-old-name': legacyIconData,
        'other-legacy-icon': otherLegacyIconData,
        OtherLegacyIcon: otherLegacyIconData,
        ['circle']: YCloudCircle.icon,
      });
    });
  });
});
