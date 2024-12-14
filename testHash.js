const bcrypt = require('bcryptjs');

async function hashPassword() {
  const plainPassword = "admin123"; // Admin's plain-text password
  const saltRounds = 10; // Recommended salt rounds
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  console.log("Hashed Password:", hashedPassword);
}

hashPassword();
