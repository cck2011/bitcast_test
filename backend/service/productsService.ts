import { Knex } from "knex";
// import { ResponseJson } from '../response';

export class ProductsService {
    constructor(private knex: Knex) {}

    getCategories = async () => {
        const results = await this.knex.select("*").from("categories");
        // return console.log("results", results);
        return {
            success: true,
            data: { msg: "get categories success", results },
        };
    };
    submitBidLiveInfo = async (
        liveTitle: string,
        description: string,
        startDate: Date | string,
        liveImage: string | undefined,
        userId: number,
        sellerLink: string,
        buyerLink: string
    ) => {
        console.log("liveTitle", liveTitle);
        console.log("description", description);
        console.log("startDate", startDate);
        console.log("liveImage", liveImage);
        console.log("userId", userId);
        console.log("buyerLink", buyerLink);
        if (liveImage !== undefined) {
            const res = await this.knex("live")
                .insert({
                    user_id: userId,
                    title: liveTitle,
                    image: liveImage,
                    starting_time: startDate,
                    status_id: (
                        await this.knex("status")
                            .select("id")
                            .where("status", "active")
                    )[0].id,
                    max_viewers: 0,
                    current_viewers: 0,
                    seller_link: sellerLink,
                    buyer_link: buyerLink,
                    is_live: false,
                    is_ended: false,
                    is_banned: false,
                    // created_at: new Date(),
                    // updated_at: new Date(),
                    description: description,
                })
                .returning("*");
            // const resultData = await this.knex("live").select("*")
            // console.log("resultData", resultData);
            // console.log("Submitted live_id :", res);
            return {
                success: true,
                data: { msg: "submit liveInfo success", res },
            };
        } else {
            return {
                success: false,
                data: { msg: "submit liveInfo fail due to data undefined" },
            };
        }
    };
    // submitBid = async (liveInput: Object, productInput: [Object]) => {
    //     console.table(liveInput);
    //     console.table(productInput);
    //     try {
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    putcurrentPrice = async (
        productId: number,
        bidAmount: number,
        addCurrentPrice: boolean,
        userId: number
    ) => {
        const txn = await this.knex.transaction();
        try {
            const result = (
                await txn("products")
                    .select(
                        "bid_increment",
                        "current_price",
                        "buy_price",
                        "buyer_id",
                        "countdown_end_time",
                        "seller_id"
                    )
                    .where("id", productId)
            )[0];

            const bidIncrement = result.bid_increment;
            const currentPrice = result.current_price;
            const buyPrice = result.buy_price;
            const buyerId = result.buyer_id;
            const sellerId = result.seller_id;
            const countdownEndTime = result.countdown_end_time;
            let newPrice: number = 0;
            if (sellerId === userId) {
                await txn.commit();
                return {
                    currentPrice: 0,
                    success: false,
                };
            }
            if (addCurrentPrice) {
                if (currentPrice + bidAmount < buyPrice) {
                    newPrice = currentPrice + bidAmount;
                } else {
                    newPrice = buyPrice;
                }
            } else {
                if (bidAmount < buyPrice) {
                    if (bidAmount < currentPrice + bidIncrement) {
                        await txn.commit();
                        return {
                            currentPrice: -10,
                            success: false,
                        };
                    }
                    newPrice = bidAmount;
                } else {
                    newPrice = buyPrice;
                }
            }

            if (newPrice <= currentPrice) {
                await txn.commit();
                return {
                    currentPrice: -10,
                    success: false,
                };
            }
            if (userId === parseInt(buyerId)) {
                await txn.commit();
                return {
                    currentPrice: -20,
                    success: false,
                };
            }

            await txn("products")
                .update({
                    current_price: newPrice,
                    countdown_end_time:
                        newPrice === buyPrice ? new Date() : countdownEndTime,
                    buyer_id: userId,
                })
                .where("id", productId);

            await txn.commit();
            return {
                currentPrice: newPrice,
                isEnded: newPrice === buyPrice ? true : false,
                success: true,
            };
        } catch (e) {
            await txn.rollback();
            return {
                currentPrice: -30,
                isEnded: false,
                success: false,
            };
        }
    };

    startBid = async (productId: number, seconds: number) => {
        const check = (
            await this.knex("products")
                .select("countdown_end_time")
                .where("id", productId)
        )[0].countdown_end_time;

        if (check !== null) {
            return [check, false];
        }

        const addSeconds = function (date: Date, sec: number) {
            date.setTime(date.getTime() + sec * 1000);
            return date;
        };
        const countdownStartTime = new Date();
        let countdownEndTime = new Date(countdownStartTime.valueOf());
        countdownEndTime = addSeconds(countdownEndTime, seconds);

        const endTime = (
            await this.knex("products")
                .update({
                    countdown_start_time: countdownStartTime,
                    countdown_end_time: countdownEndTime,
                    duration: seconds,
                })
                .where("id", productId)
                .returning("countdown_end_time")
        )[0];

        return [endTime, true];
    };

    selectProduct = async (productId: number) => {
        const liveId = (
            await this.knex("products").select("live_id").where("id", productId)
        )[0].live_id;

        const availableCheck = await this.knex("products")
            .select("countdown_end_time", "duration")
            .where("live_id", liveId);

        for (let item of availableCheck) {
            if (
                item.countdown_end_time !== null &&
                item.countdown_end_time.getTime() > new Date().getTime()
            ) {
                return false;
            }
        }

        await this.knex("products")
            .update("is_selected", false)
            .where("live_id", liveId);

        await this.knex("products")
            .update("is_selected", true)
            .where("id", productId);

        return true;
    };
    searchProductResults = async (searchKeywords: string) => {
        const results = await this.knex.raw(/*sql*/ `
        select products.id, 
        products.product_name, 
        products.buy_price, 
        products.min_price, 
        products.product_image, 
        products.description, 
        users.username,
        live.starting_time,
        live.buyer_link,
        live.is_ended
        from products 
        left outer join users on products.seller_id = users.id
        left outer join live on products.live_id = live.id
        where product_name ilike '%${searchKeywords}%' and live.starting_time > NOW() - 2 * interval '1 hour';
        `);
        return {
            success: true,
            data: { msg: "searching products result here", results },
        };
    };
    submitProductInfo = async (
        name: string,
        productImage: string,
        minimumBid: number,
        eachBidAmount: number,
        buyPrice: number,
        categoryId: number,
        liveId: number,
        description: string,
        productIndex: number,
        username: string,
        userId: number
    ) => {
        console.log("index", productIndex);
        if (productImage !== undefined) {
            const res = await this.knex("products")
                .insert({
                    product_name: name,
                    live_id: liveId,
                    seller_id: userId,
                    min_price: minimumBid,
                    current_price: minimumBid,
                    buy_price: buyPrice,
                    bid_increment: eachBidAmount,
                    category_id: categoryId,
                    product_image: productImage,
                    is_selected: productIndex == 0 ? true : false,
                    duration: 0,
                    created_by: username,
                    updated_by: username,
                    created_at: new Date(),
                    updated_at: new Date(),
                    description: description,
                })
                .returning("*");

            // console.log("Submitted products :", res);
            return {
                success: true,
                data: { msg: "submit product success", res },
            };
        } else {
            return {
                success: false,
                data: { msg: "submit product fail due to data undefined" },
            };
        }
    };

    telegramBidResult = async (productId: number) => {
        const productInfo = (
            await this.knex("products")
                .select(
                    "current_price",
                    "buyer_id",
                    "seller_id",
                    "product_name"
                )
                .where("id", productId)
        )[0];
        const sellerTelegramInfo = (
            await this.knex("users")
                .select("username", "telegram_acct", "telegram_chat_id")
                .where("id", productInfo.seller_id)
        )[0];
        let buyerTelegramInfo = {
            username: null,
            telegram_acct: null,
            telegram_chat_id: null,
        };
        if (productInfo.buyer_id !== null) {
            buyerTelegramInfo = (
                await this.knex("users")
                    .select("username", "telegram_acct", "telegram_chat_id")
                    .where("id", productInfo.buyer_id)
            )[0];
        }
        return {
            productName: productInfo.product_name,
            productFinalPrice: productInfo.current_price,
            sellerUsername: sellerTelegramInfo.username,
            sellerTelegramAcct: sellerTelegramInfo.telegram_acct,
            sellerTelegramChatId: sellerTelegramInfo.telegram_chat_id,
            buyerId: productInfo.buyer_id,
            buyerUsername: buyerTelegramInfo.username,
            buyerTelegramAcct: buyerTelegramInfo.telegram_acct,
            buyerTelegramChatId: buyerTelegramInfo.telegram_chat_id,
        };
    };

    findFollowersTelegram = async (userId: number) => {
        const telegram = await this.knex("follow_details as f")
            .leftJoin("users as u", "u.id", "f.follower_id")
            .select(
                "u.telegram_acct as telegramAcct",
                "u.telegram_chat_id as telegramChatId",
                "u.telegram_is_verified as telegramIsVerified"
            )
            .where("f.following_id", userId);
        const username = (
            await this.knex("users").select("username").where("id", userId)
        )[0].username;
        return {
            username,
            telegram,
        };
    };
}
