# piero-init

This repository contains all of the code necessary to initialize a Chip Pro for use with piero.

## Use

Make sure you can connect to your device, and that it is connected to the internet. [See here for more detailed information](https://docs.getchip.com/chip_pro.html#connect-and-control).

Run the following command on your device:

TODO change ownership of this repo to Josh
```bash
wget -qO- https://raw.githubusercontent.com/hornej/piero-init/master/piero-init.sh | bash
```

Your device will now be initialized and will restart itself. On startup, piero-init.js will execute.
piero-init.js causes the piero repo's master branch to be updated from the master branch on GitHub multiple times per day.
When a successful pull occurs, the piero code is stopped and then restarted with the current version on the master branch.
The status of the pulls to the piero repo will be emailed to the encoded email addresses.
