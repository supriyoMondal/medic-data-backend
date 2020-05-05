const express = require('express');
const User = require('../models/User')
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken');
//get user details
router.post("/", [
    check('name', 'Name is Required').not().isEmpty(),
    check('email', "Please include a valid email").isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ errors: [{ msg: "User already exists" }] });
        }
        user = new User({ name, email, password });
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);
        user = await user.save();
        const payload = {
            user: user.id
        }

        jwt.sign(payload, process.env.SECRET, { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            return res.json({ token });
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).send("server error");
    }
})





module.exports = router;