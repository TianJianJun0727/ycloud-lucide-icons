module.exports = {
  root: true,
  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['tsconfig.json'],
      },
      plugins: ['@angular-eslint', '@typescript-eslint', '@angular-eslint/template'],
      extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
      rules: {
        '@angular-eslint/directive-selector': [
          'error',
          {
            type: 'attribute',
            prefix: 'ycloud',
            style: 'camelCase',
          },
        ],
        '@angular-eslint/component-selector': [
          'error',
          {
            type: 'attribute',
            prefix: ['ycloud'],
            style: 'camelCase',
          },
        ],
      },
    },
    {
      files: ['*.html'],
      plugins: ['@angular-eslint/template'],
      extends: ['prettier'],
      rules: {},
    },
  ],
};
