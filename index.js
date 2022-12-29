const express = require("express");
const http = require("http");
const path = require("path");
const app = express();
const server = http.createServer(app);
const port = 3000;
const booksRouter = require('./routes/mainrouter.js')

const session = require('express-session')

const auth = require('./routes/auth.js');
const refreshToken = require("./routes/refreshToken.js");

app.use(session({
  name : 'session',
  secret : 'shlagbaum',
  resave : true,
  saveUninitialized: false,
  cookie : {
          maxAge:(1000 * 60 * 100)
  },
  refreshToken : '',
  role: 'user',
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.disable("x-powered-by");

app.use("/api", auth);
app.use("/api/refreshToken", refreshToken);

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

app.use('/book', booksRouter)

server.listen(port, () => console.log('started'))

module.exports = app