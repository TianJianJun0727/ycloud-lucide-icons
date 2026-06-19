<script setup>
import Sandpack from '~/.vitepress/theme/components/editors/Sandpack.vue'
</script>

# 在 Node.js 中使用 YCloud Icons

也可以通过 @ycloud-web/icons-static 包在 Node.js 项目中导入 YCloud Icons。
每个图标都会以包含 SVG 标记的字符串导出，可用于服务端渲染或静态站点生成。

::: code-group

```js [ESM]
import { MessageSquare } from '@ycloud-web/icons-static';
```

```js [CommonJs]
const { MessageSquare } = require('@ycloud-web/icons-static');
```

:::

> 注意：每个图标名称都是 PascalCase。可以在 [YCloud Icons 页面](https://tianjianjun0727.github.io/ycloud-icons/icons)查看图标名称。

## Node.js 示例

::: sandpack {template=node showTabs=false editorHeight=480 editorWidthPercentage=60 dependencies="@ycloud-web/icons-static"}

```js /index.js [active]
import http from 'http';
import { MessageSquare } from '@ycloud-web/icons-static';

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  res.end(`
    <!DOCTYPE html>
    <html lang="zh-CN">
      <head>
        <meta charset="utf-8" />
        <title>YCloud Icons</title>
      </head>
      <body>
        <h1>YCloud Icons</h1>
        <p>这是一个 YCloud Icons 图标 ${MessageSquare}</p>
      </body>
    </html>
  `);
});

const hostname = '127.0.0.1';
const port = 3000;

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

:::
