import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable("chat");
    if (!hasTable) {
        await knex.schema.createTable("chat", (table) => {
            table.increments();
            table.integer("live_id").notNullable();
            table.foreign("live_id").references("live.id");
            table.text("message").notNullable();
            table.integer("user_id").notNullable();
            table.foreign("user_id").references("users.id");
            table.timestamps(false, true);
        });
    }
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("chat");
}
