import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable("roles");
    if (!hasTable) {
        await knex.schema.createTable("roles", (table) => {
            table.increments();
            table.string("role_name").notNullable();
            table.timestamps(false, true);
        });
    }
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("roles");
}
