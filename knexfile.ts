import type { Knex } from "knex";

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {

  development: {
    client: "postgresql",
    connection: {
      database: "api_proj",
      user: "postgres",
      password: "123456"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  production: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }

};

module.exports = config;