import { render } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { House, YCloudIconsProvider } from '../src/ycloud-preact';

describe('Using YCloudIconsProvider', () => {
  it('should render the icon with YCloudIconsProvider', () => {
    const { container } = render(
      <YCloudIconsProvider
        size={48}
        color="red"
      >
        <House />
      </YCloudIconsProvider>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render the icon with YCloudIconsProvider and custom strokeWidth', () => {
    const { container } = render(
      <YCloudIconsProvider
        size={48}
        color="red"
        strokeWidth={4}
      >
        <House />
      </YCloudIconsProvider>,
    );

    const IconComponent = container.firstElementChild;

    expect(IconComponent).toHaveAttribute('width', '48');
    expect(IconComponent).toHaveAttribute('height', '48');
    expect(IconComponent).toHaveAttribute('stroke', 'red');
    expect(IconComponent).toHaveAttribute('stroke-width', '4');
  });

  it('should render the icon with YCloudIconsProvider and custom absoluteStrokeWidth', () => {
    const { container } = render(
      <YCloudIconsProvider
        size={48}
        color="red"
        absoluteStrokeWidth
      >
        <House />
      </YCloudIconsProvider>,
    );

    const IconComponent = container.firstElementChild;

    expect(IconComponent).toHaveAttribute('stroke-width', '1');
  });

  it("should override the provider's global props when passing props to the icon", () => {
    const { container } = render(
      <YCloudIconsProvider
        size={48}
        color="red"
        strokeWidth={4}
      >
        <House
          size={24}
          color="blue"
          strokeWidth={2}
        />
      </YCloudIconsProvider>,
    );

    const IconComponent = container.firstElementChild;

    expect(IconComponent).toHaveAttribute('width', '24');
    expect(IconComponent).toHaveAttribute('height', '24');
    expect(IconComponent).toHaveAttribute('stroke', 'blue');
    expect(IconComponent).toHaveAttribute('stroke-width', '2');
  });

  it('should merge class names from YCloudIconsProvider and icon props', () => {
    const { container } = render(
      <YCloudIconsProvider class="provider-class">
        <House class="icon-class" />
      </YCloudIconsProvider>,
    );

    const IconComponent = container.firstElementChild;

    expect(IconComponent).toHaveAttribute('class', 'ycloud provider-class ycloud-house icon-class');
  });
});
