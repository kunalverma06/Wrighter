import express from "express"
import { SiginSchema ,LoginSchema, CreateSchema} from "./zod";
import bcrypt from "bcrypt";
import {PrismaClient} from "@prisma/client";
import { email } from "zod";
import jwt from "jsonwebtoken"
const dotenv = require("dotenv");

const app = express();
const prisma = new PrismaClient();
app.use(express.json())
dotenv.config()

app.post("/signup",(req,res)=>{
    const data = req.body;
    const parsedData= SiginSchema.safeParse(data);
    if(!parsedData.success){
        return res.status(400).json({errors: parsedData.error.issues});
    }
    const hashedPassword = bcrypt.hash(parsedData.data.password, 10);
    const user = prisma.user.create({
        data:{
            email   : parsedData.data.email,
            username: parsedData.data.username,
            password: hashedPassword
        }
    })
    return res.status(201).json(user);
});

app.post("/signin",(req,res)=>{
    const data = req.body;
    const parsedData=LoginSchema.safeParse(data);
    const username = parsedData.username 
    const jwt = jwt.sign(username,process.env.JWT_SECRET);
     if(!jwt){
        return res.status(400).json({error:jwt.error.issues})
     }
     return res.json(jwt);
    
})

app.post("/create",async (req,res)=>{
    const data = req.body;
    const parsedData = CreateSchema.safeParse(data);
    if(!parsedData.success){
        return(res.status(400).json({errors : parsedData.error.issues}))
    }
    const title = parsedData.data.title
    const content = parsedData.data.content
    const type = parsedData.data.type
    const userid = parsedData.data.userid

    const post = await prisma.post.create({
        title,
        content,
        type,
        userid

    })
}) 