const { Router } = require("express");
require("dotenv").config();
const auth = require('../middleware/checktoken.js');
const fs = require('fs');
let jsonfile = require('jsonfile');
let file = jsonfile.readFileSync('data.json');

const router = Router();
const checktoken = require('../middleware/checktoken.js');
const checkrole = require('../middleware/checkrole.js');

router.get('/', (req, res) => {
    /*res.status(200).type('text/plain')
    res.send(JSON.stringify(file, null, '\t'))*/
    return res.status(200).json({
        success: "true",
        message: "books",
        book: file,
    });
});

router.get('/:id', checktoken, (req, res) => {
    /*res.status(200).type('text/plain')
    let id = req.params.id;
    res.send(JSON.stringify(file[id], null, '\t'))*/
    return res.status(200).json({
        success: "true",
        message: "book-id",
        book: file[req.params.id]
    });
});

router.get('/:id/users', checktoken, (req, res) => {
    /*res.status(200).type('text/plain')
    let id = req.params.id;
    res.send(JSON.stringify(file[id].users, null, '\t'))*/
    return res.status(200).json({
        success: "true",
        message: "book-id-users",
        users: file[req.params.id].users
    });
});

router.get('/:bid/:uid', checktoken, (req, res) => {
    /*res.status(200).type('text/plain')
    let bid = req.params.bid;
    let uid = req.params.uid;
    res.send(JSON.stringify(file[bid].users[uid], null, '\t'))*/
    return res.status(200).json({
        success: "true",
        message: "book-id-user-id",
        user: file[req.params.bid].users[req.params.uid]
    });
});

router.post('/', checktoken, (req, res) => {
    if (!req.body) return res.sendStatus(400)
    const book = {
        id: file.length,
        amount: req.body.amount,
        name: req.body.name,
        author: req.body.author,
        relise: req.body.relise,
        users: []
    }
    jsonfile.readFile('data.json', (err, obj) => {
        if (err) throw err
        let fileObj = obj;
        fileObj.push(book);
        jsonfile.writeFile('data.json', fileObj, (err) => {
            if (err) throw err;
        })
        res.send(obj)
    })
})

router.post('/:id/users', checktoken, checkrole, (req, res) => {
    res.status(200).type('text/plain')
    let id = req.params.id;
    if (!req.body) return res.sendStatus(400)
    const users = {
        id: file[id].users.length,
        name: req.body.name,
        datein: req.body.datein,
        dateout: ""
    }
    jsonfile.readFile('data.json', (err, obj) => {
        if (err) throw err
        let fileObj = obj[id].users;
        fileObj.push(users);
        jsonfile.writeFile('data.json', obj, (err) => {
            if (err) throw err;
        })
        return res.send(obj)
    })
});

router.put('/:id', checktoken, function (req, res) {

    jsonfile.readFile('data.json', function (err, obj) {
        let fileObj = obj;
        fileObj[id].amount = req.body.amount;
        fileObj[id].name = req.body.name;
        fileObj[id].author = req.body.author;
        fileObj[id].relise = req.body.relise;
        jsonfile.writeFile('data.json', fileObj, function (err) {
            if (err) throw err;
        });
        return res.send(obj)
    });
});

router.put('/:bid/:uid', checktoken, checkrole, function (req, res) {
    let bid = req.params.bid;
    let uid = req.params.uid;

    jsonfile.readFile('data.json', function (err, obj) {
        let fileObj = obj;
        fileObj[bid].users[uid].name = req.body.name;
        fileObj[bid].users[uid].datein = req.body.datein;
        fileObj[bid].users[uid].dateout = req.body.dateout;
        jsonfile.writeFile('data.json', fileObj, function (err) {
            if (err) throw err;
        });
        res.send(obj)
    });
});

router.delete('/:id', checktoken, checkrole, (req, res) => {
    jsonfile.readFile('data.json', (err, obj) => {
        if (err) throw err
        let fileObj = obj;
        for (let i = 0; i < fileObj.length; i++) {
            if (fileObj[i].id == req.params.id) {
                fileObj.splice(i, 1)
            }
        }
        jsonfile.writeFile('data.json', fileObj, { spaces: 2 }, (err) => {
            if (err) throw err;
        })
        res.send(obj)
    })
})

module.exports = router