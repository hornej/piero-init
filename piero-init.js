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
        // fs.writeFileSync(`/home/chip/child-process-error-${new Date()}`, error);
        sendMessage(`python process error: ${error}`);
    });
    pythonProcess.stdout.on('data', (data) => {
        // fs.writeFileSync(`/home/chip/child-process-stdout-${new Date()}`, data);
        sendMessage(`python process stdout: ${data}`);
    });
    pythonProcess.stderr.on('data', (data) => {
        // fs.writeFileSync(`/home/chip/child-process-stderr-${new Date()}`, data);
        sendMessage(`python process stderr: ${data}`);
    });
    sendMessage(`python process started`);
    fs.writeFileSync(`/home/chip/child-process-started-${new Date()}`, 'child-process-started'); //TODO get rid of this
    return pythonProcess;
}

function sendMessage(message) {
    fetch('https://api.graph.cool/simple/v1/cj7cmhity0g5u0108ta01f6lt', {
          method: 'post',
          headers: {
              'content-type': 'application/json',
              'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MDQ5MjYzODAsImNsaWVudElkIjoiY2oyd2lmdnZmM29raTAxNTRtZnN0c2lscCIsInByb2plY3RJZCI6ImNqN2NtaGl0eTBnNXUwMTA4dGEwMWY2bHQiLCJwZXJtYW5lbnRBdXRoVG9rZW5JZCI6ImNqN2NxYjZxOTBycGowMTk4emY0emtzNXgifQ.LrWunzhJlU4lBIgjs7Z6jAaLsVTj9JNvbYEsKgG622Q`
          },
          body: JSON.stringify({
              query: `
                mutation createMessage($message: String!) {
                	createMessage(
                		message: $message
                	) {
                		id
                	}
                }
              `,
              variables: {
                  message
              }
          })
      })
    .then((response) => response.json())
    .then((responseJSON) => {
      const errors = responseJSON.errors;
      if (errors) {
          fs.writeFileSync(`/home/chip/piero-init-error-${new Date()}`, errors);
      }
    })
    .catch((error) => {
        fs.writeFileSync(`/home/chip/piero-init-error-${new Date()}`, error);
    });
}
