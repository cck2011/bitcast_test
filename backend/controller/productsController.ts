import axios from "axios";
import { Request, Response } from "express";
import { v4 } from "uuid";
import { env } from "../env";
import { ProductsService } from "../service/productsService";

export class ProductsController {
    constructor(private productsService: ProductsService) {}

    getCategories = async (req: Request, res: Response) => {
        try {
            const result = await this.productsService.getCategories();
            // console.log("result", result);
            res.json(result);
        } catch (error) {
            res.json({
                success: false,
                data: { msg: "controller get categories fail" },
                error: new Error("get categories fail"),
            });
        }
    };
    submitBidLiveInfo = async (req: Request, res: Response) => {
        try {
            const liveImage: string | undefined = req.file?.filename;

            const { liveTitle, description, startDate, userId } = req.body;

            const ms = Date.parse(startDate);
            // const startDateFormat = new Date(ms + 28800000);
            const startDateFormat = new Date(ms);

            let sellerLink = await v4();
            let buyerLink = await v4();

            const result = await this.productsService.submitBidLiveInfo(
                liveTitle,
                description,
                startDateFormat,
                liveImage,
                parseInt(userId),
                sellerLink,
                buyerLink
            );

            const { username, telegram } =
                await this.productsService.findFollowersTelegram(
                    parseInt(userId)
                );
            if (telegram.length !== 0 && result.data.res) {
                for (let tg of telegram) {
                    if (tg.telegramIsVerified) {
                        await axios.post(
                            `https://api.telegram.org/bot${env.TOKEN}/sendMessage`,
                            {
                                chat_id: tg.telegramChatId,
                                text: `您關注中的用戶@${username}已預約於${result.data.res[0].starting_time}舉行新的拍賣直播, 請勿錯過!!\n${env.FRONTEND_URL}/liveStreaming?room=${result.data.res[0].buyer_link}`,
                            }
                        );
                    }
                }
            }

            // console.log("submitted live result (controller side)", result);
            res.json(result);
        } catch (error) {
            res.json({
                success: false,
                data: { msg: "controller submit live Input fail" },
                error: new Error("controller submit live Input fail"),
            });
        }
    };
    submitProductInfo = async (req: Request, res: Response) => {
        try {
            const productImage: any = req.file?.filename;
            const {
                name,
                minimumBid,
                eachBidAmount,
                buyPrice,
                categoryId,
                description,
                liveId,
                productIndex,
                username,
                userId,
            } = req.body;

            const result = await this.productsService.submitProductInfo(
                name,
                productImage,
                parseInt(minimumBid),
                parseInt(eachBidAmount),
                parseInt(buyPrice),
                parseInt(categoryId),
                parseInt(liveId),
                description,
                productIndex,
                username,
                parseInt(userId)
            );
            // console.log("result", result);
            res.json(result);
        } catch (error) {
            res.json({
                success: false,
                data: { msg: "controller submit product fail" },
                error: new Error("controller submit product fail"),
            });
        }
    };

    putcurrentPrice = async (req: Request, res: Response) => {
        try {
            const { productId, bidAmount, addCurrentPrice } = req.body;
            const userId = req.user && req.user.id ? req.user.id : 0;
            const username =
                req.user && req.user.username ? req.user.username : "";

            const result = await this.productsService.putcurrentPrice(
                productId,
                bidAmount,
                addCurrentPrice,
                userId
            );
            const response = {
                id: productId,
                newPrice: result.currentPrice,
                buyer: username,
                isEnded: result.isEnded,
                success: result.success,
            };
            res.json(response);
        } catch (e) {
            console.log(e);
            res.json(e);
        }
    };

    startBid = async (req: Request, res: Response) => {
        try {
            const { productId, seconds } = req.body;

            const result = await this.productsService.startBid(
                productId,
                seconds
            );
            if (result[1]) {
                setTimeout(async () => {
                    const bidResult =
                        await this.productsService.telegramBidResult(productId);
                    let sellerText = `${bidResult.productName}的拍賣已結束, `;
                    if (bidResult.buyerId) {
                        if (
                            bidResult.buyerTelegramAcct &&
                            bidResult.buyerTelegramAcct
                        ) {
                            sellerText += `恭喜你! 拍賣品已由觀眾${bidResult.buyerUsername}以$${bidResult.productFinalPrice}投得, 請按此 @${bidResult.buyerTelegramAcct} 與買家安排交收詳情`;
                        } else {
                            sellerText += `恭喜你! 拍賣品已由觀眾${bidResult.buyerUsername}以$${bidResult.productFinalPrice}投得, 唯買家並未有使用Telegram, 或Telegram帳戶尚未完成認證, 請到個人頁面查看買家的其他聯絡方式, 以便安排交收詳情`;
                        }
                    } else {
                        sellerText += `此拍賣品在本次拍賣未能售出, 特此通知`;
                    }
                    let buyerText = `${bidResult.productName}的拍賣已結束, `;
                    if (
                        bidResult.sellerTelegramAcct &&
                        bidResult.sellerTelegramChatId
                    ) {
                        buyerText += `恭喜你! 你已成功以$${bidResult.productFinalPrice}投得拍賣品, 請按此 @${bidResult.sellerTelegramAcct} 與賣家${bidResult.sellerUsername}安排交收詳情`;
                    } else {
                        buyerText += `恭喜你! 你已成功以$${bidResult.productFinalPrice}投得拍賣品, 唯賣家並未有使用Telegram, 或Telegram帳戶尚未完成認證, 請到個人頁面查看買家的其他聯絡方式, 以便安排交收詳情`;
                    }
                    if (bidResult.sellerTelegramChatId) {
                        await axios.post(
                            `https://api.telegram.org/bot${env.TOKEN}/sendMessage`,
                            {
                                chat_id: bidResult.sellerTelegramChatId,
                                text: sellerText,
                            }
                        );
                    }
                    if (bidResult.buyerId && bidResult.buyerTelegramChatId) {
                        await axios.post(
                            `https://api.telegram.org/bot${env.TOKEN}/sendMessage`,
                            {
                                chat_id: bidResult.buyerTelegramChatId,
                                text: buyerText,
                            }
                        );
                    }
                }, (seconds + 10) * 1000);
                // }, 1000);
            }
            const response = {
                id: productId,
                countdownEndTime: result[0],
                success: result[1],
            };
            res.json(response);
        } catch (e) {
            console.log(e);
            res.json(e);
        }
    };

    selectProduct = async (req: Request, res: Response) => {
        try {
            const { productId } = req.body;

            const result = await this.productsService.selectProduct(productId);
            const response = { id: productId, success: result };
            res.json(response);
        } catch (e) {
            console.log(e);
            res.json(e);
        }
    };
    searchProductResults = async (req: Request, res: Response) => {
        try {
            const { searchKeywords } = req.body;
            const result = await this.productsService.searchProductResults(
                searchKeywords
            );
            res.json(result);
        } catch (error) {
            res.json({
                success: false,
                data: { msg: "No relevant products" },
                error: new Error("search product fail"),
            });
        }
    };
}
