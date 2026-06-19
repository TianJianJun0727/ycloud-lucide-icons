import fs from 'fs/promises';
import path from 'path';

const packageDir = path.resolve(import.meta.dirname, '..');
const repoRoot = path.resolve(packageDir, '../..');
const sourceDir = path.join(repoRoot, 'ycloud-font');
const targetDir = path.join(packageDir, 'font');

await fs.rm(targetDir, { force: true, recursive: true });
await fs.cp(sourceDir, targetDir, { recursive: true });
