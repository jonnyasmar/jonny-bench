#!/usr/bin/env node
import { validateManifest } from '../bin/jonny-bench.mjs';

validateManifest()
  .then(() => {
    console.log('manifest ok');
  })
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
