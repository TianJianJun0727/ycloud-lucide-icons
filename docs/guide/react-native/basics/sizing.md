---
title: 尺寸 - React Native
description: 了解如何在 React Native 应用中通过 `size` prop 或 CSS 调整图标尺寸。
---

# 尺寸

默认情况下，所有图标的尺寸都是 `24px` x `24px`。你可以通过 `size` prop 或 CSS 调整图标尺寸。

## 使用 `size` prop 调整图标尺寸

```SnackPlayer name=State&ext=js&dependencies=react-native-svg,@ycloud-web/icons-react-native
import React, {useState, useEffect} from 'react';
import { View } from 'react-native';
import { Landmark } from "@ycloud-web/icons-react-native";

const style = { height: '100%', alignItems: 'center', display: 'flex', justifyContent: 'center' }

const App = () => {
  return (
    <View style={style}>
      <Landmark size={48}  />
    </View>
  );
};

export default App;
```

## 通过 style prop 调整图标尺寸

可以使用 style 中的 `width` 和 `height` 属性调整图标尺寸。

```SnackPlayer name=State&ext=js&dependencies=react-native-svg,@ycloud-web/icons-react-native
import React, {useState, useEffect} from 'react';
import { View, StyleSheet } from 'react-native';
import { Landmark } from "@ycloud-web/icons-react-native";

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center'
  },
  icon: {
    width: 48,
    height: 48
  },
});

const App = () => {
  return (
    <View style={styles.container}>
      <Landmark style={styles.icon}  />
    </View>
  );
};

export default App;
```
