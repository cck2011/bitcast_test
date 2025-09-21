import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable("users");
    if (!hasTable) {
        await knex.schema.createTable("users", (table) => {
            table.increments();
            table.string("username").notNullable();
            table.integer("status_id").notNullable();
            table.foreign("status_id").references("status.id");
            table.text("profile_pic").nullable();
            table.string("email").notNullable();
            table.string("password").notNullable();
            table.string("phone_number").notNullable();
            table.integer("role_id").notNullable();
            table.foreign("role_id").references("roles.id");
            table.string("telegram_acct").nullable();
            table.boolean("telegram_is_verified").notNullable();
            table.string("telegram_chat_id").nullable();
            table.string("created_by").notNullable();
            table.string("updated_by").notNullable();
            table.integer("login_method_id").notNullable();
            table.foreign("login_method_id").references("login_methods.id");
            table.timestamps(false, true);
        });
    }
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("users");
}
