import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { isYCloudIconComponent, isYCloudIconData, YCloudIconInput } from './types';
import { YCloudIconBase } from './ycloud-icon-base';
import { YCLOUD_ICONS } from './ycloud-icons';
import { ycloudIconTemplate } from './ycloud-icon-template';

/**
 * Generic icon component for rendering YCloudIconData.
 */
@Component({
  selector: 'svg[ycloudIcon]',
  template: ycloudIconTemplate,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YCloudDynamicIcon extends YCloudIconBase {
  protected readonly icons = inject(YCLOUD_ICONS);
  public readonly ycloudIcon = input.required<YCloudIconInput | null>();

  protected override readonly icon = computed(() => {
    const icon = this.ycloudIcon();
    if (isYCloudIconData(icon)) {
      return icon;
    } else if (isYCloudIconComponent(icon)) {
      return icon.icon;
    } else if (typeof icon === 'string') {
      if (icon in this.icons) {
        return this.icons[icon];
      } else {
        throw new Error(`Unable to resolve icon '${icon}'`);
      }
    }
    return null;
  });
}
