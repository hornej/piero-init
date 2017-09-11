#TODO use correct time: sudo apt-get install ntp

echo "Move to /home/chip"
cd /home/chip

echo "Cloning piero-ota-update repository"
rm -rf piero-ota-update
git clone https://github.com/hornej/piero-ota-update.git

#TODO Clearnig the npm cache should not be necessary once using a version of Node with npm 5 or greater
# Clearing the cache will ensure that the cache is not in an inconsistent state because of unexpected interruptions during npm installs
echo "Clearing npm cache"
npm cache clean

echo "Installing npm dependencies"
cd piero-ota-update
npm install
cd ..

echo "Cloning piero repository"
rm -rf piero
git clone https://github.com/lastmjs/piero.git

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
