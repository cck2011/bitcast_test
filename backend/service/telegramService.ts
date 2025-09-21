import { Knex } from "knex";

export class TelegramService {
    constructor(private knex: Knex) {}

    checkVerified = async (
        // tgUsername:string,
        tgToken: number
    ) => {
        const results = await this.knex("users")
            .select("telegram_acct", "username", "telegram_is_verified")
            .where("id", tgToken);
        console.log(tgToken, results);

        return {
            success: true,
            data: { msg: "TG get user data ", results },
        };
    };
    tgAllowVerified = async (
        tgChatId: string,
        tgToken: number,
        username: string
    ) => {
        console.log(tgChatId, tgToken, username);

        const results = await this.knex("users")
            .update({
                telegram_chat_id: tgChatId,
                telegram_is_verified: true,
                updated_at: new Date(),
                updated_by: username,
            })
            .where("id", tgToken)
            .returning("*");
        return {
            success: true,
            data: { msg: "Telegram account verified ", results },
        };
    };

    getRecentBuyerInfo = async (tgChatId: string) => {
        const userId = (
            await this.knex("users")
                .select("id")
                .where("telegram_chat_id", tgChatId)
                .andWhere("telegram_is_verified", true)
        )[0].id;

        const liveIds = (
            await this.knex("live")
                .select("id")
                .where("user_id", userId)
                .andWhere("is_ended", true)
                .orderBy("starting_time", "desc")
                .limit(3)
        ).map((item) => item.id);

        const buyerInfo = await this.knex("products as p")
            .leftJoin("users as u", "p.buyer_id", "u.id")
            .select(
                "p.product_name as productName",
                "p.current_price as currentPrice",
                "u.username as username",
                "u.telegram_acct as tgAcct",
                "u.email as email",
                "u.phone_number as phoneNumber",
                "p.buyer_id"
            )
            .whereIn("p.live_id", liveIds);

        return buyerInfo;
    };

    getRecentSellerInfo = async (tgChatId: string) => {
        const userId = (
            await this.knex("users")
                .select("id")
                .where("telegram_chat_id", tgChatId)
                .andWhere("telegram_is_verified", true)
        )[0].id;

        const buyerInfo = await this.knex("products as p")
            .leftJoin("users as u", "p.seller_id", "u.id")
            .select(
                "p.product_name as productName",
                "p.current_price as currentPrice",
                "u.username as username",
                "u.telegram_acct as tgAcct",
                "u.email as email",
                "u.phone_number as phoneNumber",
                "p.buyer_id"
            )
            .where("p.buyer_id", userId)
            .andWhere("countdown_end_time", "<", "NOW()")
            .orderBy("countdown_end_time", "desc")
            .limit(10);

        return buyerInfo;
    };
}
