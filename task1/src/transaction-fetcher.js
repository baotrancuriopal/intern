'use strict';

const { parseJson } = require('./file-reader');

async function fetchTransactions(url) {
  const response = await requestUrl(url);

  if (!response.ok) {
    throw new Error(`Network error: server responded with HTTP ${response.status}.`);
  }

  const responseText = await readResponseText(response);

  return parseJson(responseText, 'Bad JSON: server response is not valid JSON.');
}

async function requestUrl(url) {
  try {
    return await fetch(url);
  } catch {
    throw new Error('Network error: could not reach the server.');
  }
}

async function readResponseText(response) {
  try {
    return await response.text();
  } catch {
    throw new Error('Network error: could not read the server response.');
  }
}

module.exports = { fetchTransactions };
