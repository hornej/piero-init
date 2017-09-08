const fs = require('fs');

setInterval(() => {
    fs.writeFileSync(`/home/chip/test-${new Date()}`, new Date());
}, 1000);
