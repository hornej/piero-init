#TODO use correct time: sudo apt-get install ntp

echo "Downloading nvm"
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.4/install.sh | bash

echo "Move to /home/chip"
cd /home/chip

echo "Cloning piero-ota-update repository"
rm -rf piero-ota-update
git clone https://github.com/hornej/piero-ota-update.git

echo "Installing npm dependencies"
cd piero-ota-update
npm install
cd ..

echo "Cloning piero repository"
rm -rf piero
git clone https://github.com/hornej/piero.git

echo "Installing CHIP_IO"
cd piero
pip install CHIP_IO
cd ..

echo "Copying piero-ota-update.service to /etc/systemd/system directory"
cd piero-ota-update
cp piero-ota-update.service /etc/systemd/system

echo "Enable piero-ota-update.service on startup"
systemctl enable piero-ota-update.service

echo "Initialization successful"

echo "Restarting device"
reboot
