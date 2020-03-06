const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const db = require('./models');
require('dotenv').config();

const PORT = process.env.PORT;

/* User Route */
app.get('/api/v1/users', (req, res) => {

	db.User.find({}, (err, foundUsers) => {

		if(err) return res.status(500).json({message: 'Something went wrong', error});

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