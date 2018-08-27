import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript'
import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'

export default {
    input: 'src/index.ts',
    external: ['fs', 'path', 'sleet'],
    plugins: [
        typescript({
            typescript: require('typescript'),
            module: 'es6'
        }),
        commonjs(),
        babel({
            presets: ['es2015-rollup']
        }),
        uglify()
    ],
    output: {
        file: 'dist/sleet-html.min.js',
        format: 'umd',
        name: 'SleetHTML',
        sourcemap: true,
        globals: {
            sleet: 'Sleet',
            fs: 'NODE_FS',
            path: 'NODE_PATH'
        }
    }
}
