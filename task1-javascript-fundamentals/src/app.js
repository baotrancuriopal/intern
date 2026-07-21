'use strict';

const { readTransactionsFromFile } = require('./file-reader');
const { validateTransactions } = require('./transaction-validator');
const { buildReport } = require('./report-builder');
const { printReport } = require('./report-printer');

function getFilePathFromArguments(argumentsList) {
  const [flag, filePath] = argumentsList;

  if (argumentsList.length !== 2 || flag !== '--file' || !filePath || !filePath.trim()) {
    throw new Error('Usage: node transaction-report.js --file <path-to-transactions.json>');
  }

  return filePath;
}

function main(argumentsList = process.argv.slice(2)) {
  try {
    const filePath = getFilePathFromArguments(argumentsList);
    const rawTransactions = readTransactionsFromFile(filePath);
    const transactions = validateTransactions(rawTransactions);
    const report = buildReport(transactions);

    printReport(report);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = { main, getFilePathFromArguments };
