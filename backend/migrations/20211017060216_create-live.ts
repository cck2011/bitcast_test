import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable("live");
    if (!hasTable) {
        await knex.schema.createTable("live", (table) => {
            table.increments();
            table.integer("user_id").notNullable();
            table.foreign("user_id").references("users.id");
            table.string("title").notNullable();
            table.text("image").nullable();
            table.timestamp("starting_time").notNullable();
            table.integer("status_id").notNullable();
            table.foreign("status_id").references("status.id");
            table.integer("max_viewers").notNullable();
            table.integer("current_viewers").notNullable();
            table.text("seller_link").notNullable();
            table.text("buyer_link").notNullable();
            table.boolean("is_live").notNullable();
            table.boolean("is_ended").notNullable();
            table.boolean("is_banned").notNullable();
            table.timestamps(false, true);
        });
    }
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("live");
}
