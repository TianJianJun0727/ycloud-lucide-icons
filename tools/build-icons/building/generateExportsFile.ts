import path from 'path';
import { toPascalCase, toCamelCase, resetFile, appendFile, writeFile } from '@ycloud-web/helpers';
import type { INode } from 'svgson';

export default async function generateExportFile(
  inputEntry: string,
  outputDirectory: string,
  iconNodes: Record<string, INode>,
  exportModuleNameCasing: 'camel' | 'pascal',
  iconFileExtension = '',
  useDefaultExports = true,
) {
  const fileName = path.basename(inputEntry);

  const icons = Object.keys(iconNodes);

  // Generate Import for Icon VNodes
  const iconImportNodes = icons.map((iconName) => {
    let componentName;

    if (exportModuleNameCasing === 'camel') {
      componentName = toCamelCase(iconName);
    } else if (exportModuleNameCasing === 'pascal') {
      componentName = toPascalCase(iconName);
    }
    const importString = `export ${
      useDefaultExports ? `{ default as ${componentName} }` : `*`
    } from './${iconName}${iconFileExtension}';\n`;
    return importString;
  });

  await writeFile(`${iconImportNodes.join('')}\n`, fileName, outputDirectory);

  console.log(`Successfully generated ${fileName} file`);
}
