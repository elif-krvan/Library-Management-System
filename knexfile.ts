import type { Knex } from "knex";
import * as types from 'pg-types';

// Update with your config settings.
const TIMESTAMPTZ_OID = 1184;
const TIMESTAMP_OID = 1114;
types.setTypeParser(TIMESTAMPTZ_OID, val => val);
types.setTypeParser(TIMESTAMP_OID, val => val);

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "postgresql",
    connection: {
      database: "postgres",
      user: "postgres",
      password: "123456",
      // timezone: "Europe/Istanbul"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: "./src/db/migrations",
      tableName: "knex_migrations"
    },
    seeds: {
      directory: './src/db/seeds'
    }
  }
};

module.exports = config;
