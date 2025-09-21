import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    const hasLoginMethodsTable = await knex.schema.hasTable("live");
    if (hasLoginMethodsTable) {
        await knex.schema.alterTable("live", (table) => {
            table.text("description").nullable();
        });
    }
}

export async function down(knex: Knex): Promise<void> {
    const hasLoginMethodsTable = await knex.schema.hasTable("live");
    if (hasLoginMethodsTable) {
        await knex.schema.alterTable("live", (table) => {
            table.dropColumn("description");
        });
    }
}
