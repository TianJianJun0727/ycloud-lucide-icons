import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/svelte';
import { Smile, Pen, Edit2 } from '../src/icons.js';
import TestSlots from './TestSlots.svelte';
import ContextWrapper from './ContextWrapper.svelte';

describe('Using ycloud icon components', () => {
  afterEach(() => cleanup());
  it('should render an component', () => {
    const { container } = render(Smile);
    const icon = container.firstElementChild;

    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('width', '24');
    expect(icon).toHaveAttribute('height', '24');
    expect(icon).toHaveAttribute('viewBox', '0 0 24 24');
    expect(icon).toHaveAttribute('class', 'ycloud-icon ycloud ycloud-smile');
  });

  it('should adjust the size, stroke color and stroke width', () => {
    const { container } = render(Smile, {
      size: 48,
      color: 'red',
      strokeWidth: 4,
    });

    const icon = container.firstElementChild;

    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('width', '48');
    expect(icon).toHaveAttribute('height', '48');
    expect(icon).toHaveAttribute('stroke', 'red');
    expect(icon).toHaveAttribute('stroke-width', '4');
  });

  it('should add a class to the element', () => {
    const testClass = 'my-icon';
    const { container } = render(Smile, {
      class: testClass,
    });

    const IconComponent = container.firstElementChild;

    expect(IconComponent).toBeInTheDocument();
    expect(IconComponent).toHaveClass(testClass);
    expect(IconComponent).toHaveClass('ycloud');
    expect(IconComponent).toHaveClass('ycloud-smile');
  });

  it('should add a style attribute to the element', () => {
    const { container } = render(Smile, {
      style: 'position: absolute;',
    });

    const IconComponent = container.firstElementChild;

    expect(IconComponent).toHaveAttribute('style', 'position: absolute;');
  });

  it('should render an icon slot', () => {
    const { container, getByText } = render(TestSlots);

    const textElement = getByText('Test');
    expect(textElement).toBeInTheDocument();
    const IconComponent = container.querySelector('svg');

    expect(IconComponent).toBeInTheDocument();
    expect(IconComponent).toHaveAttribute('class', 'ycloud-icon ycloud ycloud-smile');
  });

  it('should render the alias icon', () => {
    const { container } = render(Pen);

    const PenIconRenderedHTML = container.innerHTML;

    cleanup();

    const { container: Edit2Container } = render(Edit2);

    expect(PenIconRenderedHTML).toBe(Edit2Container.innerHTML);
  });

  it('should not scale the strokeWidth when absoluteStrokeWidth is set', () => {
    const { container } = render(Smile, {
      color: 'red',
      size: 48,
      absoluteStrokeWidth: true,
    });

    const IconComponent = container.firstElementChild;

    expect(IconComponent).toHaveAttribute('width', '48');
    expect(IconComponent).toHaveAttribute('height', '48');
    expect(IconComponent).toHaveAttribute('stroke', 'red');
    expect(IconComponent).toHaveAttribute('stroke-width', '1');
  });

  it('should use context values from the global set properties', () => {
    const { container } = render(ContextWrapper);

    const IconComponent = container.firstElementChild;

    expect(IconComponent).toHaveAttribute('width', '32');
    expect(IconComponent).toHaveAttribute('height', '32');
    expect(IconComponent).toHaveAttribute('stroke', 'red');
    expect(IconComponent).toHaveAttribute('stroke-width', '1');
  });
});

describe('Icon Component Accessibility', () => {
  it('should have aria-hidden prop when no aria prop or children are present', async () => {
    const { container } = render(Smile, {
      props: {
        size: 48,
        color: 'red',
        absoluteStrokeWidth: true,
      },
    });

    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('should not have aria-hidden prop when there are children that could be a <title> element', async () => {
    const { container } = render(TestSlots);

    expect(container.firstChild).not.toHaveAttribute('aria-hidden');
  });
});
