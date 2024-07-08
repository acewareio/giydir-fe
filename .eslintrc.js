// https://www.npmjs.com/package/eslint-config-moon
module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.eslint.json',
		tsconfigRootDir: __dirname,
	},
	extends: [
		'moon',
		'moon/node',
		'moon/react',
		'moon/browser',
	],
	rules: {
		// Doesn't understand the new TS 4.7 imports
		'import/no-unresolved': 'off',

		// We need to keep "index" around in imports for extensions
		'sort-keys': 'off',
		'node/no-unpublished-import': 'off',
		'import/no-useless-path-segments': 'off',
		'import/no-extraneous-dependencies': 'off',
		'import/no-default-export': 'off',
		"react/jsx-no-literals": "off",
		"@typescript-eslint/no-unsafe-call": "off",
		"@typescript-eslint/no-unsafe-assignment": "off",
		"@typescript-eslint/no-unsafe-member-access": "off"
	},
	overrides: [
		{
			files: ['apps/**/*'],
			rules: {
				// App pages require default exports
				'import/no-default-export': 'off',
			},
		},
		{
			files: ['*.config.js', '.eslintrc.js'],
			rules: {
				'sort-keys': 'off',
				'import/no-commonjs': 'off',
				'unicorn/prefer-module': 'off',
			},
		},
	],
};
