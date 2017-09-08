const fs = require('fs');
fs.writeFileSync(`/home/chip/test-${new Date()}`, new Date());
