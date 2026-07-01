/**
 * @param {string[]} filenames
 * @returns {string}
 */
const filenamesToAjvOption = (filenames) => filenames.map((filename) => `-d ${filename}`).join(' ');

/**
 * @param {string[]} filenames
 * @returns {string[]}
 */
const iconMetadataFiles = (filenames) =>
  filenames.filter((filename) => !filename.endsWith('/package.json'));

/** @satisfies {import('lint-staged').Config} */
const config = {
  'icons/*.svg': [
    'node ./scripts/optimizeStagedSvgs.mts',
    'node ./scripts/generateNextJSAliases.mts',
  ],
  'business-icons/**/*.svg': [
    'node ./scripts/optimizeStagedBusinessSvgs.mts',
    'node ./scripts/writeBusinessIconIndex.mts',
    'oxfmt business-icons/index.json',
    'node ./scripts/checkBusinessSvgSource.mts',
  ],
  'business-icons/**/*.json': (filenames) => [`oxfmt ${filenames.join(' ')}`],
  'icons/*.json': (filenames) => {
    const metadataFiles = iconMetadataFiles(filenames);
    return metadataFiles.length === 0
      ? []
      : [
          `ajv --spec=draft2020 -s icon.schema.json ${filenamesToAjvOption(metadataFiles)}`,
          `oxfmt ${metadataFiles.join(' ')}`,
        ];
  },
  'categories/*.json': (filenames) => [
    `ajv --spec=draft2020 -s category.schema.json ${filenamesToAjvOption(filenames)}`,
    `oxfmt ${filenames.join(' ')}`,
  ],
};

export default config;
