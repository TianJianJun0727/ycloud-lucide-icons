# YCloud Icons React Native

YCloud Icons for React Native renders icons through `react-native-svg` for consistent iOS and Android output.

**You can use it to:**

- Use scalable vector icons in React Native screens.
- Share icon names and props with the React package where possible.
- Customize size, color, and stroke width with component props.

## Installation

::: code-group

```sh [pnpm]
pnpm add @ycloud-web/icons-react-native@latest react-native-svg
```

```sh [npm]
npm install @ycloud-web/icons-react-native@latest react-native-svg
```

```sh [yarn]
yarn add @ycloud-web/icons-react-native@latest react-native-svg
```

```sh [bun]
bun add @ycloud-web/icons-react-native@latest react-native-svg
```

:::

## Version Requirements

React `^17.0.0 || ^18.0.0 || ^19.0.0`, any React Native version, and `react-native-svg` `^12.0.0 || ^13.0.0 || ^14.0.0 || ^15.0.0`.

## Usage

```tsx
import { House } from '@ycloud-web/icons-react-native';

export function App() {
  return (
    <House
      size={32}
      color="#ff5a5f"
    />
  );
}
```

## Documentation

Read the full guide: [YCloud Icons React Native](/en/guide/react-native/).

## License

YCloud Icons is released under the ISC License. It is based on [Lucide](https://github.com/lucide-icons/lucide) and keeps the required upstream license and third-party notices.
