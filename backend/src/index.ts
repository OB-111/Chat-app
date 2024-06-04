import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.route.js';
import messageRouter from './routes/message.route.js';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(cookieParser());

app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/message', messageRouter);

app.listen(5000, () => {
    console.log('Server is running on port 5000');
})