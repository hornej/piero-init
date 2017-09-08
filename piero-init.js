const schedule = require('node-schedule');
const fs = require('fs');

const childProcess = require('child_process').spawn('python', ['/home/chip/piero/chip_scan.py']);
fs.writeFileSync('/home/chip/python-process-started', 'it worked');

schedule.scheduleJob(`0 2 1 0 0 0`, () => {
    childProcess.kill('SIGINT');
    fs.writeFileSync('/home/chip/python-process-killed', 'it worked');
});
