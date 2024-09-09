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
const registeruser = asyncHandler(async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
        res.status(400);
        throw new Error('All fields are mandatory!');
    }

    // Check if user already exists
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
        res.status(400);
        throw new Error('User Already Exist');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed Password: ', hashedPassword);

    // Create the user
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });
    console.log(`user created ${user}`);

    // Respond with the user data or error
    if (user) {
        res.status(201).json({ _id: user.id, email: user.email });
    } else {
        res.status(400);
        throw new Error('User data is not valid');
    }
    // No further response after this point
});

const loginuser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
  
    // Check for missing fields
    if (!email || !password) {
      res.status(400);
      throw new Error('All fields are mandatory');
    }
  
    // Find user by email
    const user = await User.findOne({ email });
  
    // Validate user and password
    if (user && (await bcrypt.compare(password, user.password))) {
      // Generate access token
      const accessToken = jwt.sign(
        {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
          },
        },
        process.env.ACCESS_TOKEN_SECRET!,
        { expiresIn: '30d' }
      );
  
      // Send response
      res.status(200).json({ accessToken, user: {
        email: user.email,
        username: user.username,
      } });
  
    } else {
      res.status(401);
      throw new Error('Email or password is not valid');
    }
  });



const logoutUser = asyncHandler(async (req:Request, res:Response) => {
    res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
  });
  

  const currentuser = asyncHandler(async (req:Request, res:Response) => {
    res.json(req.user);

});
  

export { registeruser, loginuser,  logoutUser, currentuser};
