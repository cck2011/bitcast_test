import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable("categories");
    if (!hasTable) {
        await knex.schema.createTable("categories", (table) => {
            table.increments();
            table.string("category").notNullable();
            table.timestamps(false, true);
        });
    }
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("categories");
}
