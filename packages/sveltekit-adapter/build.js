import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('package/package.json', 'utf8'));

fs.writeFileSync('package/package.json', JSON.stringify({
  ...pkg,
  dependencies: {
    ...pkg.dependencies,
    '@qron-run/sdk': 'latest',
  },
}, null, 2));