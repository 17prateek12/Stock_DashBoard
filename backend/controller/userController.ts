import asyncHandler from 'express-async-handler';
import User from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from 'express';

interface SignUpBody {
    username?: string,
    email?: string,
    password?: string,
}

// Define the registration function
const registeruser = asyncHandler(async (req:Request, res:Response) => {
    const {username, email,password}= req.body;
    if(!username || !email || !password){
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const userAvailable= await User.findOne({email});
    if(userAvailable){
        res.status(400);
        throw new Error("User Already Exist");
    }
    const hashedPassword= await bcrypt.hash(password,10);
    console.log("Hashed Password: ",hashedPassword);
    const user = await User.create({
        username,
        email,
        password:hashedPassword,
    })
    console.log(`user created ${user}`)
    if(user){
        res.status(201).json({_id:user.id, email:user.email});
    }else{
        res.status(400);
        throw new Error("User data us not valid");
    }
    res.json({ message: 'Register the user' });
});


const loginuser = asyncHandler(async (req:Request, res:Response) => {
    const {email,password} = req.body;
    if(!email || !password){
        res.status(400);
        throw new Error ("All the field are mandatory");
    }

    const user= await User.findOne({email});
    if(user && (await bcrypt.compare(password,user.password))){
        const accessToken = jwt.sign({
            user:{
                username:user.username,
                email:user.email,
                id:user.id,
            },
        },
        process.env.ACCESS_TOKEN_SECRET!,
        {expiresIn:"30d"}
    );
        res.status(200).json({accessToken});
    }else{
        res.status(401)
        throw new Error("email or password is not valid")
    }
});



const logoutUser = asyncHandler(async (req:Request, res:Response) => {
    res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
  });
  
export { registeruser, loginuser,  logoutUser};
