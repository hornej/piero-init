const schedule = require('node-schedule');
const fs = require('fs');

const childProcess = require('child_process').spawn('python', ['/home/chip/piero/chip_scan.py']);

schedule.scheduleJob({
    hour: 3,
    minute: 25
}, () => {
    childProcess.kill('SIGINT');
    fs.writeFileSync('/home/chip/python-process-killed', 'it worked');
});
