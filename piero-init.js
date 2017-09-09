const schedule = require('node-schedule');
const fs = require('fs');
const fetch = require('isomorphic-fetch')

startPythonProcess();

schedule.scheduleJob({
    minute: 0
}, () => {
    require('child_process').execSync('wget -qO- https://raw.githubusercontent.com/hornej/piero-init/master/piero-init.sh | bash');
});

function startPythonProcess() {
    const pythonProcess = require('child_process').spawn('python', ['/home/chip/piero/chip_scan.py']);
    pythonProcess.on('error', (error) => {
        sendMessage(`python process error: ${error}`);
    });
    pythonProcess.stdout.on('data', (data) => {
        sendMessage(`python process stdout: ${data}`);
    });
    pythonProcess.stderr.on('data', (data) => {
        sendMessage(`python process stderr: ${data}`);
    });

    sendMessage(`python process started`);

    return pythonProcess;
}

function sendMessage(message) {
    fetch('https://piero-test.s3.amazonaws.com/message', {
        method: 'put',
        body: JSON.stringify({
            message
        })
    })
    .catch((error) => {
        fs.writeFileSync(`/home/chip/piero-init-error-${new Date()}`, error);
    });
}
