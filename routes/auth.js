const { Router } = require("express");
const bcrypt = require("bcrypt");
const path = require('path')
const generateTokens = require("../utils/generateToken.js");
require("dotenv").config();

const router = Router();
const file = path.join('./models/users.json')
const jf = require('jsonfile');

const User = jf.readFileSync(file);
const middleware = require('../middleware/checktoken.js')

function emailValidate(email) {
    return email.toLowerCase()
    .match(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    );
}

// signup
router.post("/signUp", async (req, res) => {
    try {
        if (!req.body.username) return res.status(400).json({message: "Error: username is required" })
        if (!req.body.email) return res.status(400).json({message: "Error: email is required" })
        if (!req.body.password) return res.status(400).json({ message: "Error: password is required" })
        if (!emailValidate(req.body.email)) return res.status(400).json({message: "Error: email is not valid" })
        const user = await User.find(el => el.email == req.body.email);
        if (user)
            return res
                .status(400)
                .json({message: "Error: User with given email already exist" });

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = {
            id: User.length,
            username: req.body.username,
            email: req.body.email,
            password: hashPassword,
            role: "user"
        }

        User.push(newUser)
        jf.writeFile(file, User, {spaces: 2}, (err) => {if (err) throw err})

        res.status(201).json({message: "Account created sucessfully", user: newUser });
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Error: Internal Server Error" });
    }
});

// login
router.post("/logIn", async (req, res) => {
    try {
        const user = await User.find(el => el.username == req.body.username);
        if (!user)
            return res
                .status(401)
                .json({message: "Error: Invalid username or password" });

        const verifiedPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!verifiedPassword)
            return res
                .status(401)
                .json({message: "Error: Invalid email or password" });

        const { accessToken, refreshToken } = await generateTokens(user); 
        req.session['refreshToken'] = refreshToken;
        
        res
            .status(200)
            .json({
            accessToken,
            refreshToken,
            message: "Logged in sucessfully"
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Error: Internal Server Error" });
    }
});

router.get('/profile', middleware, (req, res) => {
    try {
        jf.readFile('./models/users.json', (err, obj) => {
            if (err) throw err
            const fileObj = obj;
            let uid = jf.readFileSync('./models/UserToken.json').find(el => el.token == req.session.refreshToken);
            if (uid) uid = uid.userId;
            else return res.status(400).json({message: "Token Not Found"});
            const user = fileObj.find(el => el.id == uid)
            return res.status(200).json({
                uid: uid,
                username: user.username,
                email: user.email,
                role: user.role
            })
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Error: Internal Server Error" });
    }
})

module.exports = router;