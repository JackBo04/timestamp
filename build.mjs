import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['main.ts'],
  bundle: true,
  platform: 'browser',
  target: 'es2020',
  outfile: 'main.js',
  external: ['obsidian'],
  format: 'cjs',
  sourcemap: true,
});
