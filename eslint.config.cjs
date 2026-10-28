const eslint = require('@eslint/js');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const globals = require('globals');

module.exports = [
    eslint.configs.recommended,
    {
        files: ['src/**/*.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2021,
                sourceType: 'module',
            },
            globals: globals.node,
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
        },
        rules: {
            ...tsPlugin.configs['eslint-recommended'].overrides[0].rules,
            ...tsPlugin.configs.recommended.rules,
            'array-callback-return': 'error',
            'arrow-parens': ['error', 'as-needed'],
            'comma-dangle': ['error', 'always-multiline'],
            curly: ['error', 'all'],
            'dot-location': ['error', 'property'],
            'dot-notation': 'error',
            'eol-last': ['error', 'always'],
            eqeqeq: ['error', 'always'],
            indent: ['error', 4, { SwitchCase: 1 }],
            'linebreak-style': ['error', 'unix'],
            'no-async-promise-executor': 'error',
            'no-await-in-loop': 'error',
            'no-dupe-else-if': 'error',
            'no-else-return': 'error',
            'no-ex-assign': 'error',
            'no-extra-parens': ['error', 'all'],
            'no-lonely-if': 'error',
            'no-multi-assign': 'error',
            'no-return-assign': 'error',
            'no-var': 'error',
            'prefer-arrow-callback': 'error',
            'prefer-const': ['warn', { destructuring: 'all' }],
            quotes: ['error', 'single', { avoidEscape: true }],
            'require-await': 'error',
            semi: ['error', 'always'],
            'space-before-function-paren': [
                'error',
                {
                    anonymous: 'always',
                    asyncArrow: 'always',
                    named: 'never',
                },
            ],
        },
    },
];
