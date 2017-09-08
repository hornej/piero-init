const schedule = require('node-schedule');
const fs = require('fs');

const childProcess = require('child_process').spawn('python', ['/home/chip/piero/chip_scan.py']);

schedule.scheduleJob(`15 * * * * *`, () => {
    childProcess.kill('SIGINT');
    fs.writeFileSync('/home/chip/python-process-killed', 'it worked');
});
