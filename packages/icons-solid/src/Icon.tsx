import { For, splitProps, useContext } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import defaultAttributes from './defaultAttributes';
import type { IconNode, YCloudIconsProps } from './types';
import { YCloudContext } from './context';
import { hasA11yProp, mergeClasses, toKebabCase, toPascalCase } from '@ycloud-web/shared';

interface IconProps {
  name?: string;
  iconNode: IconNode;
}

const Icon = (props: YCloudIconsProps & IconProps) => {
  const [localProps, rest] = splitProps(props, [
    'color',
    'size',
    'strokeWidth',
    'children',
    'class',
    'name',
    'iconNode',
    'absoluteStrokeWidth',
  ]);

  const globalProps = useContext(YCloudContext);

  return (
    <svg
      {...defaultAttributes}
      width={localProps.size ?? globalProps.size ?? defaultAttributes.width}
      height={localProps.size ?? globalProps.size ?? defaultAttributes.height}
      stroke={localProps.color ?? globalProps.color ?? defaultAttributes.stroke}
      stroke-width={
        (localProps.absoluteStrokeWidth ?? globalProps.absoluteStrokeWidth) === true
          ? (Number(
              localProps.strokeWidth ??
                globalProps.strokeWidth ??
                defaultAttributes['stroke-width'],
            ) *
              24) /
            Number(localProps.size ?? globalProps.size)
          : Number(
              localProps.strokeWidth ??
                globalProps.strokeWidth ??
                defaultAttributes['stroke-width'],
            )
      }
      class={mergeClasses(
        'ycloud',
        'ycloud-icon',
        globalProps.class,
        ...(localProps.name != null
          ? [
              `ycloud-${toKebabCase(toPascalCase(localProps.name))}`,
              `ycloud-${toKebabCase(localProps.name)}`,
            ]
          : []),
        localProps.class,
      )}
      aria-hidden={!localProps.children && !hasA11yProp(rest) ? 'true' : undefined}
      {...rest}
    >
      <For each={localProps.iconNode}>
        {([elementName, attrs]) => {
          return (
            <Dynamic
              component={elementName}
              {...attrs}
            />
          );
        }}
      </For>
    </svg>
  );
};

export default Icon;
