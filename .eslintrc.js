module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'linebreak-style': 0,
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
        json: 'never',
      },
    ],
    'max-len': ['error', 120, 2],
    'no-param-reassign': 0,
    'no-console': 0,
    'no-bitwise': 0,
  },
  overrides: [
    {
      files: ['src/types.ts', 'src/utils.ts'],
      rules: {
        'no-use-before-define': ['off'],
        'no-unused-vars': ['off'],
      },
    },
  ],
};
