import { YCloudBuildParams, YCloudIconData } from './types';
import buildYCloudSvg from './buildYCloudSvg';

/**
 * Creates a base64 encoded data URI from a YCloud icon object.
 *
 * @param icon The icon to build.
 * @param params Additional build parameters.
 */
function buildYCloudDataUri(icon: YCloudIconData, params: YCloudBuildParams = {}) {
  const svg = buildYCloudSvg(icon, params);

  // Browser
  if (typeof btoa === 'function') {
    // Ensure proper UTF-8 handling before base64
    const utf8Bytes = new TextEncoder().encode(svg);
    let binary = '';
    for (const element of utf8Bytes) binary += String.fromCodePoint(element);
    return `data:image/svg+xml;base64,${btoa(binary)}`;
  }

  // Node.js (and other JS runtimes with Buffer)
  if (typeof Buffer !== 'undefined') {
    return `data:image/svg+xml;base64,${Buffer.from(svg, 'utf8').toString('base64')}`;
  }

  throw new Error('No base64 encoder available in this environment.');
}

export default buildYCloudDataUri;
