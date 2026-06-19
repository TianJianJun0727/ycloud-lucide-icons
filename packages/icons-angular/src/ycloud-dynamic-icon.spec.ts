import { Component, input, inputBinding, signal, WritableSignal } from '@angular/core';
import { YCloudDynamicIcon } from './ycloud-dynamic-icon';
import { YCloudIconData, YCloudIconInput } from './types';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideYCloudIcons } from './ycloud-icons';
import { YCloudActivity } from './icons/activity';
import { By } from '@angular/platform-browser';

@Component({
  template: `@if (icon(); as iconData) {
    <svg [ycloudIcon]="iconData">
      <rect x="1" y="1" width="22" height="22" />
    </svg>
  }`,
  imports: [YCloudDynamicIcon],
})
class TestHostComponent {
  readonly icon = input<YCloudIconData>();
}

describe('YCloudDynamicIcon', () => {
  let component: YCloudDynamicIcon;
  let fixture: ComponentFixture<YCloudDynamicIcon>;
  let icon: WritableSignal<YCloudIconInput | null | undefined>;
  const getSvgAttribute = (attr: string) => fixture.nativeElement.getAttribute(attr);
  const testIcon: YCloudIconData = {
    name: 'demo',
    node: [['polyline', { points: '1 1 22 22' }]],
  };
  const testIcon2: YCloudIconData = {
    name: 'demo-other',
    node: [
      ['circle', { cx: 12, cy: 12, r: 8 }],
      ['polyline', { points: '1 1 22 22' }],
    ],
    aliases: ['demo-2'],
  };
  function createComponent() {
    return TestBed.createComponent(YCloudDynamicIcon, {
      inferTagName: true,
      bindings: [inputBinding('ycloudIcon', icon)],
    });
  }
  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideYCloudIcons(testIcon)],
    });
    icon = signal('demo');
    fixture = createComponent();
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render children', () => {
    icon.set(testIcon2);
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toBe(
      '<!--container--><circle cx="12" cy="12" r="8"></circle><polyline points="1 1 22 22"></polyline><!--ng-container-->',
    );
  });

  it('should remove children on change', () => {
    icon.set(null);
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toBe('<!--container--><!--ng-container-->');
  });

  describe('iconInput', () => {
    it('should support YCloudIconData input', () => {
      icon.set(testIcon);
      fixture.detectChanges();
      expect(component['icon']()).toBe(testIcon);
      expect(fixture.nativeElement.innerHTML).toBe(
        '<!--container--><polyline points="1 1 22 22"></polyline><!--ng-container-->',
      );
    });
    it('should support YCloudIcon input', () => {
      icon.set(YCloudActivity);
      fixture.detectChanges();
      expect(component['icon']()).toBe(YCloudActivity.icon);
    });
    it('should support string icon name', () => {
      icon.set('demo');
      fixture.detectChanges();
      expect(component['icon']()).toBe(testIcon);
    });
    it('should throw error if no icon found', () => {
      icon.set('invalid');
      expect(() => fixture.detectChanges()).toThrowError(`Unable to resolve icon 'invalid'`);
    });
  });

  describe('class', () => {
    it('should add all classes', () => {
      fixture.detectChanges();
      expect(getSvgAttribute('class')).toBe('ycloud ycloud-demo');
    });
    it('should add backwards compatible classes from aliases', () => {
      icon.set(testIcon2);
      fixture.detectChanges();
      expect(getSvgAttribute('class')).toBe('ycloud ycloud-demo-other ycloud-demo-2');
    });
    it('should add class icon if available', () => {
      icon.set(YCloudActivity);
      fixture.detectChanges();

      expect(getSvgAttribute('class')).toBe('ycloud ycloud-activity');
    });
    it('should remove class on change', () => {
      icon.set(null);
      fixture.detectChanges();
      expect(getSvgAttribute('class')).toBe('ycloud');
    });
  });

  describe('content projection', () => {
    it('should project content', () => {
      const hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.componentRef.setInput('icon', testIcon);
      hostFixture.detectChanges();
      hostFixture.componentRef.setInput('icon', testIcon2);
      hostFixture.detectChanges();
      const rect = hostFixture.debugElement.query(By.css('svg :last-child')).nativeElement;
      expect(rect).toBeInstanceOf(SVGElement);
      expect(rect.outerHTML).toBe('<rect x="1" y="1" width="22" height="22"></rect>');
    });
  });
});
