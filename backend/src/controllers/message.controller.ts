
import { Request,Response } from "express"
import prisma from "../db/prisma.js";


export const sendMessage = async (req: Request, res: Response) => {
    try {
        const {message} = req.body;
        const {id:reciverId} = req.params;
        const senderId = req.user?.id;

        // find the conversation that includes both sender and reciver
        let conversation = await prisma.conversation.findFirst({
            where:{
                participantIds:{
                    hasEvery:[senderId,reciverId]
                }
            }
        })

        // the very first message is being sent that way we need to create a new conversation
        if(!conversation){
            conversation = await prisma.conversation.create({
                data:{
                    participantIds:[senderId,reciverId]
                }
            })
        }

        // added message to conversation
        const newMessage = await prisma.message.create({
            data:{
                senderId,
                body:message,
                conversationId: conversation.id
            }
        })
        if (newMessage) {
            conversation = await prisma.conversation.update({where:{ id:conversation.id,},data:{messages:{connect:{id:newMessage.id}}}})
        }
        res.status(201).json(newMessage);
    } catch (error:any) {
        console.error("Error in sendMessage controller", error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


export const getMessages = async (req: Request, res: Response) => {
    try {
        const {id:userToChatId} = req.params;
        const senderId = req.user?.id;

        const conversation = await prisma.conversation.findFirst({
            where:{
                participantIds:{
                    hasEvery:[senderId,userToChatId]
                }
            },
            include:{
                messages:{
                    orderBy:{
                        createdAt: 'asc'
                    }
                }
            }
        });
        if(!conversation){
            return res.status(200).json({message:[]})
        }
        res.status(200).json(conversation.messages);
    } catch (error:any) {
        console.error("Error in getMessage controller", error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


export const getUsersForSideBar = async (req: Request, res: Response) =>{
     try {
        const authUser = req.user.id;
        // get all user beside the only current one how connect
        const users = await prisma.user.findMany({
            where:{
                id:{
                    not:authUser
                }
            },
            select:{
                id:true,
                username:true,
                fullName:true,
                profilePic:true,
            }
        })
        res.status(200).json(users);
     } catch (error:any) {
        console.error("Error in getUsersForSideBar controller", error.message);
        res.status(500).json({ message: 'Internal Server Error' });
     }
}