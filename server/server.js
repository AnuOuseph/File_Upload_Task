const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const app = express();
const authRouter = require('./routes/auth');
const fileRouter = require('./routes/file')
const cors = require('cors')

dotenv.config();
connectDB();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/auth',authRouter);
app.use('/file',fileRouter)

const PORT = process.env.PORT || 7000;
app.listen(PORT, console.log(`Server running at ${PORT}`));