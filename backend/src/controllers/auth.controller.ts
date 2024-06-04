import { Request,Response } from "express"
import prisma from "../db/prisma.js";
import  bcrypt from 'bcryptjs'
import generateToken from "../utils/genrateToken.js";

export const signup = async (req: Request, res: Response) => {

    try {
        const {fullname,username,password,confirmPassword,gender} = req.body;

    if(!fullname ||!username ||!password ||!confirmPassword ||!gender){
        return res.status(400).json({
            message: "Please fill all the fields"
        })
    }
    if(password !== confirmPassword){
        return res.status(400).json({
            message: "Password and confirm password does not match"
        })
    }
    const user = await prisma.user.findUnique({where: {username}})
    if(user){
        return res.status(400).json({
            message: "User already exists"
        })
    }
    // create salt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    // create propfile pic with random from : https://avatar-placeholder.iran.liara.run/#document
    const boyPicture =`https://avatar.iran.liara.run/username?username=${username}`
    const girlPicture =`https://avatar.iran.liara.run/username?username=${username}`

    const newUser = await prisma.user.create({
        data: {
            fullname,
            username,
            password:  hashedPassword,
            gender,
            profilePic: gender === "male"? boyPicture : girlPicture
        }
    })
    
    if(newUser){
        // genrete a token in a sec
        // generateToken(newUser.id,res)
        generateToken(newUser.id,res)
         res.status(201).json({
            id:newUser.id,
            fullname: newUser.fullname,
            username: newUser.username,
            profilePic: newUser.profilePic
        })

    }else{
        return res.status(400).json({
            message: "Invalid user data"
        })
    }
    } catch (error:any) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });     
    }
    

}

export const login = async (req: Request, res: Response) => {
    try {
        const  {username,password} = req.body;
        const user = await prisma.user.findUnique({where: {username}})
        if(!user){
            return res.status(400).json({
                message: "Invalid Usename"
            })
        }
        const isPasswordMatch = await bcrypt.compare(password,user?.password)
        if(!isPasswordMatch){
            return res.status(400).json({
                message: "Invalid Password"
            })
        }

        generateToken(user?.id,res);
        res.status(200).json({
            id: user?.id,
            fullname: user?.fullname,
            username: user?.username,
            profilePic: user?.profilePic
        })
    } catch (error:any) {
        console.log('Error in login controller', error.message);
        res.status(500).json({ error: "Internal Server Error" });
        
    }
}

export const logout = async (req: Request, res: Response) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({
            message: "Logged out successfully"
        })
    } catch (error:any) {
        console.log('Error in logout controller', error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getMe = async (req: Request, res: Response) => {                                                                                                                        
    try {
        const user = await prisma.user.findUnique({where: {id: req.user?.id}})
        if(!user){
            return res.status(400).json({
                message: "Invalid User"
            })
        }
        res.status(200).json({
            id: user?.id,
            fullname: user?.fullname,
            username: user?.username,
            profilePic: user?.profilePic
        })
    } catch (error:any) {
        console.log('Error in getMe controller', error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}