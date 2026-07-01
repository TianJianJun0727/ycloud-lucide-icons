// className is not supported in svg elements
export type SVGProps = Record<string, string | number | undefined>;

export type IconNode =
  | [tag: string, attrs: SVGProps]
  | [tag: string, attrs: SVGProps, children: IconNode[]];

export type IconData = {
  name: string;
  attrs: SVGProps;
  node: IconNode[];
  aliases?: string[];
};

export type Icons = { [key: string]: IconData };
