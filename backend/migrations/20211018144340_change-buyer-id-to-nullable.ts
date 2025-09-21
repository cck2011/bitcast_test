import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    const hasLoginMethodsTable = await knex.schema.hasTable("products");
    if (hasLoginMethodsTable) {
        await knex.schema.alterTable("products", (table) => {
            table.integer("buyer_id").nullable().alter();
        });
    }
}

export async function down(knex: Knex): Promise<void> {
    const hasLoginMethodsTable = await knex.schema.hasTable("products");
    if (hasLoginMethodsTable) {
        await knex.schema.alterTable("products", (table) => {
            table.integer("buyer_id").notNullable().alter();
        });
    }
}
