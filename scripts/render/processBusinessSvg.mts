/**
 * Process a business SVG with minimal cleanup.
 *
 * Business icons keep their original geometry and stroke details. The cleanup
 * only removes unsafe SVG content and normalizes hardcoded fill/stroke colors
 * to currentColor.
 */
import * as prettier from 'prettier';
import { parseSync, stringify, type INode } from 'svgson';

function collectReferencedIds(svg: string) {
  return new Set([...svg.matchAll(/url\(#([^)]+)\)/g)].map((match) => match[1]));
}

function removeUnsafeNodes(node: INode) {
  node.children = (node.children ?? []).filter((child) => {
    if (typeof child === 'string') {
      return true;
    }

    const name = child.name.toLowerCase();
    if (name === 'script' || name === 'foreignobject') {
      return false;
    }

    removeUnsafeNodes(child);
    return true;
  });
}

function cleanAttributes(node: INode, referencedIds: Set<string>) {
  const attributes = node.attributes ?? {};

  for (const attr of Object.keys(attributes)) {
    const value = attributes[attr];

    if (
      /^on/i.test(attr) ||
      attr === 'class' ||
      attr === 'style' ||
      /^data-/i.test(attr) ||
      (attr === 'id' && !referencedIds.has(String(value)))
    ) {
      delete attributes[attr];
      continue;
    }

    if (typeof value === 'string' && /javascript\s*:/i.test(value)) {
      delete attributes[attr];
      continue;
    }

    if (/^(fill|stroke)$/i.test(attr) && value !== 'none' && value !== 'currentColor') {
      attributes[attr] = 'currentColor';
    }
  }

  node.attributes = attributes;

  for (const child of node.children ?? []) {
    if (typeof child !== 'string') {
      cleanAttributes(child, referencedIds);
    }
  }
}

function cleanBusinessSvg(svg: string) {
  const root = parseSync(svg);
  const referencedIds = collectReferencedIds(svg);
  removeUnsafeNodes(root);
  cleanAttributes(root, referencedIds);
  return stringify(root);
}

export default function processBusinessSvg(svg: string, _path: string) {
  return prettier.format(cleanBusinessSvg(svg), { parser: 'html' });
}
