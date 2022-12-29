const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        if (req.user.roles != "admin") return res.status(403).send("Admin: Access denied.");
        next();
    } catch (error) {
        console.log(error)
        res.status(400).send("Ты Invalid");
    }
}