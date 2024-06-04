// bootstrap.js Bootstrap File: bootstrap.js registers the ts-node loader.
// nodemon.json: Configures nodemon to use the custom loader and TypeScript support.
// This setup allows you to use nodemon with ts-node and handle ES modules correctly, providing a smooth development experience for your TypeScript application.
import { register } from 'module';
import { pathToFileURL } from 'url';

// Register the ts-node loader
register('ts-node/esm', pathToFileURL('./'));
