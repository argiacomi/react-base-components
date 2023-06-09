module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'prettier'
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh', 'prettier'],
  rules: {
    'react/prop-types': 'off',
    'react-refresh/only-export-components': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'prettier/prettier': 'error',
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'styled-components',
            message: 'Please import from styled-components/macro.'
          }
        ],
        patterns: ['!styled-components/macro']
      }
    ]
  }
};
