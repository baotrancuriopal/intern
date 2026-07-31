'use strict';

function buildReport(transactions) {
  return {
    categoryTotals: buildCategoryTotals(transactions),
    topTransactions: findTopTransactions(transactions),
    monthlyAverages: buildMonthlyAverages(transactions)
  };
}

function buildCategoryTotals(transactions) {
  const totalsByCategory = transactions.reduce((totals, transaction) => ({
    ...totals,
    [transaction.category]: (totals[transaction.category] || 0) + transaction.amount
  }), {});

  return Object.entries(totalsByCategory)
    .map(([category, total]) => ({ category, total }))
    .sort((first, second) => first.category.localeCompare(second.category));
}

function findTopTransactions(transactions) {
  return transactions
    .map((transaction, index) => ({ transaction, index }))
    .sort((first, second) => second.transaction.amount - first.transaction.amount || first.index - second.index)
    .slice(0, 3)
    .map(({ transaction }) => transaction);
}

function buildMonthlyAverages(transactions) {
  const totalsByMonth = transactions.reduce((totals, transaction) => {
    const month = transaction.date.slice(0, 7);
    const currentMonth = totals[month] || { total: 0, count: 0 };

    return {
      ...totals,
      [month]: {
        total: currentMonth.total + transaction.amount,
        count: currentMonth.count + 1
      }
    };
  }, {});

  return Object.entries(totalsByMonth)
    .map(([month, { total, count }]) => ({ month, average: total / count }))
    .sort((first, second) => first.month.localeCompare(second.month));
}

module.exports = { buildReport };
