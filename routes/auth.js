const express = require('express');
const User = require('../models/User')
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth')

//get user details
router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user).select('-password');
        return res.json(user);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Server Error");
    }
})

//login user
router.post("/login", [
    check("email", "enter a valid email").isEmail(),
    check("password", "password is required").not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    let { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(403).json({ errors: [{ msg: "Invalid Credentials" }] })
        }
        const payload = {
            user: user.id
        }
        jwt.sign(payload, process.env.SECRET, { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            return res.json({ token });
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Server Error")
    }
})

module.exports = router;