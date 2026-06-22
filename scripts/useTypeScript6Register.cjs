const Module = require('node:module');
const { createRequire } = require('node:module');

const localRequire = createRequire(__filename);
const typeScript6 = localRequire('@typescript/typescript6');
const typeScript6Compat = {
  __esModule: true,
  ...typeScript6,
  default: typeScript6,
};
const originalLoad = Module._load;

Module._load = function loadTypeScript(request, parent, isMain) {
  if (request === 'typescript') {
    return typeScript6Compat;
  }

  return originalLoad.call(this, request, parent, isMain);
};
