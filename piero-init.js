const childProcess = require('child_process').spawn('python', ['/home/chip/piero/chip_scan.py']);

const fs = require('fs');
fs.writeFileSync('/home/chip/it-worked', 'it worked');
