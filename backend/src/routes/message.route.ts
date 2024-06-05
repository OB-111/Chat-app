import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getMessages, sendMessage,getUsersForSideBar } from "../controllers/message.controller.js";

const router = express.Router();
router.get('/conversations',protectRoute,getUsersForSideBar);
router.get('/:id',protectRoute,getMessages);
router.post('/send/:id',protectRoute,sendMessage);



export default router;