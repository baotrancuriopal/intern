'use strict';

const fs = require('node:fs');

function readTransactionsFromFile(filePath) {
  let fileContents;

  try {
    fileContents = fs.readFileSync(filePath, 'utf8');
  } catch {
    throw new Error(`Cannot read file "${filePath}". Check that it exists and is readable.`);
  }

  return parseJson(fileContents);
}

function parseJson(fileContents) {
  try {
    return JSON.parse(fileContents);
  } catch {
    throw new Error('The input file contains invalid JSON.');
  }
}

module.exports = { readTransactionsFromFile, parseJson };
