---
title: With YCloud Icons Lab or custom icons - Svelte
description: Learn how to use YCloud Icons Lab or custom icons in your Svelte applications using the Icon component.
---

# With YCloud Icons Lab or custom icons

[YCloud Icons Lab](https://github.com/TianJianJun0727/ycloud-icons-lab) is a collection of icons that are not part of the YCloud Icons main library.

They can be used by using the `Icon` component.
All props like regular ycloud icons can be passed to adjust the icon appearance.

## Using the `Icon` component

This creates a single icon based on the iconNode passed and renders a YCloud icon component.

```svelte
<script>
import { Icon } from '@ycloud-web/icons-svelte';
import { pear, sausage } from '@ycloud-web/icons-lab';
</script>

<Icon iconNode={pear} />
<Icon iconNode={sausage} color="red"/>
```
