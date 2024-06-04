import express from "express";

const router = express.Router();

router.get('/converation', (req, res) => {
    res.send('converation route');
})
router.get('/message', (req, res) => {
    res.send('message route');
})


export default router;