import * as esbuild from 'esbuild';

await esbuild.build({
    entryPoints: ['src/plugin.ts'],
    bundle: true,
    outfile: 'dist/supermemory.js',
    format: 'esm',
    platform: 'node',
    target: 'node22',
    minify: false,
    keepNames: true,
    banner: {
        js: '// @i-know-the-amp-plugin-api-is-wip-and-very-experimental-right-now',
    },
    external: ['@ampcode/plugin'],
    loader: {
        '.html': 'text',
    },
});

console.log('Built dist/supermemory.js');
