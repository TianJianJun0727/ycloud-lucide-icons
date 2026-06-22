/**
 * 同步 monorepo 内所有包的版本号。
 *
 * 输入：命令行第一个参数为目标版本号，例如 `0.1.12`。
 * 行为：
 * - 校验版本号格式。
 * - 更新根 `package.json` 版本。
 * - 遍历 packages 目录下各子包的 package.json，把所有包版本同步到同一个版本。
 *
 * 适用场景：Release Packages 工作流发布成功后，把仓库内版本号回写到 main。
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

type PackageJson = {
  name?: string;
  version?: string;
};

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDir, '..');
const packagesDir = path.join(projectRoot, 'packages');

function resolveVersion() {
  const versionArg = process.argv[2]?.trim();
  const versionEnv = process.env.RELEASE_VERSION?.trim();
  const version = versionArg || versionEnv;

  if (!version) {
    throw new Error('Missing version. Usage: node ./scripts/syncPackageVersions.mts <version>');
  }

  if (!/^\d+\.\d+\.\d+(?:[-+].+)?$/.test(version)) {
    throw new Error(`Invalid version: ${version}`);
  }

  return version;
}

async function main() {
  const version = resolveVersion();
  const packageDirs = await readdir(packagesDir, { withFileTypes: true });
  const updatedPackages: string[] = [];

  for (const entry of packageDirs) {
    if (!entry.isDirectory()) continue;

    const packageJsonPath = path.join(packagesDir, entry.name, 'package.json');

    try {
      const source = await readFile(packageJsonPath, 'utf8');
      const packageJson = JSON.parse(source) as PackageJson;

      if (packageJson.version === version) {
        continue;
      }

      packageJson.version = version;
      await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`, 'utf8');
      updatedPackages.push(packageJson.name ?? entry.name);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        continue;
      }

      throw error;
    }
  }

  if (updatedPackages.length === 0) {
    console.log(`All package versions already set to ${version}.`);
    return;
  }

  console.log(`Updated ${updatedPackages.length} package versions to ${version}:`);
  updatedPackages.forEach((packageName) => console.log(`- ${packageName}`));
}

await main();
