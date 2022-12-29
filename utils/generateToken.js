const jwt = require("jsonwebtoken");
const path = require('path')
const jf = require('jsonfile');

const file1 = path.join('./models/users.json')
const file2 = path.join('./models/UserToken.json')

const User = jf.readFileSync(file1);
const UserToken = jf.readFileSync(file2);

const generateTokens = async (user) => {
    try {
        const payload = { id: user.id, roles: user.role };
        const accessToken = jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_PRIVATE_KEY,
            { expiresIn: "15m" }
        );
        
        const refreshToken = jwt.sign(
            payload,
            process.env.REFRESH_TOKEN_PRIVATE_KEY,
            { expiresIn: "1d" }
        );

        const foundUserToken = await User.find(el => el.userId == user.id);
        if (foundUserToken) await User.splice(User.findIndex(el => el.id == user.id), 1)
        
        await UserToken.push({ userId: user.id, token: refreshToken });
        jf.writeFile(file2, UserToken, {spaces: 2}, (err) => {if (err) throw err})
        return Promise.resolve({ accessToken, refreshToken });
    } catch (err) {
        return Promise.reject(err);
    }
};

module.exports = generateTokens;