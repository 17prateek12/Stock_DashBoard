import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/userModel';

interface DecodedJwtPayload {
    user: {
        id: string;
        username?: string;
        email?: string;
        // Add other properties if needed
    };
}

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

const validateToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer')) {
        token = authHeader.split(' ')[1];
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as DecodedJwtPayload;
                req.user = {
                    id: decoded.user.id,
                    username: decoded.user.username ?? '',
                    email: decoded.user.email ?? '',
                    // Add other properties if needed
                } as IUser;
                next();
            } catch (error) {
                res.status(401);
                throw new Error('User is not authorized');
            }
        } else {
            res.status(401);
            throw new Error('Token is missing');
        }
    } else {
        res.status(401);
        throw new Error('Authorization header is missing or malformed');
    }
});

export default validateToken;
