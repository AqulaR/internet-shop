const jwt = require("jsonwebtoken");
const jf = require('jsonfile')

const verifyRefreshToken = (refreshToken) => {
    console.log("refreshStart")
    const privateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY;
    return new Promise((resolve, reject) => {
        jf.readFile('../models/UserToken.json', (err, obj) => {
            if (err) throw err;
            const UserToken = obj.userToken;
            const foundUserToken = UserToken.find(el => el.token == refreshToken);
            if (!foundUserToken)
                return reject({ error: true, message: "Error: Invalid refresh token" });
            console.log("readfile")
        });
        
        jwt.verify(refreshToken, privateKey, (err, tokenDetails) => {
            if (err)
                return reject({ error: true, message: "Error: Invalid refresh token" });
                console.log("nonono")
            resolve({
                tokenDetails,
                message: "Valid refresh token",
            });
            console.log("success")
        });
    });
};

module.exports = verifyRefreshToken;