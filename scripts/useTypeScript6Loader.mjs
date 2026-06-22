/**
 * ESM loader：把部分工具链中的 typescript 导入临时映射到 TypeScript 6。
 *
 * 输入：Node ESM loader 的 `resolve` 请求。
 * 行为：当模块 specifier 是 `typescript` 时，返回 `@typescript/typescript6` 的实际路径。
 *
 * 适用场景：Svelte、Angular、dts 打包等工具链尚未完全兼容 TypeScript 7 RC 时，局部降级工具内部使用的 TypeScript。
 */
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const typeScript6Url = pathToFileURL(require.resolve('@typescript/typescript6')).href;

export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'typescript') {
    return {
      shortCircuit: true,
      url: typeScript6Url,
    };
  }

  return nextResolve(specifier, context);
}
