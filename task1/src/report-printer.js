'use strict';

function printReport(report, output = console.log) {
  output('Transaction Report');
  output('==================');
  output('');

  printCategoryTotals(report.categoryTotals, output);
  output('');
  printTopTransactions(report.topTransactions, output);
  output('');
  printMonthlyAverages(report.monthlyAverages, output);
}

function printCategoryTotals(categoryTotals, output) {
  output('Total Amount by Category');
  output('------------------------');

  if (categoryTotals.length === 0) {
    output('No transactions found.');
    return;
  }

  categoryTotals.forEach(({ category, total }) => {
    output(`${category}: ${formatAmount(total)}`);
  });
}

function printTopTransactions(topTransactions, output) {
  output('Top 3 Largest Transactions');
  output('--------------------------');

  if (topTransactions.length === 0) {
    output('No transactions found.');
    return;
  }

  topTransactions.forEach(({ category, amount, date }, index) => {
    output(`${index + 1}. ${category} | ${formatAmount(amount)} | ${date}`);
  });
}

function printMonthlyAverages(monthlyAverages, output) {
  output('Monthly Average Amounts');
  output('-----------------------');

  if (monthlyAverages.length === 0) {
    output('No transactions found.');
    return;
  }

  monthlyAverages.forEach(({ month, average }) => {
    output(`${month}: ${formatAmount(average)}`);
  });
}

function formatAmount(amount) {
  return amount.toFixed(2);
}

module.exports = { printReport };
