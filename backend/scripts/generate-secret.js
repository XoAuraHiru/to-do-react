const crypto = require('crypto');

//simple script to generate a secret key for the JWT

const secret = crypto.randomBytes(32).toString('hex');
console.log(secret);