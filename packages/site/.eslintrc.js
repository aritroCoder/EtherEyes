module.exports = {
  extends: ['../../.eslintrc.js'],

  overrides: [
    {
      files: ['**/*.{ts,tsx}', '**/*.d.ts'],
      rules: {
        'jsdoc/require-jsdoc': 0,
        'import/unambiguous': 'off',
      },
    },
  ],

  ignorePatterns: ['!.eslintrc.js', 'build/'],
};
