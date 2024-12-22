require('dotenv').config()
require('express-async-errors')

const express = require('express');
const app = express();

const errorHandlerMiddleware = require('./middlewares/error-handler')
const notFoundMiddleware = require('./middlewares/not-found')
const connectDB = require('./db/connect')
const authRouter = require('./routes/auth');

// CORS SETUP
const cors = require('cors');

app.use(cors());
app.use(express.json())

app.use('/api/v1/auth', authRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(3000, () => {
            console.log('Server is active...')
        })
    } catch (error) {
        console.log(error)
    }
}



start();
