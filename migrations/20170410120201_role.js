
exports.up = knex =>
  knex.schema
  .createTable('role', (table) => {
    table.increments('id');
    table.string('name').unique().notNullable();
  })
  .createTable('user_role', (table) => {
    table.integer('user_id').references('user.id').notNullable().onDelete('CASCADE');
    table.integer('role_id').references('role.id').notNullable().onDelete('CASCADE');
  })
  ;

exports.down = knex =>
  knex.schema
    .dropTable('user_role')
    .dropTable('role')
    ;

