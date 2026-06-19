<script setup>
import Sandpack from '~/.vitepress/theme/components/editors/Sandpack.vue'
</script>

# 在 Web 中使用 YCloud Icons

:::warning 不建议在高流量生产环境中使用
This library exports each svg as basic strings. We have a more optimized library for web. Which is smaller in size and supports color, size and strokeWidth. See [YCloud](../../ycloud/index.md).
:::

也可以通过 @ycloud-web/icons-static 包在 Web 项目中导入 SVG 字符串。每个图标都会以包含 SVG 标记的字符串导出，可用于客户端渲染。

::: sandpack {template=vanilla showTabs=false editorHeight=295 editorWidthPercentage=60 dependencies="@ycloud-web/icons-static"}

```html /index.html [active]
<!doctype html>
<html>
  <body>
    <div id="app"></div>

    <script src="index.js"></script>
  </body>
</html>
```

```js /index.js
import './styles.css';
import { Smile } from '@ycloud-web/icons-static';

document.getElementById('app').innerHTML = Smile;
```

:::

> 注意：每个图标名称都是 PascalCase。可以在 [YCloud Icons 页面](https://tianjianjun0727.github.io/ycloud-icons/icons)查看图标名称。
