'use strict';

function validateTransactions(rawTransactions) {
  if (!Array.isArray(rawTransactions)) {
    throw new Error('The JSON file must contain an array of transactions.');
  }

  const validationResults = rawTransactions.map((transaction, index) => ({
    transaction,
    index,
    errors: getTransactionErrors(transaction)
  }));
  const errorMessages = validationResults
    .filter(({ errors }) => errors.length > 0)
    .map(({ index, errors }) => `Transaction ${index + 1}: ${errors.join(' ')}`);

  if (errorMessages.length > 0) {
    throw new Error(`Invalid transaction data:\n${errorMessages.map((message) => `- ${message}`).join('\n')}`);
  }

  return validationResults.map(({ transaction }) => ({
    category: transaction.category.trim(),
    amount: transaction.amount,
    date: transaction.date
  }));
}

function getTransactionErrors(transaction) {
  if (!transaction || typeof transaction !== 'object' || Array.isArray(transaction)) {
    return ['must be an object.'];
  }

  return [
    ...(!isValidCategory(transaction.category) ? ['category must be a non-empty string.'] : []),
    ...(!isValidAmount(transaction.amount) ? ['amount must be a finite number.'] : []),
    ...(!isValidIsoDate(transaction.date) ? ['date must be a valid ISO date (YYYY-MM-DD).'] : [])
  ];
}

function isValidCategory(category) {
  return typeof category === 'string' && category.trim().length > 0;
}

function isValidAmount(amount) {
  return typeof amount === 'number' && Number.isFinite(amount);
}

function isValidIsoDate(date) {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const [year, month, day] = date.split('-').map(Number);
  const daysInMonth = getDaysInMonth(year, month);

  return year > 0 && month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth;
}

function getDaysInMonth(year, month) {
  const daysByMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  return daysByMonth[month - 1] || 0;
}

function isLeapYear(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

module.exports = { validateTransactions, isValidIsoDate };
