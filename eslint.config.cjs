// @ts-check

const eslint = require('@eslint/js')
const tseslint = require('typescript-eslint')
const react = require('eslint-plugin-react')
const reactHooks = require('eslint-plugin-react-hooks')
const unusedImports = require('eslint-plugin-unused-imports')
const storybook = require('eslint-plugin-storybook')

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  {
    ignores: [
      'node_modules/**',
      'storybook-static/**',
      'package-lock.json',
      'next-env.d.ts',
      '.next/**',
      'tsconfig.tsbuildinfo',
      'dist/**',
      'next-env.d.ts',
      '**/generated/**',
      'eslint.config.cjs',
      '.n8n',
      'server/n8n/custom-nodes/dist/**',
      'docker/**',
      'shared/**',
      'uploads/**',
      '.prettierignore',
      '.dockerignore',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...storybook.configs['flat/recommended'],
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'unused-imports': unusedImports,
    },
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: [],
        },
        tsconfigRootDir: __dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-extra-semi': 'off',
      '@typescript-eslint/no-empty-function': 'error',
      'no-prototype-builtins': 'off',
      'unused-imports/no-unused-imports': 'error',
      'react/no-unescaped-entities': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-no-bind': 'error',
      'react/no-array-index-key': 'error',
      'react/no-children-prop': 'off',
      'react/no-unknown-property': 'off',
      'react/jsx-uses-react': 'off',
      'no-fallthrough': 'error',
      'no-console': [
        'error',
        {
          allow: ['warn', 'error'],
        },
      ],
      '@typescript-eslint/no-deprecated': 'error',
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always'],
      '@typescript-eslint/no-non-null-assertion': 'error',
    },
  },
  {
    files: ['**/*.{js,cjs}'],
    languageOptions: {
      parserOptions: {
        sourceType: 'commonjs',
      },
      globals: {
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        __dirname: 'readonly',
        process: 'readonly',
        console: 'readonly',
        $input: 'readonly',
        $config: 'readonly',
        $: 'readonly',
      },
    },
  },
]
