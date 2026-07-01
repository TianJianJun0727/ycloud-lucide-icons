/**
 * 同步 monorepo 内所有包的版本号。
 *
 * 输入：命令行第一个参数为目标版本号，例如 `0.1.12`。
 * 行为：
 * - 校验版本号格式。
 * - 遍历 packages 目录下各子包的 package.json，把所有包版本同步到同一个版本。
 * - 传入 `--check` 时只校验版本是否一致，不写文件。
 *
 * 适用场景：Release Packages 工作流发布前准备版本提交，或校验待发布 ref 已经包含正确版本。
 * 调用位置：根 `package.json` 的 `pnpm sync:package-versions`，`.github/workflows/ci.yml` 和 `.github/workflows/release.yml`。
 * 调用时机：发布流程确定目标版本后运行，确保 packages 下所有发布包版本一致。
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

const checkOnly = process.argv.includes('--check');

async function main() {
  const version = resolveVersion();
  const packageDirs = await readdir(packagesDir, { withFileTypes: true });
  const updatedPackages: string[] = [];
  const mismatchedPackages: string[] = [];

  for (const entry of packageDirs) {
    if (!entry.isDirectory()) continue;

    const packageJsonPath = path.join(packagesDir, entry.name, 'package.json');

    try {
      const source = await readFile(packageJsonPath, 'utf8');
      const packageJson = JSON.parse(source) as PackageJson;

      if (packageJson.version === version) {
        continue;
      }

      if (checkOnly) {
        mismatchedPackages.push(
          `${packageJson.name ?? entry.name}: ${packageJson.version ?? '<missing>'}`,
        );
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

  if (checkOnly) {
    if (mismatchedPackages.length > 0) {
      throw new Error(
        `Package versions do not match ${version}:\n${mismatchedPackages
          .map((item) => `- ${item}`)
          .join('\n')}`,
      );
    }

    console.log(`All package versions match ${version}.`);
    return;
  }

  if (updatedPackages.length === 0) {
    console.log(`All package versions already set to ${version}.`);
    return;
  }

  console.log(`Updated ${updatedPackages.length} package versions to ${version}:`);
  updatedPackages.forEach((packageName) => console.log(`- ${packageName}`));
}

await main();
