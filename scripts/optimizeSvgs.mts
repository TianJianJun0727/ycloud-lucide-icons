/**
 * 全量优化 icons 目录下的 SVG 源文件。
 *
 * 输入：固定读取 `icons/*.svg`。
 * 行为：
 * - 遍历全部源 SVG。
 * - 调用 `render/processSvg.mts` 统一清洗和格式化。
 * - 将结果写回 `icons` 目录。
 *
 * 适用场景：大规模 SVG 迁移、SVGO 配置调整或源图标规范升级后运行。
 */
import fs from 'fs';
import path from 'path';
import { readSvgDirectory, writeSvgFile } from '../tools/build-helpers/helpers.ts';
import processSvg from './render/processSvg.mts';

const ICONS_DIR = path.resolve(process.cwd(), 'icons');

console.log(`Optimizing SVGs...`);

const svgFiles = await readSvgDirectory(ICONS_DIR);

await Promise.all(
  svgFiles.map(async (svgFile: string) => {
    const content = fs.readFileSync(path.join(ICONS_DIR, svgFile), 'utf-8');
    const svg = await processSvg(content, svgFile);
    await writeSvgFile(svgFile, ICONS_DIR, svg);
  }),
);
