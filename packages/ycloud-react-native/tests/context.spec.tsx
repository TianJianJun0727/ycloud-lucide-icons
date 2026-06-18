import { cleanup, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { House, YCloudIconsProvider } from '../src/ycloud-react-native';

vi.mock('react-native-svg');

describe('Using YCloudIconsProvider', () => {
  it('should render the icon with YCloudIconsProvider', () => {
    cleanup();
    const { container } = render(
      <YCloudIconsProvider>
        <House />
      </YCloudIconsProvider>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render the icon with YCloudIconsProvider and custom strokeWidth', () => {
    cleanup();
    const testId = 'house-icon';
    const { getByTestId } = render(
      <YCloudIconsProvider
        size={48}
        color="red"
        strokeWidth={4}
      >
        <House testID={testId} />
      </YCloudIconsProvider>,
    );

    const IconComponent = getByTestId(testId);

    expect(IconComponent).toHaveAttribute('width', '48');
    expect(IconComponent).toHaveAttribute('height', '48');
    expect(IconComponent).toHaveAttribute('stroke', 'red');
    expect(IconComponent).toHaveAttribute('stroke-width', '4');
  });

  it('should render the icon with YCloudIconsProvider and custom absoluteStrokeWidth', () => {
    cleanup();
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
    cleanup();
    const { container } = render(
      <YCloudIconsProvider
        size={48}
        color="red"
        strokeWidth={4}
      >
        <House
          size={32}
          color="blue"
          strokeWidth={3}
        />
      </YCloudIconsProvider>,
    );

    const IconComponent = container.firstElementChild;

    expect(IconComponent).toHaveAttribute('width', '32');
    expect(IconComponent).toHaveAttribute('height', '32');
    expect(IconComponent).toHaveAttribute('stroke', 'blue');
    expect(IconComponent).toHaveAttribute('stroke-width', '3');
  });
});
