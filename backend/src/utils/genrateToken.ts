import jwt from 'jsonwebtoken';
import { Response } from 'express';

const generateToken = (userId: string, res: Response) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '15d' });
    res.cookie('token', token, { maxAge:15 * 24 * 60 * 60 * 1000,
    httpOnly: true ,//prevent xss attack 
    sameSite: true , //csrf attack cross-site 
    secure: process.env.NODE_ENV !== 'production' //https only
});
    return token;
}

export default generateToken;