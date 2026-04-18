#!/usr/bin/env node

import { Command } from 'commander';
import 'dotenv/config';

// action imports
import validate from './actions/validate.js';
import create from './actions/create.js';

const program = new Command();

program
  .name('fcmf-cli')
  .description('Command-line interface for FCMF (Flax Collection Manifest Format)')
  .version(process.env.npm_package_version!);

program
  .command('validate')
  .description('Validate a FCMF manifest file')
  .argument('<path>', 'Path to the FCMF manifest file')
  .action((path) => {
    validate(path);
  });

program
  .command('create')
  .description('Create a new FCMF manifest file')
  .argument('[path]', 'Path where the FCMF manifest file will be created, if not provided, the manifest content will be output to the console')
  .option('-a, --authorid <authorid>', 'Author ID/username for the manifest, optional, one will be generated if not provided')
  .option('-l, --link <link>', 'Link to the manifest, optional')
  .option('-p, --projectlink <projectlink>', 'Project link/discord server/website/email for the manifest, ANYTHING that can be used to reach the author, optional')
  .action((path, options) => {
    create(path, options);
  });

program.parse(process.argv);