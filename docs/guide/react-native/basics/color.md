---
title: 颜色 - React Native
description: 了解如何在 React Native 应用中通过 `color` prop 或父元素文本颜色调整图标颜色。
---

# 颜色

默认情况下，所有图标的颜色值都是 `currentColor`。这个关键字会使用元素计算后的文本 `color` 值作为图标颜色。

可以在 [MDN 的 `currentColor` 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#currentcolor_keyword)中了解更多。

## 使用 `color` prop 调整颜色

可以直接向图标组件传入 color prop 来调整颜色。

```SnackPlayer name=State&ext=js&dependencies=react-native-svg,@ycloud-web/icons-react-native
import React, {useState, useEffect} from 'react';
import { View } from 'react-native';
import { Smile } from "@ycloud-web/icons-react-native";

const style = { height: '100%', alignItems: 'center', display: 'flex', justifyContent: 'center' }

const App = () => {
  return (
    <View style={style}>
      <Smile color="#3e9392" />
    </View>
  );
};

export default App;
```
