const bcrypt = require('bcryptjs');

async function testPassword() {
  const plainPassword = "admin123"; // Replace with the admin's plain-text password
  const hashedPassword = "<hashed_password_from_db>"; // Replace with the hashed password from the database

  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  console.log("Password Match:", isMatch);
}

testPassword();
