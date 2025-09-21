import { Knex } from "knex";

export class CategoriesService {
    constructor(private knex: Knex) {}

    categoriesFilter = async (categoryId: number) => {
        const results = await this.knex.raw(
            /*sql */
            `
            select 
            products.id, 
            products.product_name, 
            products.buy_price, 
            products.min_price, 
            products.product_image, 
            products.description, 
            users.username,
            categories.category,
            live.starting_time,
            live.buyer_link,
            live.is_ended
            from products
            left outer join categories 
            on products.category_id = categories.id
            left outer join users on products.seller_id = users.id
            left outer join live on products.live_id = live.id
            where categories.id=${categoryId} and live.starting_time > NOW() - 2 * interval '1 hour'
            `
        );
        return {
            success: true,
            data: { msg: "filed Categories result", results },
        };
    };

    getProductsForFilter = async (orderCommand: string) => {
        const orderOption: string = orderCommand;
        let orderSQLString = "";
        switch (orderOption) {
            case "DateNewToOld":
                orderSQLString = " order by starting_time desc";
                break;
            case "DateOldToNew":
                orderSQLString = " order by starting_time asc";
                break;
            case "PriceH2L":
                orderSQLString = " order by min_price desc";
                break;
            case "PriceL2H":
                orderSQLString = " order by min_price asc";
                break;
        }

        const results = await this.knex.raw(
            /*sql */
            `
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
            where live.starting_time > NOW()
            ${orderSQLString}
            `
        );
        return {
            success: true,
            data: { msg: "All relevant categories result", results },
        };
    };
}
