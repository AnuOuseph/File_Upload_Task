const User = require("../models/userModel");
const { comparePassword, encryptPassword, generateToken } = require("../services/authService.js");


const register = async (req, res) => {
    try {
        let { username, password } = req.body;

        const isNameExist = await User.findOne({ where: { username: username } });
        if (isNameExist) {
            return res.status(400).json('Username is already registered');
        }

        password = await encryptPassword(password);
        const newUser = await User.create({ username, password });
        const token = generateToken(newUser?.id);
        return res.status(201).json({ message: "Account created successfully", data: newUser, status: true, token });

    } catch (error) {
        res.status(500).json({ message: "Registration failed", error });
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json('Invalid username or password');
        }
        const checkPassword = await comparePassword(password, user?.password)
        if (!checkPassword) {
            return res.status(400).json('Invalid username or password');
        }
        const token = generateToken(user?.id);
        res.json({ message: "Loggedin successfully", data: user, status: true, token })
    } catch (error) {
        res.status(500).json({ message: "Login failed", error });
    }
}

module.exports = {register,login}
