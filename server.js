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
	if(!req.session.currentUser) return res.redirect('/login');
	res.sendFile('./views/index.html', {
		root: `${__dirname}/`
	})
})

app.get('/profile', (req, res) => {
	if(!req.session.currentUser) return res.direct('/login');
	
	res.sendFile('./views/profile.html', {
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


app.delete('/api/v1/logout', (req, res) => {

	if(!req.session.currentUser) return res.status(401).json({message: 'Unauthorized'});

	req.session.destroy(err => {
		if(err) return res.status(500).json({message: 'Something went wrong', err});

		res.status(200).json({message: 'logout success', status: 200});
	})

})


app.get('/api/v1/verify', (req, res) => {

	if(!req.session.currentUser) return res.status(401).json({message: 'Unauthorized'});

	res.status(200).json({message: `Current User verified. User ID: ${req.session.currentUser.id}`});

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

/* TODO: DO NOT INCLUDE CURRENT USER */
// Search User 
// Takes a Query String with Param: name
app.get('/api/v1/users/search', (req, res) => {

	if(!req.query.name) return res.status(405).json({message: 'Query string unknown'});

	db.User.find({ "name": {$regex: `.*${req.query.name}.*`} }).limit(5).exec((err, foundUsers) => {

		if(err) return res.status(500).json({message: "Something went wrong", err});

		const responseObj = {
			status: 200,
			data: foundUsers,
			requestedAt: new Date().toLocaleString(),
		};

		res.status(200).json(responseObj);

	})

})

/* User API Routes */
app.get('/api/v1/users/:id', (req, res) => {

	db.User.findById(req.params.id).populate('chatrooms').exec((err, foundUser) => {

		if(err) return res.status(500).json({message: 'Something went wrong', err});

		const responseObj = {
			status: 200,
			data: foundUser,
			requestedAt: new Date().toLocaleString(),
		};

		res.status(200).json(responseObj);

	})

})

// Update User Route
app.put('/api/v1/users/:id', (req, res) => {

	db.User.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, updatedUser) => {

		if(err) return res.status(500).json({message: 'Something went wrong :(((((((((', err});

		const responseObj = {
			status: 200,
			data: updatedUser,
			requestedAt: new Date().toLocaleString(),
		};

		res.status(200).json(responseObj);

	})

})

/* Chat Room API Routes */
app.post('/api/v1/chatrooms/', (req, res) => {

	req.body.author = req.session.currentUser.id;

	const otherUserId = req.body.users[0];
	let otherUserObj = {};

	req.body.users.push(req.session.currentUser.id);

	db.ChatRoom.create(req.body, (err, createdChatRoom) => {

		if(err) return res.status(500).json({message: "Something went wrong", err});

		db.User.findByIdAndUpdate(otherUserId, { $push: { chatrooms: createdChatRoom._id } }, { new: true }).populate('chatrooms').exec((err, updatedUser) => {

			if(err) return res.status(500).json({message: "Something went wrong", err, bug: 'b1'});

			otherUserObj = { updatedUser };

		})

		db.User.findByIdAndUpdate(req.session.currentUser.id, { $push: { chatrooms: createdChatRoom._id } }, { new: true }).populate('chatrooms').exec((err, updatedUser) => {

			if(err) return res.status(500).json({message: "Somethng went wrong", error, bug: 'b2'});

			const responseObj = {
				status: 200,
				data: updatedUser,
				createdChatRoom: createdChatRoom,
				updatedOtherUser: otherUserObj,
				requestedAt: new Date().toLocaleString(),
			};

			res.status(200).json(responseObj);
		})

	})

})

// Show Chat Room
app.get('/api/v1/chatrooms/:id', (req, res) => {

	db.ChatRoom.findById(req.params.id).populate('users').exec((err, foundChatRoom) => {

		if(err) return res.status(500).json({message: "Something went wrong", err});

		const responseObj = {
			status: 200,
			data: foundChatRoom,
			requestedAt: new Date().toLocaleString(),
		};

		res.status(200).json(responseObj);

	})

})

// Add Message to ChatRoom
app.put('/api/v1/chatrooms/:id/messsages', (req, res) => {

	db.ChatRoom.findById(req.params.id, (err, foundChatRoom) => {

		if(err) return res.status(500).json({message: "Something went wrong", err});

		foundChatRoom.messages.push(req.body);

		foundChatRoom.save((err, savedChatRoom) => {

			if(err) return res.status(500).json({message: "Something went wrong", err});

			const responseObj = {
				status: 200,
				data: savedChatRoom,
				requestedAt: new Date().toLocaleString(),
			};

			res.status(200).json(responseObj);

		})

	})

})

app.put('/api/v1/chatrooms/:id', (req, res) => {

	db.ChatRoom.findByIdAndUpdate(req.params.id, req.body, {new: true}).populate('users').exec((err, updatedChatRoom) => {

		if(err) return res.status(500).json({message: "Something went wrong"});

		const responseObj = {
			status: 200,
			data: updatedChatRoom,
			requestedAt: new Date().toLocaleString(),
		};

		res.status(200).json(responseObj);

	})

})

/* 404 Route */
app.get('/*', (req, res) => {
	res.status(400).sendFile(__dirname + '/views/404.html');
})

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
})