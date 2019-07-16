let arc = require('@architect/functions');

// direct everything to the `/public` folder in the root of this project
exports.handler = arc.proxy.public({spa:true})
