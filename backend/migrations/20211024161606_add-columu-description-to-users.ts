import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    const hasLoginMethodsTable = await knex.schema.hasTable("users");
    if (hasLoginMethodsTable) {
        await knex.schema.alterTable("users", (table) => {
            table.text("description").nullable();
        });
    }
}

export async function down(knex: Knex): Promise<void> {
    const hasLoginMethodsTable = await knex.schema.hasTable("users");
    if (hasLoginMethodsTable) {
        await knex.schema.alterTable("users", (table) => {
            table.dropColumn("description");
        });
    }
}