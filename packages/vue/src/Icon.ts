import { computed, type FunctionalComponent, h } from 'vue';
import { isEmptyString, mergeClasses, toKebabCase, toPascalCase } from '@ycloud-web/shared';
import defaultAttributes from './defaultAttributes';
import { IconNode, YCloudIconsProps } from './types';
import { useYCloudIconsProps } from './context';

interface IconProps {
  iconNode: IconNode;
  name: string;
}

const Icon: FunctionalComponent<YCloudIconsProps & IconProps> = (
  {
    name,
    iconNode,
    absoluteStrokeWidth,
    'absolute-stroke-width': absoluteStrokeWidthKebabCase,
    strokeWidth,
    'stroke-width': strokeWidthKebabCase,
    size,
    color,
    ...props
  },
  { slots },
) => {
  const {
    size: contextSize,
    color: contextColor,
    strokeWidth: contextStrokeWidth = 2,
    absoluteStrokeWidth: contextAbsoluteStrokeWidth = false,
    class: contextClass = '',
  } = useYCloudIconsProps();

  const calculatedStrokeWidth = computed(() => {
    const isAbsoluteStrokeWidth =
      isEmptyString(absoluteStrokeWidth) ||
      isEmptyString(absoluteStrokeWidthKebabCase) ||
      absoluteStrokeWidth === true ||
      absoluteStrokeWidthKebabCase === true ||
      contextAbsoluteStrokeWidth === true;

    const strokeWidthValue =
      strokeWidth ||
      strokeWidthKebabCase ||
      contextStrokeWidth ||
      defaultAttributes['stroke-width'];

    if (isAbsoluteStrokeWidth) {
      return (
        (Number(strokeWidthValue) * 24) / Number(size ?? contextSize ?? defaultAttributes.width)
      );
    }

    return strokeWidthValue;
  });

  return h(
    'svg',
    {
      ...defaultAttributes,
      ...props,
      width: size ?? contextSize ?? defaultAttributes.width,
      height: size ?? contextSize ?? defaultAttributes.height,
      stroke: color ?? contextColor ?? defaultAttributes.stroke,
      'stroke-width': calculatedStrokeWidth.value,
      class: mergeClasses(
        'ycloud',
        contextClass,
        ...(name
          ? [`ycloud-${toKebabCase(toPascalCase(name))}-icon`, `ycloud-${toKebabCase(name)}`]
          : ['ycloud-icon']),
      ),
    },
    [...iconNode.map((child) => h(...child)), ...(slots.default ? [slots.default()] : [])],
  );
};

export default Icon;
