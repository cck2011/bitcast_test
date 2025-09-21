import { UserService } from "../service/userService";
import { Request, Response } from "express";
import jwtKey from "../jwt/jwt";
import jwt from "jsonwebtoken";

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
export class UserController {
    constructor(private userService: UserService) { }
    register = async (req: Request, res: Response) => {
        try {
            const { username, email, password, phoneNumber } = req.body;
            // console.log(username, email, password, phoneNumber);

            const result: any = await this.userService.register(
                username,
                email,
                password,
                phoneNumber
            );
            // console.log(result);

            if (!result.success) {
                // console.log('not success');

                return res.json(result);
            }

            const payload = result.data.user;
            const signOptions: {} = {
                expiresIn: "12h",
                algorithm: "RS512", // RSASSA options[ "RS256", "RS384", "RS512" ]
            };

            const token = jwt.sign(payload, jwtKey.privateKEY, signOptions);

            return res.json({
                token: token,
            });
            // req.session["user"] = result.data.user;
        } catch (err) {
            console.log(err);
            return res.json({
                success: false,
                error: err,
                data: {
                    msg: "register controller failure",
                },
            });
        }
    };
    getUser = async (req: Request, res: Response) => {
        try {
            // if (req.session["user"]) {
            //     res.json(req.session["user"]);
            // } else {
            //     res.json({ msg: "no current user" });
            // }
        } catch (err) {
            console.log(err);
            res.json({
                success: false,
                error: err,
                data: {
                    msg: "getUser controller failure",
                },
            });
        }
    };

    logout = async (req: Request, res: Response) => {
        try {
            // delete req.session["user"];
            res.json({
                success: true,
                data: {
                    msg: "Logged Out successfully",
                },
            });
        } catch (err) {
            console.log(err);
            res.json({
                success: false,
                error: err,
                data: {
                    msg: "logout controller failure",
                },
            });
        }
    };
    login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            const result: any = await this.userService.login(email, password);
            // if (result.data?.user) {
            //     req.session["user"] = result.data.user;
            // }
            if (result.success === true) {
                const payload = result.data.user;
                const signOptions: {} = {
                    expiresIn: "12h",
                    algorithm: "RS512", // RSASSA options[ "RS256", "RS384", "RS512" ]
                };

                const token = jwt.sign(payload, jwtKey.privateKEY, signOptions);

                return res.json({
                    token: token,
                });
            }
            return res.json(result);
        } catch (err) {
            console.log(err);
            return res.json({
                success: false,
                error: err,
                data: {
                    msg: "login controller failure",
                },
            });
        }
    };
    refreshCurrentUser = async (req: Request, res: Response) => {
        try {
            const { userId } = req.body;

            const result: any = await this.userService.refreshCurrentUser(
                parseInt(userId)
            );
            // console.log("refreshCurrentUser - -result >>>>>>", result);

            if (result.success === true) {
                const payload = result.data.user;
                const signOptions: {} = {
                    expiresIn: "12h",
                    algorithm: "RS512", // RSASSA options[ "RS256", "RS384", "RS512" ]
                };
                const token = jwt.sign(payload, jwtKey.privateKEY, signOptions);
                return res.json({
                    token: token,
                });
            }
            return res.json(result);
        } catch (err) {
            console.log(err);
            return res.json({
                success: false,
                error: err,
                data: {
                    msg: "refreshCurrentUser controller failure",
                },
            });
        }
    };
    getCurrentUser = async (req: Request, res: Response) => {
        try {
            const payload = req.user;
            const signOptions: {} = {
                expiresIn: "12h",
                algorithm: "RS512", // RSASSA options[ "RS256", "RS384", "RS512" ]
            };

            if (payload) {
                const token = jwt.sign(payload, jwtKey.privateKEY, signOptions);

                return res.json(token);
            } else {
                return res.json({
                    token: null,
                    message: "Incorrect token",
                });
            }
        } catch (err) {
            console.log(err);
            return res.json({
                success: false,
                error: err,
                data: {
                    msg: "getCurrentUser controller failure",
                },
            });
        }
    };
    loginFacebook = async (req: Request, res: Response) => {
        try {
            const facebookInfo = req.body;
            const result = await this.userService.FacebookLogin(
                facebookInfo.email,
                facebookInfo.name,
                facebookInfo.image
            );
            const payload = result.data.user;
            const signOptions: {} = {
                expiresIn: "12h",
                algorithm: "RS512", // RSASSA options[ "RS256", "RS384", "RS512" ]
            };

            if (payload) {
                const token = jwt.sign(payload, jwtKey.privateKEY, signOptions);

                return res.json({
                    token: token,
                });
            } else {
                return res.json({
                    token: null,
                    message: "Incorrect token",
                });
            }
        } catch (e) {
            console.log(e);

            return res.json({
                token: null,
                message: "loginGoole unknow error",
            });
        }
    };
    loginGoogle = async (req: Request, res: Response) => {
        try {
            const googleInfo = req.body;
            const result = await this.userService.googleLogin(
                googleInfo.name,
                googleInfo.email,
            );
            const payload = result.data.user;
            const signOptions: {} = {
                expiresIn: "12h",
                algorithm: "RS512", // RSASSA options[ "RS256", "RS384", "RS512" ]
            };

            if (payload) {
                const token = jwt.sign(payload, jwtKey.privateKEY, signOptions);

                return res.json({
                    token: token,
                });
            } else {
                return res.json({
                    token: null,
                    message: "Incorrect token",
                });
            }
        } catch (e) {
            console.log(e);

            return res.json({
                token: null,
                message: "loginGoole unknow error",
            });
        }
    };
    editProfile = async (req: Request, res: Response) => {
        try {
            console.log("test req.user>>>>>>>>>>>>>>>>>>", req.user);
            const profilePic: any = req.file?.filename;
            // console.log("profilePic", profilePic);
            // console.log(req.body)
            const {
                username,
                phoneNumber,
                telegramAccount,
                telegramChatId,
                aboutMe,
                userId,
            } = req.body;

            const result = await this.userService.editProfile(
                parseInt(userId),
                username,
                phoneNumber,
                telegramAccount,
                telegramChatId,
                aboutMe,
                profilePic
            );

            console.log("result", result);
            res.json(result);
        } catch (error) {
            res.json({
                success: false,
                data: { msg: "controller user edit profile fail" },
                error: new Error("controller user edit profile fail"),
            });
        }
    };
    getSellerSubscribe = async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            console.log("getSellerSubscribe->>>id", id);
            let sellerId = parseInt(id)
            if (sellerId === 0) {
                res.json({
                    success: false,
                    data: { msg: "get seller subscribe fail" },
                });
            }
            const result = await this.userService.getSellerSubscribe(sellerId);
            // console.log("result", result.sellerFollowerList);
            // console.log("result", result.liveRecordList);
            const response = {
                sellerFollowerList: result.sellerFollowerList,
                liveRecordList: result.liveRecordList.rows,
                success: true,
            };
            res.json(response);
            return;
        } catch (error) {
            res.json({
                success: false,
                data: { msg: "get seller subscribe fail" },
                error: new Error("get seller subscribe fail"),
            });
        }
    }
    getSubscribe = async (req: Request, res: Response) => {
        try {

            console.log("in getSubscribe")
            // console.log("seller_id_for_subscribe", id);
            const userId = req.user && req.user.id ? req.user.id : 0;
            if (userId === 0) {
                res.json({
                    success: false,
                    data: { msg: "get subscribe fail" },
                });
            }
            const result = await this.userService.getSubscribe(userId);
            const response = {
                followerList: result.followerList,
                followingList: result.followingList,
                success: true,
            };
            res.json(response);
            return;
        } catch (error) {
            res.json({
                success: false,
                data: { msg: "get subscribe fail" },
                error: new Error("get subscribe fail"),
            });
        }
    };

    subscribe = async (req: Request, res: Response) => {
        try {
            const { followingId } = req.body;
            const userId = req.user && req.user.id ? req.user.id : 0;
            if (userId === 0 || followingId === userId) {
                res.json({
                    success: false,
                    data: { msg: "subscribe fail" },
                });
            }
            await this.userService.subsciribe(userId, followingId);
            const response = { success: true };
            res.json(response);
            return;
        } catch (error) {
            res.json({
                success: false,
                data: { msg: "subscribe fail" },
                error: new Error("subscribe fail"),
            });
        }
    };

    getUserCardInfo = async (req: Request, res: Response) => {
        try {
            const { idString } = req.query;
            const idArr = JSON.stringify(idString)
                .replace(/"/g, "")
                .split(",")
                .map((id) => parseInt(id));
            console.log(idArr);

            if (idArr.length === 0) {
                res.json({
                    result: [],
                    success: false,
                });
            }
            const result = await this.userService.getUserCardInfo(idArr);
            const response = {
                result,
                success: true,
            };
            res.json(response);
        } catch (error) {
            res.json({
                success: false,
                data: { msg: "get user card info fail" },
                error: new Error("get user card info fail"),
            });
        }
    };
}
