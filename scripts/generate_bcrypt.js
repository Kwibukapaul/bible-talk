// Helper: generate a bcrypt hash for local/dev admin password
// Usage: npm install bcryptjs && node scripts/generate_bcrypt.js myPassword
const bcrypt = require('bcryptjs');
const pwd = process.argv[2];
if (!pwd) {
  console.error('Usage: node scripts/generate_bcrypt.js <password>');
  process.exit(1);
}
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(pwd, salt);
console.log(hash);
