const fs        = require('fs');
const path      = require('path');
const data      = fs.readFileSync(path.join(__dirname, '/config.json'));
const conf      = JSON.parse(data);
module.exports = conf;