<script lang="ts">
  import Smile from '../src/icons/smile.svelte';
  import { setYCloudIconsProps } from '../src/icons.js';

  setYCloudIconsProps({
    size: 32,
    color: 'red',
    strokeWidth: 1,
    class: 'provider-class',
  });
</script>

<Smile aria-label="smile">
  <text>Test</text>
</Smile>
