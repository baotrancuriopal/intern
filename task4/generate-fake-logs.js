#!/usr/bin/env node
'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');

const SAMPLE_LOGS = {
  'api.log': [
    '2026-07-22 09:15:04 INFO Request started',
    '2026-07-22 09:18:10 ERROR Database connection failed',
    '2026-07-22 10:02:11 ERROR Request timed out',
    '2026-07-22 10:05:00 INFO Request complete',
  ],
  'worker.log': [
    '2026-07-22 09:31:00 INFO Worker started',
    '2026-07-22 09:33:42 ERROR Database connection failed',
    '2026-07-22 11:01:03 ERROR Queue message malformed',
  ],
  'archive.log': [
    '2026-07-21 23:59:59 INFO Archive complete',
    '2026-07-22 11:07:20 ERROR Queue message malformed',
  ],
};

function outputFolderFromArguments(argumentsList) {
  if (argumentsList.length === 0) {
    return 'fake_logs';
  }

  if (argumentsList.length === 2 && argumentsList[0] === '--output-folder' && argumentsList[1].trim()) {
    return argumentsList[1];
  }

  throw new Error('Usage: node generate-fake-logs.js [--output-folder <folder>]');
}

async function main(argumentsList = process.argv.slice(2)) {
  try {
    const outputFolder = path.resolve(outputFolderFromArguments(argumentsList));
    await fs.mkdir(outputFolder, { recursive: true });
    await Promise.all(
      Object.entries(SAMPLE_LOGS).map(([fileName, lines]) =>
        fs.writeFile(path.join(outputFolder, fileName), `${lines.join('\n')}\n`, 'utf8')
      )
    );
    console.log(`Created ${Object.keys(SAMPLE_LOGS).length} fake log files in ${outputFolder}`);
    return 0;
  } catch (error) {
    console.error(`fake-log generation failed: ${error.message}`);
    return 1;
  }
}

if (require.main === module) {
  main().then((exitCode) => {
    process.exitCode = exitCode;
  });
}

module.exports = { main, outputFolderFromArguments };
