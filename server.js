const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const db = require('./models');
require('dotenv').config();

const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
})