---
title: What is YCloud Icons?
description: An introduction to YCloud Icons, a multi-framework SVG icon toolkit for React, Vue, and other frontend stacks.
nextPage:
  - installation
---

# What is YCloud Icons?

YCloud Icons is a multi-framework SVG icon toolkit. It provides tree-shakable icon data, strongly typed React components, Vue components, and packages for common frontend runtimes from one shared icon source.

## Available Icons

YCloud Icons currently ships generic outline icons, business icons, illustrations, and package infrastructure. Style variants such as filled icons are part of the roadmap and should be generated from normalized SVG sources when the conversion is reliable.

### Complete Set of Icons

The icon source is kept in the repository and normalized by the build pipeline. Packages consume generated data and components so framework packages stay consistent.

Generic icons are for 24px linear icons in controls, menus, and buttons. Business icons are for product, channel, status, or business-object visuals. Illustrations are for empty states, onboarding, result pages, and error pages.

## Code Optimization

In addition to design, code is also important. Assets like icons can significantly increase bandwidth usage in web projects. YCloud Icons uses SVG optimization and ES module package entrypoints. After tree-shaking, applications only ship the icons they import.

## Accessibility

Icons are pictures that show what something means without using words. They can be very helpful because they can quickly give information.

However, not everyone can understand them easily. Read more about [how to use YCloud in an accessible way](./accessibility.md).

## Official Packages

YCloud Icons follows Lucide's official package coverage and documents 10 package types: [Core JavaScript](./ycloud/index.md), [React](./react/index.md), [Vue](./vue/index.md), [Svelte](./svelte/index.md), [Solid](./solid/index.md), [Preact](./preact/index.md), [React Native](./react-native/index.md), [Angular](./angular/index.md), [Astro](./astro/index.md), and [Static assets](./static/index.md).
