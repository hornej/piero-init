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
            fs.writeFileSync(`/home/chip/error-${new Date()}`, error);
            return;
        }

        if (data) {
            console.log('data');
            //TODO start the python process again
            //TODO send out success message
            childProcess.kill('SIGINT'); //TODO I want to be sure the process is killed
            childProcess = startPythonProcess();
            fs.writeFileSync(`/home/chip/success-${new Date()}`, data);
            return;
        }
    });
});

//TODO I want to be sure the process is started correctly
function startPythonProcess() {
    return require('child_process').spawn('python', ['/home/chip/piero/chip_scan.py']);
}
