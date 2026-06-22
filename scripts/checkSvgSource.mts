/**
 * 校验源 SVG 是否符合仓库规范，通常在 lint 和 PR 自动修复流程中运行。
 *
 * 输入：可通过命令行传入 SVG 文件列表；未传入时全量读取 `icons/*.svg`。
 * 检查内容：
 * - 文件名必须是小写字母/数字组成的 kebab-case，例如 `a-arrow-down.svg`。
 * - 根节点必须是 `<svg>`。
 * - 根节点属性必须与 `tools/build-icons/render/default-attrs.json` 完全一致。
 * - 任意节点都不能包含 `style` 或 `class` 属性，避免设计工具导出的样式污染组件。
 * - 任意标签不能出现重复属性，例如重复 `fill`、`stroke` 或 `width`。
 *
 * 注意：这个脚本只做结构和规范校验；SVG 文本格式化仍由 Prettier 的 `html` parser 负责。
 * 调用位置：根 `package.json` 的 `pnpm lint:svg`，以及 `.github/workflows/fix-icon-source.yml`。
 * 调用时机：本地 lint、CI lint、PR 自动修复后的源 SVG 校验阶段都会运行。
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseSync, type INode } from 'svgson';
import DEFAULT_ATTRS from '../tools/build-icons/render/default-attrs.json' with { type: 'json' };

const SVG_FILENAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*\.svg$/;

export function validateSvgFileName(file: string) {
  const fileName = path.basename(file);

  if (!SVG_FILENAME_PATTERN.test(fileName)) {
    return [
      `SVG filename must be lowercase kebab-case with only letters and numbers, for example "a-arrow-down.svg".`,
    ];
  }

  return [];
}

function checkDuplicatedAttributes(errors: string[], svg: string) {
  for (const tag of svg.matchAll(/<([a-zA-Z][\w:-]*)([^<>]*?)\/?>/g)) {
    const tagName = tag[1];
    const attributes = tag[2];
    const seen = new Set<string>();

    for (const attribute of attributes.matchAll(/\s([^\s"'=<>/]+)\s*=/g)) {
      const name = attribute[1];
      if (seen.has(name)) {
        errors.push(`<${tagName}> has duplicated "${name}" attribute.`);
      }
      seen.add(name);
    }
  }
}

function walk(errors: string[], node: INode) {
  const attributes = node.attributes ?? {};

  for (const attr of ['style', 'class']) {
    if (attr in attributes) {
      errors.push(`<${node.name}> must not use "${attr}" attributes.`);
    }
  }

  for (const child of node.children ?? []) {
    if (typeof child !== 'string') {
      walk(errors, child);
    }
  }
}

function checkRootAttributes(errors: string[], root: INode) {
  if (root.name !== 'svg') {
    errors.push('root element must be <svg>.');
    return;
  }

  for (const [attr, value] of Object.entries(DEFAULT_ATTRS)) {
    const actual = root.attributes?.[attr];
    const expected = String(value);

    if (actual !== expected) {
      errors.push(`<svg> "${attr}" must be "${expected}", got "${actual ?? 'missing'}".`);
    }
  }
}

export function validateSvgSource(svg: string) {
  const errors: string[] = [];
  checkDuplicatedAttributes(errors, svg);

  try {
    const root = parseSync(svg);
    checkRootAttributes(errors, root);
    walk(errors, root);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
  }

  return errors;
}

export async function validateSvgSourceFile(file: string) {
  const fileNameErrors = validateSvgFileName(file);

  try {
    return [...fileNameErrors, ...validateSvgSource(await fs.readFile(file, 'utf-8'))];
  } catch (error) {
    return [
      ...fileNameErrors,
      `cannot read SVG: ${error instanceof Error ? error.message : String(error)}`,
    ];
  }
}

async function main() {
  const svgFiles = process.argv.slice(2);
  const files = svgFiles.length
    ? svgFiles
    : (await fs.readdir('icons'))
        .filter((file) => file.endsWith('.svg'))
        .map((file) => path.join('icons', file));
  let hasError = false;

  for (const file of files) {
    const errors = await validateSvgSourceFile(file);

    for (const message of errors) {
      console.error(`${file}: ${message}`);
      hasError = true;
    }
  }

  if (hasError) {
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
