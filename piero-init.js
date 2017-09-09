const schedule = require('node-schedule');
const fs = require('fs');
const pythonProcess = startPythonProcess();

schedule.scheduleJob({
    second: 5
}, () => {
    //childProcess.kill('SIGINT'); //TODO we might want to kill the python process...maybe not though...probably not
    require('child_process').execSync('wget -qO- https://raw.githubusercontent.com/hornej/piero-init/master/piero-init.sh | bash');
});

// schedule.scheduleJob({
//     second: 5
// }, performPullRoutine);
//
// schedule.scheduleJob({
//     second: 35
// }, performPullRoutine);
//
// function performPullRoutine() {
//     git.silent(true).pull('origin', 'master', (error, data) => {
//         if (error) {
//             //TODO send out failure message
//             fs.writeFileSync(`/home/chip/git-pull-error-${new Date()}`, error);
//             return;
//         }
//
//         if (data) {
//             //TODO send out success message
//             childProcess.kill('SIGINT'); //TODO I want to be sure the process is killed
//             childProcess = startPythonProcess();
//             fs.writeFileSync(`/home/chip/git-pull-success-${new Date()}`, data);
//             return;
//         }
//     });
// }
//
function startPythonProcess() {
    const pythonProcess = require('child_process').spawn('python', ['/home/chip/piero/chip_scan.py']);
    pythonProcess.on('error', (error) => {
        fs.writeFileSync(`/home/chip/child-process-error-${new Date()}`, error);
    });
    pythonProcess.stdout.on('data', (data) => {
        fs.writeFileSync(`/home/chip/child-process-stdout-${new Date()}`, data);
    });
    pythonProcess.stderr.on('data', (data) => {
        fs.writeFileSync(`/home/chip/child-process-stderr-${new Date()}`, data);
    });
    fs.writeFileSync(`/home/chip/child-process-started-${new Date()}`, 'child-process-started');
    return pythonProcess;
}
