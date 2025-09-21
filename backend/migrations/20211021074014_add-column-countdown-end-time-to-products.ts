import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    const hasLoginMethodsTable = await knex.schema.hasTable("products");
    if (hasLoginMethodsTable) {
        await knex.schema.alterTable("products", (table) => {
            table.dropColumn("is_ended");
            table.timestamp("countdown_end_time").nullable();
        });
    }
}

export async function down(knex: Knex): Promise<void> {
    const hasLoginMethodsTable = await knex.schema.hasTable("products");
    if (hasLoginMethodsTable) {
        await knex.schema.alterTable("products", (table) => {
            table.boolean("is_ended").nullable();
            table.dropColumn("countdown_end_time");
        });
    }
}
