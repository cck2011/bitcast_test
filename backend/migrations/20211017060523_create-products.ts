import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable("products");
    if (!hasTable) {
        await knex.schema.createTable("products", (table) => {
            table.increments();
            table.string("product_name").notNullable();
            table.integer("live_id").notNullable();
            table.foreign("live_id").references("live.id");
            table.integer("seller_id").notNullable();
            table.foreign("seller_id").references("users.id");
            table.integer("min_price").notNullable();
            table.integer("current_price").notNullable();
            table.integer("buy_price").notNullable();
            table.integer("bid_increment").notNullable();
            table.integer("buyer_id").notNullable();
            table.foreign("buyer_id").references("users.id");
            table.integer("category_id").notNullable();
            table.foreign("category_id").references("categories.id");
            table.text("product_image").notNullable();
            table.boolean("is_selected").notNullable();
            table.timestamp("countdown_start_time").notNullable();
            table.integer("duration").notNullable();
            table.boolean("is_ended").notNullable();
            table.string("created_by").notNullable();
            table.string("updated_by").notNullable();
            table.timestamps(false, true);
        });
    }
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("products");
}
