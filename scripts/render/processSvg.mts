/**
 * 处理单个 SVG 源字符串。
 *
 * 输入：一个 SVG 字符串。
 * 处理流程：
 * - 使用 SVGO 移除无效结构、冗余属性和不需要的设计工具输出。
 * - 解析 SVG AST，统一根 `<svg>` 属性为项目默认值。
 * - 保留图形路径本身，不在这里做语义层面的图标重绘。
 * - 最后使用 Prettier `html` parser 格式化 SVG 文本。
 *
 * 注意：这是当前仓库保留 Prettier 的主要原因；非 SVG 代码格式化由 Oxfmt/Oxlint 负责。
 * 调用位置：`optimizeSvgs.mts` 和 `optimizeStagedSvgs.mts`。
 * 调用时机：全量或增量 SVG 清洗时调用，不直接作为命令运行。
 */
import { optimize } from 'svgo';
import * as prettier from 'prettier';
import { parseSync, stringify } from 'svgson';
import DEFAULT_ATTRS from '../../tools/build-icons/render/default-attrs.json' with { type: 'json' };

/**
 * Optimize SVG with `svgo`.
 * @param {string} svg - An SVG string.
 * @returns {Promise<string>} An optimized svg
 */
async function optimizeSvg(svg: string, path: string) {
  const result = optimize(svg, {
    path,
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            convertShapeToPath: false,
            mergePaths: false,
          },
        },
      },
      {
        name: 'removeAttrs',
        params: {
          attrs: '(fill|stroke.*)',
        },
      },
    ],
  });

  return result.data;
}

/**
 * Set default attibutes on SVG.
 * @param {string} svg - An SVG string.
 * @returns {string} An SVG string, included with the default attributes.
 */
function setAttrs(svg: string) {
  const contents = parseSync(svg);

  contents.attributes = {
    ...contents.attributes,
    ...DEFAULT_ATTRS,
    width: String(DEFAULT_ATTRS.width),
    height: String(DEFAULT_ATTRS.height),
    "stroke-width": String(DEFAULT_ATTRS['stroke-width']),
  };

  return stringify(contents);
}

/**
 * Process SVG string.
 * @param {string} svg An SVG string.
 * @returns {Promise<string>} An optimized svg
 */
function processSvg(svg: string, path: string) {
  return (
    optimizeSvg(svg, path)
      .then(setAttrs)
      .then((optimizedSvg) => prettier.format(optimizedSvg, { parser: 'html' }))
  );
}

export default processSvg;
