const schedule = require('node-schedule');
const fs = require('fs');
const fetch = require('isomorphic-fetch')

startPythonProcess().then((pythonProcess) => {
    schedule.scheduleJob({
        second: 10
    }, () => {
        sendMessage(`KILL_PYTHON_PROCESS`, '');
        pythonProcess.kill('SIGINT');

        sendMessage(`START_UPDATE`, '');
        require('child_process').execSync('wget -qO- https://raw.githubusercontent.com/hornej/piero-init/master/piero-init.sh | bash');
    });
});

function startPythonProcess() {
    return new Promise((resolve, reject) => {
        sendMessage(`START_PYTHON_PROCESS`, '').then(() => {
            const pythonProcess = require('child_process').spawn('python', ['/home/chip/piero/chip_scan.py']);
            pythonProcess.on('error', (error) => {
                sendMessage(`PYTHON_PROCESS_ERROR`, error.toString());
            });
            pythonProcess.stdout.on('data', (data) => {
                sendMessage(`PYTHON_PROCESS_STDOUT`, data.toString());
            });
            pythonProcess.stderr.on('data', (data) => {
                sendMessage(`PYTHON_PROCESS_STDERR`, data.toString());
            });

            resolve(pythonProcess);
        });
    });
}

function sendMessage(objectName, objectContents) {
    return fetch(`https://piero-test.s3.amazonaws.com/${objectName}-${new Date().toString().split(' ').join('')}`, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            objectContents
        })
    })
    .catch((error) => {
        fs.writeFileSync(`/home/chip/piero-init-send-message-error-${new Date()}`, error);
    });
}
