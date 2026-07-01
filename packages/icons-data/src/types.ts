export type SVGProps = Record<string, string | number | undefined>;

/**
 * A YCloud icon node (an svgson-like internal format)
 */
export type YCloudIconNode =
  | [attrName: string, attributes: SVGProps]
  | [attrName: string, attributes: SVGProps, children: YCloudIconNode[]];

/**
 * A YCloud icon object that fully describes an icon to be displayed.
 */
export type YCloudIconData = {
  name: string;
  attrs: SVGProps;
  node: YCloudIconNode[];
  aliases?: string[];
  colorMode?: 'mono' | 'duotone' | 'multicolor';
};

/**
 * Build parameters for creating a YCloud icon instance for display.
 */
export type YCloudBuildParams = {
  /**
   * The color of the icon.
   */
  color?: string;
  /**
   * The stroke width.
   */
  strokeWidth?: number;
  /**
   * Adds [`vector-effect="non-scaling-stroke"`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/vector-effect) to child elements.
   */
  absoluteStrokeWidth?: boolean;
  /**
   * Extra CSS class names to pass to the SVG element.
   */
  className?: string;
  /**
   * Any extra attributes to pass to the SVG element.
   */
  attributes?: SVGProps;
} & ({ size?: number } | { width?: number; height?: number });
