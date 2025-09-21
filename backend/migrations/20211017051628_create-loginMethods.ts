import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable("login_methods");
    if (!hasTable) {
        await knex.schema.createTable("login_methods", (table) => {
            table.increments();
            table.string("login_methods").notNullable();
            table.timestamps(false, true);
        });
    }
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("login_methods");
}
