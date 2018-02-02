'use strict'

const Knex = require('knex')

let config = {
  client: 'pg',
  connection: {
    user: 'awareit', // env var: PGUSER
    database: 'awareit', // env var: PGDATABASE
    password: 'monkfish', // env var: PGPASSWORD
    host: '10.1.200.42', // Server hosting the postgres database
    port: 5432 // env var: PGPORT
  },
  pool: {
    max: 5, // max number of clients in the pool
    idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
  }
}

exports.knex = new Knex(config)
