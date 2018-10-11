import typescript from 'rollup-plugin-typescript';
import css from 'rollup-plugin-css-only';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';

const eradicate = {
	input: 'src/eradicate.ts',
	output: {
		file: 'build/eradicate.js',
		format: 'iife',
	},
	plugins: [
		resolve(),
		commonjs(),
		typescript(),
		css({ output: 'build/eradicate.css' }),
		replace({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
		}),
	],
};

const intercept = {
	input: 'src/intercept.ts',
	output: {
		file: 'build/intercept.js',
		format: 'iife',
	},
	plugins: [typescript()],
};

export default [eradicate, intercept];
