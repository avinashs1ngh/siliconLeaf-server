const crypto = require('crypto');

// Generate a secure random JWT secret
const jwtSecret = crypto.randomBytes(32).toString('hex');
console.log(jwtSecret);