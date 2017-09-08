const fs = require('fs');

setInterval(() => {
    fs.writeFileSync(`./test-${new Date()}`, new Date());
}, 1000);
