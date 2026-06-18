import { createYCloudIcon } from '@ycloud-web/icons-react/src/ycloud-react';
import { type YCloudIconsProps, type IconNode } from '@ycloud-web/icons-react/src/types';
import { IconEntity } from '../theme/types';
import { renderToStaticMarkup } from 'react-dom/server';
import { IconContent } from './generateZip';

const getFallbackZip = (icons: IconEntity[], params: YCloudIconsProps) => {
  return icons.map<IconContent>((icon) => {
    const Icon = createYCloudIcon(icon.name, icon.iconNode as IconNode);
    const src = renderToStaticMarkup(<Icon {...params} />);
    return [icon.name, src];
  });
};

export default getFallbackZip;
