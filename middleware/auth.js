const jwt = require('jsonwebtoken');
module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(403).json({ errors: [{ msg: "Access Denied" }] });
    }
    try {
        jwt.verify(token, process.env.SECRET, (error, decoded) => {
            if (error) {
                return res.status(403).json({ errors: [{ msg: "Access Denied" }] });
            }
            req.user = decoded.user;
            next();
        })

    } catch (error) {
        console.log("something wrong with middleware");
        return res.status(500).json({ msg: "Server Error" })
    }
}