---
title: 组合图标 - React Native
description: 了解如何在 React Native 应用中通过嵌套 SVG 元素把多个图标组合成一个图标。
---

# 组合图标

你可以通过嵌套 SVG 元素，把多个图标组合成一个图标。
当你希望基于现有图标创建自定义图标时，这种方式会很有用。

```SnackPlayer name=State&ext=js&dependencies=react-native-svg,@ycloud-web/icons-react-native
import React, {useState, useEffect} from 'react';
import { View, StyleSheet } from 'react-native';
import { Scan, User} from "@ycloud-web/icons-react-native";

const App = () => {
  return (
    <View style={styles.container}>
      <Scan size={48}>
        <User
          size={12}
          x={6}
          y={6}
          absoluteStrokeWidth
        />
      </Scan>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center'
  },
});

export default App;
```

这是合法用法，因为 [SVG 可以嵌套](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/svg#nested_svg_element)，并且图标支持所有 SVG 属性。
你可以通过调整 `x` 和 `y` 坐标，把内部图标放到需要的位置。

::: info 限制
组合图标时，需要确保 `x` 和 `y` 坐标位于外层图标的 `viewBox` 范围内（24x24）。
:::

## 与原生 SVG 元素组合

你也可以把 YCloud Icons 和原生 SVG 元素组合起来，构建自定义图标变体。

### 通知徽标示例

例如，可以通过 `circle` SVG 元素给图标添加一个通知徽标。

```SnackPlayer name=State&ext=js&dependencies=react-native-svg,@ycloud-web/icons-react-native
import React, {useState, useEffect} from 'react';
import { View, StyleSheet } from 'react-native';
import { Mail } from "@ycloud-web/icons-react-native";
import { Circle } from 'react-native-svg';

const App = () => {
  const hasUnreadMessages = true;

  return (
    <View style={styles.container}>
      <Mail size={48}>
        {hasUnreadMessages && (
          <Circle
            r="3"
            cx="21"
            cy="5"
            stroke="none"
            fill="#F56565"
          />
        )}
      </Mail>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center'
  },
});

export default App;
```

### 文本元素示例

也可以使用 `text` SVG 元素给图标添加文本。

```SnackPlayer name=State&ext=js&dependencies=react-native-svg,@ycloud-web/icons-react-native
import React, {useState, useEffect} from 'react';
import { View, StyleSheet } from 'react-native';
import { File } from "@ycloud-web/icons-react-native";
import { Text } from 'react-native-svg';

const App = () => {
  const hasUnreadMessages = true;

  return (
    <View style={styles.container}>
      <File size={48}>
        <Text
          x={7.5}
          y={19}
          fontSize={8}
          fontFamily="Verdana,sans-serif"
          strokeWidth={1}
        >
          JS
        </Text>
      </File>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center'
  },
});

export default App;
```
