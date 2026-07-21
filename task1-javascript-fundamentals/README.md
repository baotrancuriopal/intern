# Transaction Report CLI — Stage 1

## Project description

A plain Node.js command-line tool that reads transactions from a local JSON file and prints:

- total amount by category;
- the three largest transactions; and
- average transaction amount for each month.

This is the Stage 1 implementation. It deliberately supports local files only; URL fetching is not implemented. The file-reading, validation, report-building, and printing responsibilities are separated so a later data source can pass transactions into the existing validation and report logic without rewriting it.

## Requirements

- Node.js 18 or later (no installation or third-party packages are required)
- A JSON file whose root value is an array of transactions
- Each transaction must have:
  - `category`: a non-empty string
  - `amount`: a finite number
  - `date`: a real ISO date in `YYYY-MM-DD` format

## Folder structure

```text
task1-javascript-fundamentals/
├── transaction-report.js       # CLI entry point
├── sample-transactions.json    # Valid sample input
├── fixtures/
│   ├── invalid-json.json       # Malformed JSON fixture
│   └── missing-fields.json     # Invalid field fixture
└── src/
    ├── app.js                  # Arguments and application orchestration
    ├── file-reader.js          # Local-file reading and JSON parsing
    ├── transaction-validator.js# Transaction validation
    ├── report-builder.js       # Category, ranking, and monthly calculations
    └── report-printer.js       # Console formatting
```

## How to run

From this folder, run:

```bash
node transaction-report.js --file sample-transactions.json
```

No `npm install` step is needed because the project uses only Node.js built-in modules.

## Expected output

Running the command above prints:

```text
Transaction Report
==================

Total Amount by Category
------------------------
entertainment: 200.00
food: 260.00
transport: 135.00
utilities: 150.00

Top 3 Largest Transactions
--------------------------
1. entertainment | 200.00 | 2026-02-03
2. utilities | 150.00 | 2026-02-23
3. food | 120.00 | 2026-01-05

Monthly Average Amounts
-----------------------
2026-01: 81.67
2026-02: 136.67
2026-03: 90.00
```

## Testing failure cases

All failures are handled with a concise error message and no stack trace.

| Failure case | Command to test | Expected result |
| --- | --- | --- |
| File cannot be read | `node transaction-report.js --file does-not-exist.json` | Explains that the file cannot be read. |
| Invalid JSON | `node transaction-report.js --file fixtures/invalid-json.json` | Reports invalid JSON. |
| Missing or invalid category, amount, or date | `node transaction-report.js --file fixtures/missing-fields.json` | Identifies each invalid transaction and field. |
| Missing CLI argument | `node transaction-report.js` | Prints the required command usage. |

For a custom date test, use a value such as `"2026-02-30"`; it is rejected because it is not a real calendar date. Amounts must be JSON numbers, not quoted numeric strings.
