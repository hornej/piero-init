const schedule = require('node-schedule');
const fs = require('fs');
const nodemailer = require('nodemailer');
const SMTPServer = require('smtp-server');
const smtpServer = new SMTPServer();
const smtpServerPort = 25;
smtpServer.listen(smtpServerPort);
const smtpTransport = require('nodemailer-smtp-transport');
const transporter = nodemailer.createTransport(smtpTransport({
    host: 'localhost',
    port: smtpServerPort,
    auth: {
        user: 'username',
        pass: 'password'
    }
}));
const childProcess = require('child_process').spawn('python', ['/home/chip/piero/chip_scan.py']);

schedule.scheduleJob({
    second: 5
}, () => {
    childProcess.kill('SIGINT');
    fs.writeFileSync(`/home/chip/python-process-killed-${new Date()}`, 'it worked');
    transporter.sendMail({
        from: 'robot@fake-address.com',
        to: 'jordan.michael.last@gmail.com',
        subject: 'Test',
        text: 'This is a test'
    });
});
