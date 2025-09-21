import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable("follow_details");
    if (!hasTable) {
        await knex.schema.createTable("follow_details", (table) => {
            table.increments();
            table.integer("follower_id").notNullable();
            table.foreign("follower_id").references("users.id");
            table.integer("following_id").notNullable();
            table.foreign("following_id").references("users.id");
            table.timestamps(false, true);
        });
    }
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("follow_details");
}
