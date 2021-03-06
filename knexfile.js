// Update with your config settings.

module.exports = {

  development: {
    client: 'postgresql',
    // client: 'sqlite3',
    connection: {
      database: 'fortress_dev',
      user: 'development',
      password: 'password',
      // filename: './database.sqlite3',
    },
    // required for sqlite
    // useNullAsDefault: true,

    // only use with postgresql
    pool: {
      min: 2,
      max: 10,
    },
    seeds: {
      directory: './seeds/knex',
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  test: {
    client: 'sqlite3',
    connection: {
      filename: ':memory:',
    },
    seeds: {
      directory: './test/data/seeds',
    },
    useNullAsDefault: true,
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'fortress_stage',
      user: 'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'fortress_prod',
      user: 'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

};
