const express = require('express');

const router = express.Router();


//get user details
router.get("/", (req, res) => {
    return res.send("user details route");
})

//login user
router.post("/login", (req, res) => {
    return res.send("Login user");
})

module.exports = router;