const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const bcrypt = require('bcryptjs');
const app = express();

const db = require('./models');
require('dotenv').config();

const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.use(session({
    store: new MongoStore({ url: process.env.MONGO_URI }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 3 // Expire in 24 hours
    }
  })
);

app.get('/', (req, res) => {
	res.sendFile('./views/register.html', {
		root: `${__dirname}/`
	})
})

app.get('/login', (req, res) => {
	res.sendFile('./views/login.html', {
		root: `${__dirname}/`
	})
})

app.get('/home', (req, res) => {
	res.sendFile('./views/index.html', {
		root: `${__dirname}/`
	})
})

/* -------------------- AUTH API ROUTES ------------ */

// AUTH Register
app.post('/api/v1/register', (req, res) => {
	db.User.findOne({email: req.body.email}, (err, foundUser) => {

		if(err) return res.status(500).json({message: "Something went wrong", err});

		if(foundUser) return res.status(409).json({message: "User already registered"});

		bcrypt.genSalt(10, (err, salt) => {

			if(err) return res.status(500).json({message: 'Something went wrong'});

			bcrypt.hash(req.body.password, salt, (err, hash) => {

				if(err) return res.status(500).json({message: 'Something went wrong'});

				const newUser = {
					name: req.body.name,
					email: req.body.email,
					password: hash,
				};

				db.User.create(newUser, (err, createdUser) => {

					if(err) return res.status(500).json({message: "Something went wrong"});

					res.status(201).json({message: 'user created', status: 201});

				})

			})

		})

	})

})

// AUTH Login
app.post('/api/v1/login', (req, res) => {
	db.User.findOne({email: req.body.email}, (err, foundUser) => {

		if(err) return res.status(500).json({message: "Something went wrong", err});

		if(!foundUser) return res.status(404).json({message: 'User not registered', err});

		bcrypt.compare(req.body.password, foundUser.password, (err, isMatch) => {

			if(err) return res.status(500).json({message: "Something went wrong"});

			if(isMatch) {

				req.session.currentUser = {
					id: foundUser._id,
					name: foundUser.name,
					email: foundUser.email
				};

				const responseObj = {
					status: 200,
					data: foundUser._id,
					requestedAt: new Date().toLocaleString(),
					message: 'Success',
				};

				return res.status(200).json(responseObj);
			} else {
				return res.status(400).json({message: 'Username/password is incorrect'});
			}

		})

	})

})


/* User Index Route */
app.get('/api/v1/users', (req, res) => {

	db.User.find({}, (err, foundUsers) => {

		if(err) return res.status(500).json({message: 'Something went wrong', err});

		const responseObj = {
			status: 200,
			data: foundUsers,
			requestedAt: new Date().toLocaleString(),
		};

		res.status(200).json(responseObj);

	})

})

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
})