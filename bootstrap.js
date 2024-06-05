import { register } from 'ts-node';
import { pathToFileURL } from 'url';
import path from 'path';

// Register the ts-node loader
register({
  transpileOnly: true,
  esm: true
});

const fileUrl = pathToFileURL(path.resolve('./backend/src/index.ts')).href;

console.log(`Loading ${fileUrl}`);

import(fileUrl).catch(err => {
    console.error('Error importing file:', err);
});
