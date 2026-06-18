import { readFile } from 'node:fs/promises';
import { fileURLToPath, URL } from 'node:url';

export default {
  async load() {
    const packageJsonPath = fileURLToPath(
      new URL('../../../../../packages/ycloud-react/package.json', import.meta.url),
    );
    const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf-8')) as { version: string };

    return {
      version: packageJson.version,
    };
  },
};
