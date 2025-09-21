// Update with your config settings.
import { env } from "./env";

module.exports = {
    development: {
        client: "postgresql",
        connection: {
            database: env.DB_NAME,
            user: env.DB_USERNAME,
            password: env.DB_PASSWORD,
            host: env.DB_HOST,
            port: env.DB_PORT,
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: "knex_migrations",
        },
    },
    test: {
        client: "postgresql",
        connection: {
            database: env.POSTGRES_DB,
            user: env.POSTGRES_USER,
            password: env.POSTGRES_PASSWORD,
            host: env.POSTGRES_HOST,
            port: env.DB_PORT,
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: "knex_migrations",
        },
    },
    production: {
        client: "postgresql",
        connection: {
            database: env.DB_NAME,
            user: env.DB_USERNAME,
            password: env.DB_PASSWORD,
            host: env.DB_HOST,
            port: env.DB_PORT,
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: "knex_migrations",
        },
    },
};
