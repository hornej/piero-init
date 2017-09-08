const schedule = require('node-schedule');
const fs = require('fs');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const transporter = nodemailer.createTransport(smtpTransport({
    host: 'localhost',
    port: 25,
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
