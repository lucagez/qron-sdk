import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

fs.writeFileSync('package/package.json', JSON.stringify({
  ...pkg,
  main: './index.js',
  types: './index.d.ts',
  exports: {
    import: './index.js',
    require: './index.cjs'
  },
}, null, 2));
