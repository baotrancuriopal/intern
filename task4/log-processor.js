#!/usr/bin/env node
'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');

const ERROR_TOKEN = /\bERROR\b/i;
const TIMESTAMP_AT_START = /^\s*(\d{4}-\d{2}-\d{2})[ T](\d{2}):\d{2}/;

function requiredPath(variableName, environment) {
  const value = environment[variableName];

  if (!value || !value.trim()) {
    throw new Error(`${variableName} is required but was not set.`);
  }

  return path.resolve(value);
}

function hourFromLine(line) {
  const match = line.match(TIMESTAMP_AT_START);

  return match ? `${match[1]}T${match[2]}:00:00` : 'unknown';
}

function messageFromLine(line, errorIndex) {
  const message = line.slice(errorIndex + 'ERROR'.length).trim().replace(/^[:\-]\s*/, '').trim();

  return message || '(no message)';
}

function increment(counter, key) {
  counter.set(key, (counter.get(key) || 0) + 1);
}

function sortedObject(counter) {
  return Object.fromEntries([...counter.entries()].sort(([left], [right]) => left.localeCompare(right)));
}

async function findLogFiles(logFolder, outputPath, io = fs) {
  const logFiles = [];
  const scanErrors = [];
  const resolvedOutputPath = path.resolve(outputPath);

  async function walk(directory) {
    let entries;
    try {
      entries = await io.readdir(directory, { withFileTypes: true });
    } catch (error) {
      scanErrors.push({ path: directory, error: error.message });
      return;
    }

    for (const entry of entries) {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        await walk(entryPath);
      } else if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.log') {
        if (path.resolve(entryPath) !== resolvedOutputPath) {
          logFiles.push(entryPath);
        }
      }
    }
  }

  await walk(logFolder);
  logFiles.sort((left, right) => left.localeCompare(right));
  return { logFiles, scanErrors };
}

async function buildReport(logFolder, outputPath, io = fs) {
  const { logFiles, scanErrors } = await findLogFiles(logFolder, outputPath, io);
  const errorsPerFile = new Map();
  const errorsPerHour = new Map();
  const messages = new Map();
  const unreadableFiles = [];

  for (const logFile of logFiles) {
    const relativeFile = path.relative(logFolder, logFile).split(path.sep).join('/');
    let fileErrorCount = 0;
    let content;

    try {
      content = await io.readFile(logFile, 'utf8');
    } catch (error) {
      unreadableFiles.push({ file: relativeFile, error: error.message });
      continue;
    }

    for (const line of content.split(/\r?\n/)) {
      const errorMatch = ERROR_TOKEN.exec(line);
      if (!errorMatch) {
        continue;
      }

      fileErrorCount += 1;
      increment(errorsPerHour, hourFromLine(line));
      increment(messages, messageFromLine(line, errorMatch.index));
    }

    errorsPerFile.set(relativeFile, fileErrorCount);
  }

  const topErrorMessages = [...messages.entries()]
    .sort(([leftMessage, leftCount], [rightMessage, rightCount]) =>
      rightCount - leftCount || leftMessage.localeCompare(rightMessage)
    )
    .slice(0, 10)
    .map(([message, count]) => ({ message, count }));

  return {
    scanned_folder: path.resolve(logFolder),
    generated_at: new Date().toISOString(),
    files_scanned: errorsPerFile.size,
    files_unreadable: unreadableFiles.length,
    errors_total: [...errorsPerFile.values()].reduce((total, count) => total + count, 0),
    errors_per_file: sortedObject(errorsPerFile),
    errors_per_hour: sortedObject(errorsPerHour),
    top_error_messages: topErrorMessages,
    unreadable_files: unreadableFiles,
    scan_errors: scanErrors,
  };
}

async function main(environment = process.env) {
  try {
    const logFolder = requiredPath('LOG_FOLDER', environment);
    const outputPath = requiredPath('REPORT_PATH', environment);
    const folderStats = await fs.stat(logFolder);

    if (!folderStats.isDirectory()) {
      throw new Error(`LOG_FOLDER is not a directory: ${logFolder}`);
    }

    const report = await buildReport(logFolder, outputPath);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    return 0;
  } catch (error) {
    console.error(`log processor failed: ${error.message}`);
    return 1;
  }
}

if (require.main === module) {
  main().then((exitCode) => {
    process.exitCode = exitCode;
  });
}

module.exports = { buildReport, findLogFiles, hourFromLine, main, messageFromLine };
