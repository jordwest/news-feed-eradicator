import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';

const plugins = [
	resolve(),
	commonjs(),
	typescript(),
	replace({
		'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
	}),
];

/*
const eradicate = {
	input: 'src/eradicate.ts',
	output: {
		file: 'build/eradicate.js',
		format: 'iife',
	},
	plugins: [...plugins, css({ output: 'build/eradicate.css' })],
};
*/

const intercept = {
	input: 'src/intercept.ts',
	output: {
		file: 'build/intercept.js',
		format: 'iife',
	},
	plugins: [...plugins, css({ output: 'build/eradicate.css' })],
};

const options = {
	input: 'src/options/options.ts',
	output: {
		file: 'build/options.js',
		format: 'iife',
	},
	plugins: [...plugins, css({ output: 'build/options.css' })],
};

const background = {
	input: 'src/background/background.ts',
	output: {
		file: 'build/background.js',
		format: 'iife',
	},
	plugins,
};

export default [intercept, options, background];
