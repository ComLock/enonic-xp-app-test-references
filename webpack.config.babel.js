/* eslint-disable no-console */
//──────────────────────────────────────────────────────────────────────────────
// Imports
//──────────────────────────────────────────────────────────────────────────────
import glob from 'glob';
import path from 'path';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin'; // Supports ECMAScript2015

//──────────────────────────────────────────────────────────────────────────────
// Common
//──────────────────────────────────────────────────────────────────────────────
const MODE = 'production';
const JS_EXTENSION_GLOB_BRACE = '*.{es,es6,mjs,jsx,flow,js}';
//const ASSETS_PATH_GLOB_BRACE = '{site/assets,assets}';

const SRC_DIR = 'src/main/resources';
const DST_DIR = 'build/resources/main';

const context = path.resolve(__dirname, SRC_DIR);
const extensions = ['.es', '.js', '.json']; // used in resolve
const outputPath = path.join(__dirname, DST_DIR);

const stats = {
	colors: true,
	entrypoints: false,
	hash: false,
	maxModules: 0,
	modules: false,
	moduleTrace: false,
	timings: false,
	version: false
};
const WEBPACK_CONFIG = [];

//──────────────────────────────────────────────────────────────────────────────
// Functions
//──────────────────────────────────────────────────────────────────────────────
const toStr = (v) => JSON.stringify(v, null, 4);
const dict = (arr) => Object.assign(...arr.map(([k, v]) => ({ [k]: v })));

//──────────────────────────────────────────────────────────────────────────────
// Server-side Javascript
//──────────────────────────────────────────────────────────────────────────────
//const ALL_JS_ASSETS_GLOB = `${SRC_DIR}/${ASSETS_PATH_GLOB_BRACE}/**/${JS_EXTENSION_GLOB_BRACE}`;
//console.log(`ALL_JS_ASSETS_GLOB:${toStr(ALL_JS_ASSETS_GLOB)}`);

//const ALL_JS_ASSETS_FILES = glob.sync(ALL_JS_ASSETS_GLOB);
//console.log(`ALL_JS_ASSETS_FILES:${toStr(ALL_JS_ASSETS_FILES)}`);

const SERVER_JS_FILES = glob.sync(`${SRC_DIR}/**/${JS_EXTENSION_GLOB_BRACE}`);/*, {
	//ignore: ALL_JS_ASSETS_FILES
});*/
console.log(`SERVER_JS_FILES:${toStr(SERVER_JS_FILES)}`);

if (SERVER_JS_FILES.length) {
	const SERVER_JS_ENTRY = dict(SERVER_JS_FILES.map((k) => [
		k.replace(`${SRC_DIR}/`, '').replace(/\.[^.]*$/, ''), // name
		`.${k.replace(`${SRC_DIR}`, '')}` // source relative to context
	]));
	//console.log(`SERVER_JS_ENTRY:${toStr(SERVER_JS_ENTRY)}`);

	const SERVER_JS_CONFIG = {
		context,
		entry: SERVER_JS_ENTRY,
		externals: [
			/^\//
		],
		devtool: false, // Don't waste time generating sourceMaps
		mode: MODE,
		module: {
			rules: [{
				test: /\.(es6?|js)$/, // Will need js for node module depenencies
				use: [{
					loader: 'babel-loader',
					options: {
						babelrc: false, // The .babelrc file should only be used to transpile config files.
						comments: false,
						compact: false,
						minified: false,
						plugins: [
							'array-includes',
							//'import-css-to-jss', // NOTE This will hide the css from MiniCssExtractPlugin!
							//'optimize-starts-with', https://github.com/xtuc/babel-plugin-optimize-starts-with/issues/1
							//'transform-prejss',
							'@babel/plugin-proposal-object-rest-spread',
							'@babel/plugin-transform-object-assign'
						],
						presets: [
							[
								'@babel/preset-env',
								{
									useBuiltIns: false // false means polyfill not required runtime
								}
							]
						]
					} // options
				}]
			}]
		}, // module
		optimization: {
			minimizer: [
				new UglifyJsPlugin({
					parallel: true, // highly recommended
					sourceMap: false
				})
			]
		},
		output: {
			path: outputPath,
			filename: '[name].js',
			libraryTarget: 'commonjs'
		}, // output
		resolve: {
			extensions
		}, // resolve
		stats
	};
	//console.log(`SERVER_JS_CONFIG:${JSON.stringify(SERVER_JS_CONFIG, null, 4)}`);
	WEBPACK_CONFIG.push(SERVER_JS_CONFIG);
}

//──────────────────────────────────────────────────────────────────────────────
// Exports
//──────────────────────────────────────────────────────────────────────────────
//console.log(`WEBPACK_CONFIG:${JSON.stringify(WEBPACK_CONFIG, null, 4)}`);
//process.exit();

export { WEBPACK_CONFIG as default };