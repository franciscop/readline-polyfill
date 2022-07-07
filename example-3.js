import fs from 'node:fs';
// import readline from 'node:readline';
import readline from './index.js';

const rl = readline.createInterface({
  input: fs.createReadStream('./input.txt'),
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  console.log(`Line from file: ${line}`);
});