'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { buildReport } = require('./log-processor');

async function withTemporaryDirectory(callback) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'log-processor-'));
  try {
    await callback(directory);
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
}

test('aggregates errors by file, hour, and message', async () => {
  await withTemporaryDirectory(async (directory) => {
    const logFolder = path.join(directory, 'logs');
    await fs.mkdir(logFolder);
    await fs.writeFile(
      path.join(logFolder, 'api.log'),
      '2026-01-02 10:01:00 ERROR Database unavailable\n2026-01-02 10:02:00 INFO Complete\n'
    );
    await fs.writeFile(path.join(logFolder, 'worker.log'), '2026-01-02 10:05:00 ERROR Database unavailable\n');

    const report = await buildReport(logFolder, path.join(directory, 'report.json'));

    assert.equal(report.errors_total, 2);
    assert.deepEqual(report.errors_per_file, { 'api.log': 1, 'worker.log': 1 });
    assert.deepEqual(report.errors_per_hour, { '2026-01-02T10:00:00': 2 });
    assert.deepEqual(report.top_error_messages, [{ message: 'Database unavailable', count: 2 }]);
  });
});

test('creates an empty report for an empty folder', async () => {
  await withTemporaryDirectory(async (directory) => {
    const logFolder = path.join(directory, 'logs');
    await fs.mkdir(logFolder);

    const report = await buildReport(logFolder, path.join(directory, 'report.json'));

    assert.equal(report.files_scanned, 0);
    assert.equal(report.errors_total, 0);
    assert.deepEqual(report.errors_per_file, {});
  });
});

test('reports an unreadable file without aborting the job', async () => {
  await withTemporaryDirectory(async (directory) => {
    const logFolder = path.join(directory, 'logs');
    const blockedFile = path.join(logFolder, 'blocked.log');
    await fs.mkdir(logFolder);
    await fs.writeFile(blockedFile, '2026-01-02 10:01:00 ERROR Not readable\n');
    const realReadFile = fs.readFile;
    fs.readFile = async (filePath, ...argumentsList) => {
      if (path.resolve(filePath) === path.resolve(blockedFile)) {
        const error = new Error('access denied');
        error.code = 'EACCES';
        throw error;
      }
      return realReadFile(filePath, ...argumentsList);
    };

    try {
      const report = await buildReport(logFolder, path.join(directory, 'report.json'));
      assert.equal(report.files_scanned, 0);
      assert.equal(report.files_unreadable, 1);
      assert.equal(report.unreadable_files[0].file, 'blocked.log');
    } finally {
      fs.readFile = realReadFile;
    }
  });
});
