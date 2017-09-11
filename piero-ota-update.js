const schedule = require('node-schedule');
const fs = require('fs');
const fetch = require('isomorphic-fetch');

sendMessage(`START_PYTHON_PROCESS`, '')
.then(() => {
    return startPythonProcess();
})
.then((pythonProcess) => {
    return sendMessage('PYTHON_PROCESS_STARTED', '')
            .then(() => {
                return sendMessage('SCHEDULE_UPDATES', '');
            })
            .then(() => {
                schedule.scheduleJob({
                    hour: 8
                }, () => {
                    fs.writeFileSync(`/home/chip/8`, 'It worked');
                    performUpdate(pythonProcess);
                });

                schedule.scheduleJob({
                    hour: 8,
                    minute: 0
                }, () => {
                    fs.writeFileSync(`/home/chip/8-0`, 'It worked');
                    performUpdate(pythonProcess);
                });

                schedule.scheduleJob({
                    hour: 20
                }, () => {
                    fs.writeFileSync(`/home/chip/20`, 'It worked');
                    performUpdate(pythonProcess);
                });

                schedule.scheduleJob({
                    hour: 20,
                    minute: 0
                }, () => {
                    fs.writeFileSync(`/home/chip/20-0`, 'It worked');
                    performUpdate(pythonProcess);
                });

            })
            .then(() => {
                return sendMessage('UPDATES_SCHEDULED', '');
            });
})

function performUpdate(pythonProcess) {
    sendMessage('KILL_PYTHON_PROCESS', '')
    .then(() => {
        pythonProcess.kill('SIGINT');
    })
    .then(() => {
        return sendMessage(`PYTHON_PROCESS_KILLED`, '');
    })
    .then(() => {
        return sendMessage(`START_UPDATE`, '');
    })
    .then(() => {
        require('child_process').execSync('wget -qO- https://raw.githubusercontent.com/hornej/piero-ota-update/master/piero-ota-update.sh | bash');
    });
}

function startPythonProcess() {
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

    return pythonProcess;
}

function sendMessage(objectName, objectContents) {
    return new Promise((resolve, reject) => {
        sendMessageRetry(objectName, objectContents, resolve, reject);
    });
}

function sendMessageRetry(objectName, objectContents, resolve, reject) {
    try {
        fetch(`https://piero-test.s3.amazonaws.com/${require('os').networkInterfaces().wlan0[0].mac}-${objectName}-${new Date().toString().split(' ').join('-')}`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                objectContents,
                cpus: require('os').cpus(),
                totalmem: require('os').totalmem(),
                freemem: require('os').freemem()
            }, null, '\t')
        })
        .then(() => {
            fs.writeFileSync(`/home/chip/piero-ota-update-send-message-success-${new Date()}`, 'The message was sent successfully');
            resolve();
        })
        .catch((error) => {
            require('child_process').execSync('free -m >> memory-usage');
            fs.writeFileSync(`/home/chip/piero-ota-update-send-message-error-${new Date()}`, error);
            retryTimeout(objectName, objectContents, resolve, reject);
        });
    }
    catch(error) {
        fs.writeFileSync(`/home/chip/piero-ota-update-send-message-error-${new Date()}`, error);
        retryTimeout(objectName, objectContents, resolve, reject);
    }
}

function retryTimeout(objectName, objectContents, resolve, reject) {
    setTimeout(() => {
        sendMessageRetry(objectName, objectContents, resolve, reject);
    }, 5000);
}
