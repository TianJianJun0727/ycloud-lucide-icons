import { describe, it, expect } from 'vitest';
import { createYCloudIcon } from '../src/icons';
import { airVent } from './testIconNodes';
import { render } from './utils';

describe('Using createYCloudIcon', () => {
  it('should create a component from an iconNode', async () => {
    const AirVent = createYCloudIcon('AirVent', airVent);
    const { container } = await render(AirVent);

    expect(container.innerHTML).toBeDefined();
    expect(container.innerHTML).toMatchSnapshot();
  });
});
