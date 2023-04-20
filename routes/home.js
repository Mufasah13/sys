import express from "express"
import { checkAuthenticated } from "./auth.js";

const router = express.Router();

router.get('/', checkAuthenticated, (req, res)=>{
    res.render("index")
})

export default router;