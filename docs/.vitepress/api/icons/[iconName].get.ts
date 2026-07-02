import { eventHandler, getQuery, setResponseHeader, createError } from 'h3';
import iconNodes from '../../data/iconNodes';
import { createYCloudIcon } from '@ycloud-web/icons-react';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';

export default eventHandler((event) => {
  const { params } = event.context;

  const iconNode = iconNodes[params.iconName];

  if (iconNode == null) {
    const error = createError({
      statusCode: 404,
      message: `Icon "${params.iconName}" not found`,
    });

    return sendError(event, error);
  }

  const width = getQuery(event).width || undefined;
  const height = getQuery(event).height || undefined;
  const color = getQuery(event).color || undefined;
  const strokeWidth = getQuery(event).strokeWidth || undefined;
  const background = getQuery(event).background || undefined;

  const YCloudIcon = createYCloudIcon(params.iconName, iconNode);

  const svg = Buffer.from(
    renderToString(
      createElement(YCloudIcon, {
        width,
        height,
        color: color ? `#${color}` : undefined,
        strokeWidth,
        style: background ? { background } : undefined,
      }),
    ),
  ).toString('utf8');

  defaultContentType(event, 'image/svg+xml');
  setResponseHeader(event, 'Cache-Control', 'public,max-age=31536000');
  setResponseHeader(event, 'Access-Control-Allow-Origin', '*');

  return svg;
});
