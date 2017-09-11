# piero-ota-update

This repository contains all of the code necessary to initialize automatic scheduled over-the-air updating of piero software on a Chip Pro.

## Setup

### AWS S3

Create an S3 bucket on AWS. Set public write permissions on the bucket. Copy the URL of the bucket into the fetch function of the sendMessage function in `piero-ota-update.js`.
The URL has the format `https://[bucket name].s3.amazonaws.com/[object name]`. This will save diagnostic objects with the name of `object name` to the bucket.
The diagnostic objects have the following format:

```json
{
    "objectContents": "The contents of the message being sent",
    "cpus": "Information about the CPUs on the device, from Node.js require('os').cpus()",
    "totalmem": "The total memory on the device in bytes, from Node.js require('os').totalmem()",
    "freemem": "The total free memory on the device in bytes, from Node.js require('os').freemem()"
}
```

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

Extra debugging info is stored in files in the /home/chip directory. If messages stop being sent to S3, these files should provide helpful information.

## Notes

* node_modules is checked in to get rid of any possible issues with the npm cache, npm installs, and any reproducibility problems caused by transitive dependencies. Since we are not using npm 5 and the npm dependencies are small, this is a simple workable solution.
