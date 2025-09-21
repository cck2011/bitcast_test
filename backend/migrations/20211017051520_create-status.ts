import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable("status");
    if (!hasTable) {
        await knex.schema.createTable("status", (table) => {
            table.increments();
            table.string("status").notNullable();
            table.timestamps(false, true);
        });
    }
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("status");
}
