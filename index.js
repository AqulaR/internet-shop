const express = require("express");
const http = require("http");
const path = require("path");
const app = express();
const server = http.createServer(app);
const port = 3000;
const fs = require('fs');

let jsonfile = require('jsonfile');
let file = jsonfile.readFileSync('data.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.disable("x-powered-by");

app.use((err, req, res, next) => {
	logger.error(err.stack);
	res.status(500).send("Вы сломали сервер!");
});

app.use((err, req, res, next) => {
	if (error instanceof ForbiddenError) {
		return res.status(403).send({
			status: "forbidden",
			message: error.message,
		});
	}
});


app.get('/book', (req, res) => {
  /*res.status(200).type('text/plain')
  res.send(JSON.stringify(file, null, '\t'))*/
  return res.status(200).json({
    success: "true",
    message: "books",
    book: file,
  });
});

app.get('/book/:id', (req, res) => {
  /*res.status(200).type('text/plain')
  let id = req.params.id;
  res.send(JSON.stringify(file[id], null, '\t'))*/
  return res.status(200).json({
    success: "true",
    message: "book-id",
    book: file[req.params.id]
  });
});

app.get('/book/:id/users', (req, res) => {
  /*res.status(200).type('text/plain')
  let id = req.params.id;
  res.send(JSON.stringify(file[id].users, null, '\t'))*/
  return res.status(200).json({
    success: "true",
    message: "book-id-users",
    users: file[req.params.id].users
  });
});

app.get('/book/:bid/:uid', (req, res) => {
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

app.post('/book', (req, res) => {
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

app.post('/book/:id/users', (req, res) => {
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
    res.send(obj)
  })
});

app.put('/book/:id', function(req, res) {
  let id = req.params.id;
  let amount = req.body.amount;
  let name = req.body.name;
  let author = req.body.author;
  let relise = req.body.relise;

  jsonfile.readFile('data.json', function(err, obj) {
    let fileObj = obj;
    fileObj[id].amount = amount;
    fileObj[id].name = name;
    fileObj[id].author = author;
    fileObj[id].relise = relise;
    jsonfile.writeFile('data.json', fileObj, function(err) {
        if (err) throw err;
    });
    res.send(obj)
  });
});

app.put('/book/:bid/:uid', function(req, res) {
  let bid = req.params.bid;
  let uid = req.params.uid;
  let name = req.body.name;
  let datein = req.body.datein;
  let dateout = req.body.dateout;

  jsonfile.readFile('data.json', function(err, obj) {
    let fileObj = obj;
    fileObj[bid].users[uid].name = name;
    fileObj[bid].users[uid].datein = datein;
    fileObj[bid].users[uid].dateout = dateout;
    jsonfile.writeFile('data.json', fileObj, function(err) {
        if (err) throw err;
    });
    res.send(obj)
  });
});

app.delete('/book/:id', (req, res) => {
  jsonfile.readFile('data.json', (err, obj) => {
    if (err) throw err
    let fileObj = obj;
    for(let i = 0; i < fileObj.length; i++) {
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

server.listen(port, () => console.log('started'))

module.exports = app