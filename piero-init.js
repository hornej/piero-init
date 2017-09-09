const schedule = require('node-schedule');
const fs = require('fs');
const git = require('simple-git')('../piero');

let childProcess = startPythonProcess();

schedule.scheduleJob({
    second: 5
}, () => {
    git.silent(true).pull('origin', 'master', (error, data) => {
        if (error) {
            //TODO send out failure message
            fs.writeFileSync(`/home/chip/git-pull-error-${new Date()}`, error);
            return;
        }

        if (data) {
            //TODO send out success message
            childProcess.kill('SIGINT'); //TODO I want to be sure the process is killed
            childProcess = startPythonProcess();
            fs.writeFileSync(`/home/chip/git-pull-success-${new Date()}`, data);
            return;
        }
    });
});

function startPythonProcess() {
    const childProcess = require('child_process').spawn('python', ['/home/chip/piero/chip_scan.py']);
    childProcess.on('error', (error) => {
        fs.writeFileSync(`/home/chip/child-process-error-${new Date()}`, error);
    });
    fs.writeFileSync(`/home/chip/child-process-started-${new Date()}`, 'child-process-started');
    return childProcess;
}
