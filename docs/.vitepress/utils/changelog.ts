import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export type ReleaseEntry = {
  version: string;
  tag: string;
  date: string;
};

const repoRoot = fileURLToPath(new URL('../../../../', import.meta.url));

function run(command: string) {
  return execSync(command, {
    cwd: repoRoot,
    encoding: 'utf-8',
    stdio: ['ignore', 'pipe', 'ignore'],
  }).trim();
}

export function getChangelogAnchor(version: string, date: string) {
  return `v${version.replace(/\./g, '-')}-${date}`;
}

export function listReleaseEntries(): ReleaseEntry[] {
  try {
    const output = run("git tag --list 'v*' --sort=-version:refname");
    const tags = output ? output.split('\n').filter(Boolean) : [];

    return tags.map((tag) => {
      const version = tag.replace(/^v/, '');
      const date = run(`git log -1 --format=%cs ${tag}`);

      return {
        version,
        tag,
        date,
      };
    });
  } catch {
    return [];
  }
}
