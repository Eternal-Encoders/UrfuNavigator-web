import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import globals from 'globals';
import tseslint from 'typescript-eslint';


export default [
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    {
        files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
        settings: {
            react: {
                version: 'detect',
            },
        },
        languageOptions: { 
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
                ecmaVersion: 'latest',
                sourceType: 'module',
                globals: globals.browser 
            },
        },         
        rules: {
            'indent': [2, 4],
            'quotes': [2, 'single', { avoidEscape: true }],
            'linebreak-style': 'off',
            'max-len': ['error', { code: 120, ignoreComments: true }],
            'import/no-unresolved': 'off',
            'import/extensions': 'off',
            'import/prefer-default-export': 'off',
            'no-multiple-empty-lines': [2, { max: 2 }],
            'no-shadow': 'off',
            'no-underscore-dangle': 'off',
            'no-unused-vars': 'off',
            'no-console': 'off',
            'react/react-in-jsx-scope': 'off',
            '@typescript-eslint/no-unused-vars': ['warn', {
                'argsIgnorePattern': '^_',
                'varsIgnorePattern': '^_',
                'caughtErrorsIgnorePattern': '^_'
            }]
        },
    },
];