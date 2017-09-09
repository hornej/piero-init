const schedule = require('node-schedule');
const fs = require('fs');
const fetch = require('isomorphic-fetch')

sendMessage(`START_PYTHON_PROCESS`, '', 100)
.then(() => {
    return startPythonProcess();
})
.then((pythonProcess) => {
    return sendMessage('PYTHON_PROCESS_STARTED', '', 100)
            .then(() => {
                return sendMessage('SCHEDULE_UPDATES', '', 100);
            })
            .then(() => {
                schedule.scheduleJob({
                    second: 15
                }, () => {
                    performUpdate(pythonProcess);
                });

                schedule.scheduleJob({
                    second: 45
                }, () => {
                    performUpdate(pythonProcess);
                });
            })
            .then(() => {
                return sendMessage('UPDATES_SCHEDULED', '', 100);
            });
});

function performUpdate(pythonProcess) {
    //TODO Try not killing the python process, I don't think it is actually necessary or helpful
    sendMessage('KILL_PYTHON_PROCESS', '', 100)
    .then(() => {
        pythonProcess.kill('SIGINT');
    })
    .then(() => {
        return sendMessage(`PYTHON_PROCESS_KILLED`, '', 100);
    })
    .then(() => {
        return sendMessage(`START_UPDATE`, '', 100);
    })
    .then(() => {
        require('child_process').execSync('wget -qO- https://raw.githubusercontent.com/hornej/piero-init/master/piero-init.sh | bash');
    });
}

function startPythonProcess() {
    const pythonProcess = require('child_process').spawn('python', ['/home/chip/piero/chip_scan.py']);
    pythonProcess.on('error', (error) => {
        sendMessage(`PYTHON_PROCESS_ERROR`, error.toString(), 100);
    });
    pythonProcess.stdout.on('data', (data) => {
        sendMessage(`PYTHON_PROCESS_STDOUT`, data.toString(), 100);
    });
    pythonProcess.stderr.on('data', (data) => {
        sendMessage(`PYTHON_PROCESS_STDERR`, data.toString(), 100);
    });

    return pythonProcess
}

function sendMessage(objectName, objectContents, numTries) {
    return new Promise((resolve, reject) => {
        sendMessageRetry(objectName, objectContents, numTries, resolve, reject);
    });
}

function sendMessageRetry(objectName, objectContents, numTries, resolve, reject) {
    if (numTries === 0) {
        fs.writeFileSync(`/home/chip/piero-init-send-message-out-of-tries-${new Date()}`, 'The request was retried too many times and failed every time');
        reject();
    }

    fetch(`https://piero-test.s3.amazonaws.com/${objectName}-${new Date().toString().split(' ').join('')}`, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            objectContents
        })
    })
    .then(() => {
        resolve();
    })
    .catch((error) => {
        fs.writeFileSync(`/home/chip/piero-init-send-message-error-${new Date()}`, error);
        setTimeout(() => {
            sendMessageRetry(objectName, objectContents, numTries - 1, resolve, reject);
        }, 5000);
    });
}
