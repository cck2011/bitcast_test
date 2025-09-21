import { Request, Response } from "express";
import { TelegramService } from "../service/telegramService";

export class TelegramController {
    constructor(private TelegramService: TelegramService) {}

    checkVerified = async (req: Request, res: Response) => {
        // console.log(req.user)
        // const reqUserTgName = req.user && req.user.telegram_acct? req.user.telegram_acct:"";
        // const reqUserID = req.user && req.user.id? req.user.id:0;
        const { tgChatId, tgGetUsername, tgTokenBody } = req.body;
        console.log(tgTokenBody);

        const tgToken =
            parseInt(tgTokenBody?.split("TOKEN_").join(""), 16) / 100000;
        console.log("tgChatId", tgChatId);
        console.log("tgToken", tgToken);
        console.log("tgGetUsername", tgGetUsername);

        const resData = await this.TelegramService.checkVerified(tgToken);
        console.log("result", resData.data.results[0]);

        if (resData.data.results[0]) {
            let userTgAcct = resData.data.results[0].telegram_acct;
            let username = resData.data.results[0].username;
            let userTgVerified = resData.data.results[0].telegram_is_verified;
            if (userTgAcct == tgGetUsername) {
                if (!userTgVerified) {
                    const resData = await this.TelegramService.tgAllowVerified(
                        tgChatId,
                        tgToken,
                        username
                    );

                    console.log("resData", resData.data.results[0]);
                    let result = resData.data.results[0];
                    res.json({
                        success: true,
                        data: {
                            msg: `Telegram帳戶 完成確認程序`,
                            result,
                        },
                    });
                } else {
                    res.json({
                        success: false,
                        data: { msg: "Telegram帳戶 已完成確認程序" },
                    });
                }
            } else {
                console.log("Invalid information-1");
                res.json({
                    success: false,
                    data: {
                        msg: "你正在使用的Telegram帳戶 與 Bidcast上登記的Telegram帳戶不符，請更正後再嘗試",
                    },
                });
            }
        } else {
            console.log("Invalid information-2");
            res.json({
                success: false,
                data: { msg: "接收電郵並未在bidcast註冊" },
            });
        }
    };

    getRecentBuyerInfo = async (req: Request, res: Response) => {
        try {
            const { tgChatId } = req.query;
            if (tgChatId !== undefined) {
                const resData = await this.TelegramService.getRecentBuyerInfo(
                    tgChatId?.toString()
                );

                const response = {
                    message: resData.map((obj) =>
                        obj.buyer_id
                            ? `拍賣品: ${obj.productName}\n成交價格: ${obj.currentPrice}\n買家: ${obj.username}\nTelegram: ${obj.tgAcct}\n電郵: ${obj.email}\n電話: ${obj.phoneNumber}`
                            : `拍賣品: ${obj.productName}\n未能賣出`
                    ),
                };
                res.json(response);
                return;
            }
            res.json({
                message: ["請重新前往 bidcast.online 驗證 telegram 帳戶"],
            });
        } catch (e) {
            console.log(e);
            res.json(e);
        }
    };

    getRecentSellerInfo = async (req: Request, res: Response) => {
        try {
            const { tgChatId } = req.query;
            console.log("???");

            if (tgChatId !== undefined) {
                const resData = await this.TelegramService.getRecentSellerInfo(
                    tgChatId?.toString()
                );

                console.log(resData);

                const response = {
                    message: resData.map((obj) =>
                        obj.buyer_id
                            ? `拍賣品: ${obj.productName}\n成交價格: ${obj.currentPrice}\n賣家: ${obj.username}\nTelegram: ${obj.tgAcct}\n電郵: ${obj.email}\n電話: ${obj.phoneNumber}`
                            : `拍賣品: ${obj.productName}\n未能賣出`
                    ),
                };
                res.json(response);
                return;
            }
            res.json({
                message: ["請重新前往 bidcast.online 驗證 telegram 帳戶"],
            });
        } catch (e) {
            console.log(e);
            res.json(e);
        }
    };
}
