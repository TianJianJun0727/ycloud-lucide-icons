import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const typeScript6Url = pathToFileURL(require.resolve('@typescript/typescript6')).href;

export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'typescript') {
    return {
      shortCircuit: true,
      url: typeScript6Url,
    };
  }

  return nextResolve(specifier, context);
}
