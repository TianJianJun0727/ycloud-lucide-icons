import path from 'path';
import fs from 'fs';
import { getIconMetaData } from '@ycloud-web/build-icons';
import { getCurrentDirPath } from '@ycloud-web/helpers';

const currentDir = process.cwd();
const scriptDir = getCurrentDirPath(import.meta.url);

const iconMetaData = await getIconMetaData(path.resolve(scriptDir, '../../icons'));

const iconAliasesRedirectRoutes = Object.entries(iconMetaData)
  .filter(([, { aliases }]) => aliases?.length)
  .map(([iconName, { aliases }]) => {
    const aliasRouteMatches = aliases
      .map((alias) => (typeof alias === 'string' ? alias : alias?.name))
      .join('|');

    return {
      src: `^/icons/(${aliasRouteMatches})$`,
      status: 308,
      headers: {
        Location: `/icons/${iconName}`,
      },
    };
  });

const vercelOutputJSON = path.resolve(currentDir, '.vercel/output/config.json');

const vercelConfig = await fs.promises.readFile(vercelOutputJSON, 'utf-8');

const vercelRouteConfig = JSON.parse(vercelConfig);

vercelRouteConfig.routes = [...iconAliasesRedirectRoutes, ...vercelRouteConfig.routes];

// Adjust the existing catch-all route to only catch API routes, so that we can add a new catch-all route for 404s
const allCatchRoute = '/(.*)';
const fallBackIndex = vercelRouteConfig.routes.findIndex((route) => route.src === allCatchRoute);

if (fallBackIndex === -1) {
  throw new Error(
    `Could not find the expected catch-all route with src "${allCatchRoute}" in the existing Vercel config. Please make sure that the existing config has a catch-all route and that its src is "${allCatchRoute}".`,
  );
}

vercelRouteConfig.routes[fallBackIndex].src = '/api/(.*)';
vercelRouteConfig.routes.push({
  src: allCatchRoute,
  dest: '/404.html',
});

const output = JSON.stringify(vercelRouteConfig, null, 2);

await fs.promises.writeFile(vercelOutputJSON, output, 'utf-8');

const staticOutputDir = path.resolve(currentDir, '.vercel/output/static');

async function getHtmlFiles(directory: string): Promise<string[]> {
  const entries = await fs.promises.readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return getHtmlFiles(entryPath);
      }

      if (entry.isFile() && entry.name.endsWith('.html')) {
        return [entryPath];
      }

      return [];
    }),
  );

  return files.flat();
}

async function writeDirectoryIndexes() {
  const htmlFiles = await getHtmlFiles(staticOutputDir);

  await Promise.all(
    htmlFiles.map(async (file) => {
      const filename = path.basename(file);

      if (filename === 'index.html' || filename === '404.html') {
        return;
      }

      const cleanPathDirectory = path.join(path.dirname(file), path.basename(file, '.html'));
      const cleanPathIndex = path.join(cleanPathDirectory, 'index.html');

      await fs.promises.mkdir(cleanPathDirectory, { recursive: true });
      await fs.promises.copyFile(file, cleanPathIndex);
    }),
  );
}

await writeDirectoryIndexes();
