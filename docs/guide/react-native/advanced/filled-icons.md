---
title: 填充图标 - React Native
description: 了解如何在 React Native 应用中为 YCloud Icons 使用填充，以及这种用法的限制。
---

# 填充图标

YCloud Icons 目前并不正式支持填充图标。
不过，所有图标都可以接收 SVG 属性。
因此在某些图标上仍然可以使用 `fill`，并且效果正常。

下面是星级评分的示例：

```SnackPlayer name=State&ext=js&dependencies=react-native-svg,@ycloud-web/icons-react-native
import React, {useState, useEffect} from 'react';
import { View, StyleSheet } from 'react-native';
import { Star, StarHalf } from "@ycloud-web/icons-react-native";

const App = () => {
  return (
    <View style={styles.container}>
      <View style={styles.starRating}>
        <View style={styles.stars}>
          { Array.from({ length: 5 }, () => (
              <Star fill="#111" strokeWidth={0} />
          ))}
        </View>
        <View style={[styles.stars, styles.rating]}>
          <Star fill="orange" strokeWidth={0} />
          <Star fill="orange" strokeWidth={0} />
          <StarHalf fill="orange" strokeWidth={0} />
        </View>
      </View>
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
  starRating: {
    position: 'relative',
  },
  stars: {
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
  },
  rating: {
    position: 'absolute',
    top: 0,
  }
});

export default App;
```
