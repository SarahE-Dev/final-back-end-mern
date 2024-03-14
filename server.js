const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRouter = require('./routes/user/userRouter')
const logger = require('morgan');

require('dotenv').config()
let originURL = process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : "DEPLOYMENT ADDRESS"

const app = express();

app.use(express.json());
app.use(cors({origin: originURL, credentials: true}));
app.use(logger('dev'));

app.use('/api/user', userRouter)

mongoose.connect('mongodb://127.0.0.1:27017/music_app_database')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB', err));

const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 
