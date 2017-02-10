
exports.up = knex =>
  knex.schema.createTable('user', (table) => {
    table.increments('id');
    table.string('username').unique().notNullable();
    table.string('name');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.index('username');
  }).createTable('password', (table) => {
    table.increments('id');
    table.integer('user_id').references('user.id').notNullable().onDelete('CASCADE');
    table.string('password_hash').notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.boolean('valid').defaultsTo(true);
  }).createTable('email', (table) => {
    table.increments('id');
    table.integer('user_id').references('user.id').notNullable().onDelete('CASCADE');
    table.string('address').unique().notNullable();
    table.boolean('verified').defaultsTo(false);
  }).createTable('role', (table) => {
    table.increments('id');
    table.string('name').unique().notNullable();
  }).createTable('user_role', (table) => {
    table.integer('user_id').references('user.id').notNullable();
    table.integer('role_id').references('role.id').notNullable();
  });

exports.down = (knex, Promise) =>
  Promise.all([
    knex.schema.dropTable('user'),
    knex.schema.dropTable('password'),
    knex.schema.dropTable('email'),
    knex.schema.dropTable('role'),
    knex.schema.dropTable('user_role'),
  ]);
