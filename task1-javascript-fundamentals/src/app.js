'use strict';

const { readTransactionsFromFile } = require('./file-reader');
const { fetchTransactions } = require('./transaction-fetcher');
const { validateTransactions } = require('./transaction-validator');
const { buildReport } = require('./report-builder');
const { printReport } = require('./report-printer');

function getTransactionSource(argumentsList) {
  const [firstArgument, secondArgument] = argumentsList;

  if (argumentsList.length === 2 && firstArgument === '--file' && secondArgument && secondArgument.trim()) {
    return { type: 'file', value: secondArgument };
  }

  if (argumentsList.length === 1 && isHttpUrl(firstArgument)) {
    return { type: 'url', value: firstArgument };
  }

  throw new Error('Usage: node transaction-report.js --file <path-to-transactions.json> OR node transaction-report.js <http(s)-url>');
}

function isHttpUrl(value) {
  try {
    const parsedUrl = new URL(value);

    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
}

async function getRawTransactions(source) {
  return source.type === 'file'
    ? readTransactionsFromFile(source.value)
    : fetchTransactions(source.value);
}

async function main(argumentsList = process.argv.slice(2)) {
  try {
    const source = getTransactionSource(argumentsList);
    const rawTransactions = await getRawTransactions(source);
    const transactions = validateTransactions(rawTransactions);
    const report = buildReport(transactions);

    printReport(report);
  } catch (error) {
    console.error(formatErrorMessage(error));
    process.exitCode = 1;
  }
}

function formatErrorMessage(error) {
  const isUrlError = error.message.startsWith('Network error:') || error.message.startsWith('Bad JSON:');

  return isUrlError ? error.message : `Error: ${error.message}`;
}

module.exports = { main, getTransactionSource, isHttpUrl, getRawTransactions };
