<script lang="ts">
  import defaultAttributes from './defaultAttributes.js';
  import type { IconProps } from './types.js';
  import { hasA11yProp } from './utils/hasA11yProp.js';
  import { getYCloudContext } from './context.js';

  const globalProps = getYCloudContext() ?? {};

  const {
    name,
    color = globalProps.color ?? 'currentColor',
    size = globalProps.size ?? 24,
    strokeWidth = globalProps.strokeWidth ?? 2,
    absoluteStrokeWidth = globalProps.absoluteStrokeWidth ?? false,
    iconNode = [],
    children,
    ...props
  }: IconProps = $props();

  const calculatedStrokeWidth = $derived(
    absoluteStrokeWidth ? (Number(strokeWidth) * 24) / Number(size) : strokeWidth,
  );
</script>

<svg
  {...defaultAttributes}
  {...!children && !hasA11yProp(props) && { 'aria-hidden': 'true' }}
  {...props}
  width={size}
  height={size}
  stroke={color}
  stroke-width={calculatedStrokeWidth}
  class={['ycloud-icon ycloud', globalProps.class, name && `ycloud-${name}`, props.class]}
>
  {#each iconNode as [tag, attrs]}
    <svelte:element
      this={tag as string}
      {...attrs}
    />
  {/each}
  {@render children?.()}
</svg>
