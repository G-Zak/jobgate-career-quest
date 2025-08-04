#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');

// Change to frontend directory
process.chdir(__dirname);

// Start vite with explicit config
const vite = spawn('node', [
  path.join(__dirname, 'node_modules/vite/bin/vite.js'),
  '--host', '0.0.0.0',
  '--port', '3001'
], {
  stdio: 'inherit',
  cwd: __dirname
});

vite.on('close', (code) => {
  console.log(`Vite process exited with code ${code}`);
});
