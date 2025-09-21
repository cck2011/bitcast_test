import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    const hasLoginMethodsTable = await knex.schema.hasTable("login_methods");
    if (hasLoginMethodsTable) {
        await knex.schema.alterTable("login_methods", (table) => {
            table.renameColumn("login_methods", "login_method");
        });
    }
}

export async function down(knex: Knex): Promise<void> {
    const hasLoginMethodsTable = await knex.schema.hasTable("login_methods");
    if (hasLoginMethodsTable) {
        await knex.schema.alterTable("login_methods", (table) => {
            table.renameColumn("login_method", "login_methods");
        });
    }
}
