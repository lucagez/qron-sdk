#!/usr/bin/env node

import tar from 'tar';
import { spawn } from 'child_process';
import os from 'os';
import fs from 'fs'
import crypto from 'crypto';
import yargs from 'yargs';
import type { CommandModule } from 'yargs';
import { hideBin } from 'yargs/helpers';
import fetch from 'node-fetch';
import path from 'path';

yargs(hideBin(process.argv))
  .command({
    command: 'start',
    description: 'start local development qron server',
    showInHelp: true,
    builder: (yargs) => {
      return yargs.option('port', {
        alias: 'p',
        requiresArg: false,
        default: 9876,
        number: true,
        describe: 'port to listen on',
      })
    },
    handler: (argv: any) => start(argv.port),
  } as CommandModule<any, any> & { description: string })
  .command({
    command: 'provision',
    description: 'provision cron jobs when deploying to production',
    showInHelp: true,
    builder: (yargs) => {
      return yargs.option('force', {
        alias: 'f',
        boolean: true,
        default: false,
        describe: 'force deletion of cron jobs not present in the current configuration',
      })
    },
    handler: (argv) => provision(argv.force),
  } as CommandModule<any, any> & { description: string })
  .help('h')
  .alias('h', 'help')
  .demandCommand(1)
  .parse()

async function install() {
  const tmpDir = os.tmpdir();
  const tarballExtracted = `${tmpDir}/.qron`;
  const binPath = `${tarballExtracted}/qron-dev`;

  if (fs.existsSync(binPath)) {
    return binPath;
  }

  fs.mkdirSync(tarballExtracted, { recursive: true });

  const versions = await fetch('https://api.github.com/repos/lucagez/qron/tags')
    .then(res => res.json() as Promise<{ name: string }[]>);
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
    .find((line = '') => line.includes(tarball))?.split(/\s+/)[0];

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

async function start(port: number = 9876) {
  let binPath
  try {
    binPath = await install()
  } catch (error) {
    console.error('Uh oh, something went wrong while installing qron-dev..');
    console.error('If the problem persists, please open an issue at:');
    console.error(' https://github.com/lucagez/qron/issues');
    console.error('');
    console.error('==========================================');
    console.error(error);
    console.error('==========================================');
    process.exit(1);
  }

  try {
    const args = [
      ...process.argv.slice(3),
      '-port', 
      String(port),
    ]
    const qron = spawn(binPath, args, {
      stdio: 'inherit',
    });
    qron.on('close', (code) => {
      process.exit(Number(code));
    });
    process.on('SIGINT', () => {
      qron.kill('SIGINT');
    });
  } catch (error) {
    // force reinstall
    fs.rmSync(binPath);

    console.error('Uh oh, something went wrong while running qron-dev..');
    console.error('The old binary has been deleted, try restarting the application.');
    console.error('If the problem persists, please open an issue at:');
    console.error(' https://github.com/lucagez/qron/issues');
    console.error('');
    console.error('==========================================');
    console.error(error)
    console.error('==========================================');
    process.exit(1);
  }
}

// Using remote provisioning enpoint for the following reasons:
// - avoid having to maintain provision complexity on a local client
// - avoid having to bundle sdk just for provisioning
async function provision(force: boolean = false) {
  const pkg = JSON.parse(fs.readFileSync(
    path.resolve('package.json'), 
    'utf8'
  ));
  const token = process.env['QRON_TOKEN'];

  if (!token) {
    console.error('Please make sure you have a valid `QRON_TOKEN` set in your environment.');
    process.exit(1);
  }

  const res = await fetch('https://qron.dev/api/provision', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify({
      force,
      jobs: pkg.qron || {},
    }),
  });

  if (res.status === 401) {
    console.error('Uh oh, something went wrong while provisioning cron jobs..');
    console.error('Please make sure you have a valid `QRON_TOKEN` set in your environment.');
    process.exit(1);
  }

  if (res.status === 200) {
    console.log('qron provisioning completed ⏰');
    process.exit(0);
  }

  if (res.status !== 200) {
    console.error('Uh oh, something went wrong while provisioning cron jobs..');
    console.error('If the problem persists, please open an issue at:');
    console.error('');
    console.error('==========================================');
    console.error(await res.text());
    console.error('==========================================');
    process.exit(1);
  }
}
