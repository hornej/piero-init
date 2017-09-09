# piero-ota-update

This repository contains all of the code necessary to initialize automatic scheduled over-the-air updating of piero software on a Chip Pro.

## Setup

### AWS S3

Create an S3 bucket on AWS. Set public write permissions on the bucket. Copy the URL of the bucket into the fetch function of the sendMessage function in `piero-ota-update.js`.
The URL has the format `https://[bucket name].s3.amazonaws.com/[object name]`. This will save diagnostic objects with the name of `object name` to the bucket.

### Chip Pro

Make sure you can connect to your device, and that it is connected to the Internet. [See here for more detailed information](https://docs.getchip.com/chip_pro.html#connect-and-control).

Run the following command on your device:

```bash
wget -qO- https://raw.githubusercontent.com/hornej/piero-ota-update/master/piero-ota-update.sh | bash
```

Your device will now be initialized and will restart itself. On startup, `piero-ota-update.js` will execute.
`piero-ota-update.js` will run the setup script multiple times per day. Each time the script is run, the Chip Pro is reinitialized and restarted with the latest code from the piero and piero-ota-update repositories.
Diagnostic messages will be sent to the S3 bucket configured in `piero-ota-update.js`.

## Debugging

Extra debugging info is stored in files in the /home/chip directory. If messages stop being sent to S3, the logs should tell you why.
