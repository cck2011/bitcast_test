import { Knex } from "knex";
import { LiveStreamProduct } from "../controller/liveStreamController";
import { env } from "../env";

export class LiveStreamService {
    constructor(private knex: Knex) {}

    print = () => {
        console.log(this.knex);
    };

    getRoom = async (token: string) => {
        const roomResult = await this.knex("live")
            .select("buyer_link")
            .where("seller_link", token);
        if (roomResult.length === 0) {
            return "";
        } else {
            return roomResult[0].buyer_link;
        }
    };

    getInfo = async (room: string, token: string) => {
        const liveResult = await this.knex("live")
            .select(
                "id",
                "title",
                "user_id",
                "current_viewers",
                "image",
                "description"
            )
            .where(
                `${room !== "" ? "buyer_link" : "seller_link"}`,
                room !== "" ? room : token
            );
        if (liveResult.length === 0) {
            return {
                id: -1,
                title: "Error",
                seller: "Error",
                sellerImage: "defaultUser.png",
                currentViewers: 0,
                thumbnail: "",
                description: "",
                success: false,
            };
        }

        const userResult = (
            await this.knex("users")
                .select("username", "profile_pic")
                .where("id", liveResult[0].user_id)
        )[0];

        return {
            id: liveResult[0].id,
            title: liveResult[0].title,
            seller: userResult.username,
            sellerId: liveResult[0].user_id,
            sellerImage:
                userResult.profile_pic == null
                    ? "defaultUser.png"
                    : userResult.profile_pic,
            currentViewers: liveResult[0].current_viewers,
            thumbnail: liveResult[0].image,
            description: liveResult[0].description,
        };
    };

    getProducts = async (liveId: number) => {
        const productsResult = await this.knex("products")
            .select(
                "id",
                "product_name",
                "min_price",
                "current_price",
                "buy_price",
                "bid_increment",
                "product_image",
                "is_selected",
                "duration",
                "countdown_end_time",
                "description",
                "category_id",
                "buyer_id"
            )
            .where("live_id", liveId);

        let products: LiveStreamProduct[] = [];

        for (let productResult of productsResult) {
            let product: LiveStreamProduct = {
                id: -1,
                productName: "",
                minPrice: 0,
                currentPrice: 0,
                buyPrice: 0,
                bidIncrement: 0,
                productImage: "",
                isSelected: false,
                duration: 0,
                description: "",
                buyer: "",
            };

            let buyer = "";
            if (productResult.buyer_id !== null) {
                buyer = (
                    await this.knex("users")
                        .select("username")
                        .where("id", productResult.buyer_id)
                )[0].username;
            }

            product["id"] = productResult.id;
            product["productName"] = productResult.product_name;
            product["minPrice"] = productResult.min_price;
            product["currentPrice"] = productResult.current_price;
            product["buyPrice"] = productResult.buy_price;
            product["bidIncrement"] = productResult.bid_increment;
            product["productImage"] =
                env.REACT_APP_BACKEND_URL + "/" + productResult.product_image;
            product["isSelected"] = productResult.is_selected;
            product["duration"] = productResult.duration;
            product["countdownEndTime"] = productResult.countdown_end_time;
            product["description"] = productResult.description;
            product["categoryId"] = productResult.category_id;
            product["buyer"] = buyer;
            products.push(product);
        }
        return products;
    };

    getMessages = async (liveId: number) => {
        return await this.knex("chat")
            .leftJoin("users", "chat.user_id", "users.id")
            .select(
                "chat.id",
                "users.username",
                "users.profile_pic",
                "chat.message",
                "chat.created_at"
            )
            .where("live_id", liveId);
    };

    postMessage = async (liveId: number, userId: number, message: string) => {
        const messageId = (
            await this.knex("chat")
                .insert({
                    live_id: liveId,
                    message,
                    user_id: userId,
                })
                .returning("id")
        )[0];

        return (
            await this.knex("chat")
                .leftJoin("users", "chat.user_id", "users.id")
                .select(
                    "chat.id",
                    "users.username",
                    "users.profile_pic",
                    "chat.message",
                    "chat.created_at"
                )
                .where("chat.id", messageId)
        )[0];
    };

    getOtherLives = async (liveId: number, categoryIdArr: number[]) => {
        const recommendLists = await this.knex("products")
            .leftJoin("live", "products.live_id", "live.id")
            .leftJoin("users", "live.user_id", "users.id")
            .select(
                "live.buyer_link",
                "live.image",
                "live.title",
                "users.username"
            )
            .whereIn("products.category_id", categoryIdArr)
            .andWhere("products.is_selected", true)
            .andWhere("live.is_live", true)
            .whereNot("live.id", liveId);

        return recommendLists;
    };
}
