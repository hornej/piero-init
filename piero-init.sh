echo "Move to /home/chip"
cd /home/chip

echo "Cloning piero-init repository"
git clone https://github.com/lastmjs/piero-init.git

echo "Cloning piero repository"
git clone https://github.com/hornej/piero.git

echo "Downloading nvm"
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.4/install.sh | bash

# echo "Resetting the terminal for nvm not implemented"

# echo "Install Node.js v8.4.0"
# nvm install 8.4.0

echo "Copying piero-init.service to /etc/systemd/system directory"
cd piero-init
cp piero-init.service /etc/systemd/system

echo "Enable piero-init.service on startup"
systemctl enable piero-init.service

echo "Initialization successful"

echo "Restarting device"
reboot
