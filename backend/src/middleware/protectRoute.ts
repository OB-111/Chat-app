import jwt, { JwtPayload } from 'jsonwebtoken'
import {Request,Response,NextFunction} from 'express'
import prisma from '../db/prisma.js';
interface DecodedToken extends JwtPayload{
    userId: string;
}

declare global{
    namespace Express{
        export interface Request{
            user: {
                id: string;
                
            }
        }
    }
}
//     "start": "node --loader ts-node/esm --experimental-specifier-resolution=node backend/src/index.ts"

const protectRoute = async (req:Request, res:Response,next:NextFunction) =>{
    try {    
        // console.log(req.cookies['token']);
        
        const token = req.cookies?.jwt || req.cookies['token'];
        if(!token){
            return res.status(401).json({ error: "Unauthorized - No token provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
        if(!decoded){
            return res.status(401).json({msg:'Invalid token, authorization denied'})
        }
        const user = await prisma.user.findUnique({where:{id:decoded.userId},select:{id:true,username:true,fullname:true,profilePic:true}})
        if(!user){
            return res.status(401).json({msg:'User not found, authorization denied'})
        }
        req.user = user;
        next();
    } catch (error:any) {
        console.log('Error in protect route', error.message);
        res.status(500).json({msg:'Server error'})
    }
}

export default protectRoute;