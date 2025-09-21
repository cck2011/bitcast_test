import { Knex } from "knex";

export class ComingAuctionService {
    constructor(private knex: Knex) { }

    getComingAuction = async () => {
        const results = await this.knex.raw(
            /*sql*/
            `select live.id,live.user_id, live.title, live.image, live.starting_time, live.description, username, profile_pic, live.buyer_link from live
            left outer join users on live.user_id = users.id where live.starting_time > NOW()
            order by live.starting_time asc
            limit 10
            `
        );
        return {
            success: true,
            data: { msg: "get products success", results },
        };
    };

    getBroadcasting = async () => {
        const results = await this.knex.raw(
            /*sql*/
            `select * from live
            right outer join products on products.live_id = live.id
            left outer join users on live.user_id = users.id
            where live.is_live is true and live.is_ended is false
            ORDER BY random()
            `
        );
        return {
            success: true,
            data: { msg: "get broadcasting products success", results },
        };
    };

    getProductDetails = async () => {
        const results = await this.knex.raw(
            /*sql*/
            `
            select products.id, 
            products.product_name, 
            products.live_id, 
            products.min_price, 
            products.buy_price, 
            products.product_image 
            from products
            left outer join live
            on products.live_id = live.id
            `
        );
        return {
            success: true,
            data: { msg: "get product details success", results },
        };
    };
}
