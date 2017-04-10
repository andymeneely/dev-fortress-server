
exports.up = knex =>
  knex.schema
  .createTable('prereq', (table) => {
    table.increments('id');
    table.integer('action_id').references('action.id').notNullable().onDelete('CASCADE');
    table.integer('prereq_action_id').references('action.id').notNullable().onDelete('CASCADE');
  })
  ;

exports.down = knex =>
  knex.schema
  .dropTable('prereq')
  ;
