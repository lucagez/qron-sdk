//#!/usr/bin/env node

const tar = require('tar');
const { spawn } = require('child_process');
const os = require('os');
const fs = require('fs')
const crypto = require('crypto');

async function install() {
  const tmpDir = os.tmpdir();
  const tarballExtracted = `${tmpDir}/.qron`;
  const binPath = `${tarballExtracted}/qron-dev`;

  if (fs.existsSync(binPath)) {
    return binPath;
  }

  fs.mkdirSync(tarballExtracted, { recursive: true });

  const versions = await fetch('https://api.github.com/repos/lucagez/qron/tags')
    .then(res => res.json());
  const version = versions[0].name?.replace(/^v/, '');
  const arch = os.arch();
  const platform = os.platform();
  const binName = `qron_${version}_${platform}_${arch}`;
  const tarball = `${binName}.tar.gz`;
  const tarballUrl = `https://github.com/lucagez/qron/releases/download/v${version}/${tarball}`;
  const checksumsUrl = `https://github.com/lucagez/qron/releases/download/v${version}/checksums.txt`;
  const tarballDest = `${tmpDir}/${tarball}`;

  const checksums = await fetch(checksumsUrl).then(res => res.text());
  const checksum = checksums
    .split('\n')
    .find(line => line.includes(tarball))
    .split(/\s+/)[0];

  // Binary is only 5mb so it's fine
  const blob = await fetch(tarballUrl)
    .then(res => res.arrayBuffer());
  const buf = Buffer.from(blob);
  const hash = crypto
    .createHash('sha256')
    .update(buf)
    .digest('hex');
  if (checksum !== hash) {
    throw new Error('checksum did not match');
  }

  fs.writeFileSync(tarballDest, buf);
  tar.x({ C: tarballExtracted, file: tarballDest, sync: true })
  fs.rmSync(tarballDest);

  return binPath
}

async function main() {
  let binPath
  try {
    binPath = await install()
  } catch (e) {
    console.error('Uh oh, something went wrong while installing qron-dev..');
    console.error('If the problem persists, please open an issue at:');
    console.error(' https://github.com/lucagez/qron/issues');
    console.error('');
    console.error(e);
    process.exit(1);
  }

  const child = spawn(binPath, process.argv.slice(2), {
    stdio: 'inherit',
  });
  child.on('close', (code) => {
    process.exit(code);
  });
}

main()