const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')


// Token Services
 const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.TOKEN_SECRET_KEY, { expiresIn: '5d' })
}

// Password Services
 const encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt)
}

 const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword)
}

module.exports = {generateToken,encryptPassword,comparePassword}