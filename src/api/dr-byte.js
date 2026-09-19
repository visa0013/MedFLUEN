// Server only. Never prefix GEMINI_API_KEY with REACT_APP_.
const { createHandler } = require('./_lib/dr-byte-core.cjs');
module.exports = createHandler();
