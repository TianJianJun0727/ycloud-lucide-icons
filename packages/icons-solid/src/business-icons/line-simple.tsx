import { mergeProps } from 'solid-js';
import type { BusinessIconImageProps } from '../businessTypes';

const dataUri =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22currentColor%22%3E%0A%20%20%3Cpath%0A%20%20%20%20d%3D%22M2.34961%204C2.34961%203.64101%202.64101%203.34961%203%203.34961C3.35899%203.34961%203.65039%203.64101%203.65039%204V18.9496C3.65039%2019.1705%203.82948%2019.3496%204.05039%2019.3496H21C21.359%2019.3496%2021.6504%2019.641%2021.6504%2020C21.6504%2020.359%2021.359%2020.6504%2021%2020.6504H3.34961C2.79732%2020.6504%202.34961%2020.2027%202.34961%2019.6504V4Z%22%0A%20%20%20%20fill%3D%22currentColor%22%0A%20%20%2F%3E%0A%20%20%3Cline%0A%20%20%20%20x1%3D%227.15%22%0A%20%20%20%20y1%3D%2212.65%22%0A%20%20%20%20x2%3D%227.15%22%0A%20%20%20%20y2%3D%2216.35%22%0A%20%20%20%20stroke%3D%22currentColor%22%0A%20%20%20%20stroke-width%3D%221.3%22%0A%20%20%20%20stroke-linecap%3D%22round%22%0A%20%20%2F%3E%0A%20%20%3Cline%0A%20%20%20%20x1%3D%2210.65%22%0A%20%20%20%20y1%3D%229.65%22%0A%20%20%20%20x2%3D%2210.65%22%0A%20%20%20%20y2%3D%2216.35%22%0A%20%20%20%20stroke%3D%22currentColor%22%0A%20%20%20%20stroke-width%3D%221.3%22%0A%20%20%20%20stroke-linecap%3D%22round%22%0A%20%20%2F%3E%0A%20%20%3Cline%0A%20%20%20%20x1%3D%2218.65%22%0A%20%20%20%20y1%3D%226.65%22%0A%20%20%20%20x2%3D%2218.65%22%0A%20%20%20%20y2%3D%2216.35%22%0A%20%20%20%20stroke%3D%22currentColor%22%0A%20%20%20%20stroke-width%3D%221.3%22%0A%20%20%20%20stroke-linecap%3D%22round%22%0A%20%20%2F%3E%0A%20%20%3Cline%0A%20%20%20%20x1%3D%2214.65%22%0A%20%20%20%20y1%3D%2210.65%22%0A%20%20%20%20x2%3D%2214.65%22%0A%20%20%20%20y2%3D%2216.35%22%0A%20%20%20%20stroke%3D%22currentColor%22%0A%20%20%20%20stroke-width%3D%221.3%22%0A%20%20%20%20stroke-linecap%3D%22round%22%0A%20%20%2F%3E%0A%3C%2Fsvg%3E%0A';

const LineSimple = (props: BusinessIconImageProps) => {
  const mergedProps = mergeProps(
    {
      src: dataUri,
      alt: '',
      get width() {
        return props.width ?? props.size ?? 24;
      },
      get height() {
        return props.height ?? props.size ?? 24;
      },
    },
    props,
  );

  return <img {...mergedProps} />;
};

export default LineSimple;
