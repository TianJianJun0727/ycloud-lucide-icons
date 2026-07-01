import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const runtimeDir = path.join(distDir, 'runtime');
const runtimeFiles = [
  'Icon.svelte',
  'Icon.svelte.d.ts',
  'businessTypes.js',
  'businessTypes.d.ts',
  'context.js',
  'context.d.ts',
  'defaultAttributes.js',
  'defaultAttributes.d.ts',
  'illustrationTypes.js',
  'illustrationTypes.d.ts',
  'types.js',
  'types.d.ts',
];

const replaceInFile = (filePath, replacements) => {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const source = fs.readFileSync(filePath, 'utf8');
  let nextSource = source;

  for (const [from, to] of replacements) {
    nextSource = nextSource.replaceAll(from, to);
  }

  if (nextSource !== source) {
    fs.writeFileSync(filePath, nextSource);
  }
};

const walkFiles = (dir, callback) => {
  if (!fs.existsSync(dir)) {
    return;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const filePath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walkFiles(filePath, callback);
      continue;
    }

    callback(filePath);
  }
};

fs.mkdirSync(runtimeDir, { recursive: true });

for (const fileName of runtimeFiles) {
  const from = path.join(distDir, fileName);
  const to = path.join(runtimeDir, fileName);

  if (fs.existsSync(from)) {
    fs.renameSync(from, to);
  }
}

for (const fileName of ['icons.js', 'icons.d.ts']) {
  replaceInFile(path.join(distDir, fileName), [
    ["'./defaultAttributes.js'", "'./runtime/defaultAttributes.js'"],
    ["'./types.js'", "'./runtime/types.js'"],
    ["'./Icon.svelte'", "'./runtime/Icon.svelte'"],
    ["'./context.js'", "'./runtime/context.js'"],
  ]);
}

for (const fileName of ['business-icons.js', 'business-icons.d.ts']) {
  replaceInFile(path.join(distDir, fileName), [
    ["'./businessTypes.js'", "'./runtime/businessTypes.js'"],
  ]);
}

for (const fileName of ['illustration-icons.js', 'illustration-icons.d.ts']) {
  replaceInFile(path.join(distDir, fileName), [
    ["'./illustrationTypes.js'", "'./runtime/illustrationTypes.js'"],
  ]);
}

walkFiles(path.join(distDir, 'icons'), (filePath) => {
  replaceInFile(filePath, [
    ["'../Icon.svelte'", "'../runtime/Icon.svelte'"],
    ['"../Icon.svelte"', '"../runtime/Icon.svelte"'],
    ['"../types.js"', '"../runtime/types.js"'],
  ]);
});

walkFiles(path.join(distDir, 'business-icons'), (filePath) => {
  replaceInFile(filePath, [
    ["'../businessTypes'", "'../runtime/businessTypes'"],
    ["'../businessTypes.js'", "'../runtime/businessTypes.js'"],
    ['"../businessTypes"', '"../runtime/businessTypes"'],
    ['"../businessTypes.js"', '"../runtime/businessTypes.js"'],
  ]);
});

walkFiles(path.join(distDir, 'illustration-icons'), (filePath) => {
  replaceInFile(filePath, [
    ["'../illustrationTypes'", "'../runtime/illustrationTypes'"],
    ["'../illustrationTypes.js'", "'../runtime/illustrationTypes.js'"],
    ['"../illustrationTypes"', '"../runtime/illustrationTypes"'],
    ['"../illustrationTypes.js"', '"../runtime/illustrationTypes.js"'],
  ]);
});
