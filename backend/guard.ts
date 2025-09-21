import jwtKey from "./jwt/jwt";
import jwt from "jsonwebtoken";
import { Bearer } from "permit";
import express from "express";
import { UserService } from "./service/userService";

import { knex } from "./db";

const permit = new Bearer({
    query: "access_token",
});
const userService = new UserService(knex);

declare global {
    namespace Express {
        interface Request {
            user?: {
                id?: number;
                username?: string;
                email?: string;
                role_id?: number;
                created_at?: Date;
                updated_at?: Date;
                profile_pic?: string;
                status_id?: number;
                phone_number?: number;
                telegram_acct?: string;
                telegram_is_verified?: boolean;
                telegram_chat_id?: number;
                login_method_id?: number;
                description?: string;
            };
        }
    }
}

interface verifyOptions {
    expiresIn: string;
    algorithm: string;
}

export async function isLoggedIn(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    try {
        const token = permit.check(req);
        if (!token) {
            return res.json("Unauthorized");
        }

        const verifyOptions: verifyOptions = {
            expiresIn: "12h",
            algorithm: "RS512",
        };
        const User = jwt.verify(token, jwtKey.publicKEY, verifyOptions as {});
        // console.log(User)
        // database check
        if (typeof User !== "string") {
            const id = User.id;
            const result = await userService.getCurrentUser(id);
            if (result.success === true) {
                req.user = result.data.user;
                return next();
            } else {
                return res.json("請先登入");
            }
        } else {
            return res.json("請先登入");
        }
    } catch (e) {
        console.error(e);

        return res.json("Incorrect token");
    }
}
