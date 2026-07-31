#!/usr/bin/env node
'use strict';

const { main } = require('./src/app');

if (require.main === module) {
  main();
}

module.exports = { main };
