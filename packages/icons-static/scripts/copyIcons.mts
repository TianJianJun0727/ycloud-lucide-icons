import { mkdir, rm, writeFile } from 'fs/promises';
import { type SVGFile } from './readSvgs.mts';

export default async function copyIcons(
  parsedSvgs: SVGFile[],
  packageDir: string,
  license: string,
) {
  const iconsDirectory = `${packageDir}/icons`;

  await rm(iconsDirectory, { recursive: true, force: true });
  await mkdir(iconsDirectory, { recursive: true });
  // eslint-disable-next-line arrow-body-style
  const writeIconPromises = parsedSvgs.map(({ name, contents }) => {
    let content = `<!-- ${license} -->\n${contents}`;
    content = content.replace('<svg', `<svg\n  class="ycloud ycloud-${name}"`);

    return writeFile(`${iconsDirectory}/${name}.svg`, content);
  });

  await Promise.all(writeIconPromises);
}
