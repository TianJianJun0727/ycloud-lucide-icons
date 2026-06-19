import base64SVG from '@ycloud-web/build-icons/utils/base64SVG';
import { getHTMLBanner } from './license.mts';
import defineExportTemplate from '@ycloud-web/build-icons/utils/defineExportTemplate';

export default defineExportTemplate(
  async ({ iconName, children, getSvg, deprecated, deprecationReason }) => {
    const svgContents = await getSvg();
    const svgBase64 = base64SVG(svgContents);

    return `\
${getHTMLBanner()}
<script lang="ts">
import Icon from '../Icon.svelte';
import type { IconNode, IconProps } from '../types.js';

let props: IconProps = $props();

const iconNode: IconNode = ${JSON.stringify(children)};
</script>

<!--
@component

YCloud SVG icon component, renders SVG Element with children.

@preview ![img](data:image/svg+xml;base64,${svgBase64}) - https://tianjianjun0727.github.io/ycloud-icons/icons/${iconName}
@see https://tianjianjun0727.github.io/ycloud-icons/guide/svelte - Documentation
${deprecated ? `\n@deprecated ${deprecationReason}\n` : ''}\
-->

<Icon name="${iconName}" {...props} iconNode={iconNode} />
`;
  },
);
