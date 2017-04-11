
exports.up = knex =>
  knex.schema
  .createTable('user', (table) => {
    table.increments('id');
    table.string('username').unique().notNullable();
    table.string('name');
    table.boolean('is_admin');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.index('username');
  })
  .createTable('password', (table) => {
    table.increments('id');
    table.integer('user_id').references('user.id').notNullable().onDelete('CASCADE');
    table.string('password_hash').notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.boolean('valid').defaultTo(true);
  })
  .createTable('email', (table) => {
    table.increments('id');
    table.integer('user_id').references('user.id').notNullable().onDelete('CASCADE');
    table.string('address').unique().notNullable();
    table.boolean('verified').defaultTo(false);
  })
  ;

exports.down = knex =>
  knex.schema
    .dropTable('email')
    .dropTable('password')
    .dropTable('user')
    ;
