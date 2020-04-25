const express = require('express');

const router = express.Router();



//register user
router.post("/register", (req, res) => {
    return res.send("register user");
})

module.exports = router;