# Log processor


cd task4
node generate-fake-logs.js --output-folder fake_logs
$env:LOG_FOLDER="fake_logs"; $env:REPORT_PATH="report.json"; node log-processor.js


The job recursively scans `.log` files, counts `ERROR` lines by file, hour, and message, then writes a JSON report. Empty folders and unreadable files are handled safely; invalid configuration exits with code `1`, while successful runs exit with `0`.
