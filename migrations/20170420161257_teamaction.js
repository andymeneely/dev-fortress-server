
exports.up = knex =>
  knex.schema
  .createTable('teamaction', (table) => {
    table.increments('id');
    table.integer('action_id').references('action.id').notNullable().onDelete('CASCADE');
    table.integer('team_id').references('team.id').notNullable().onDelete('CASCADE');
    table.integer('round').notNullable();
  })
  ;

exports.down = knex =>
  knex.schema
  .dropTable('teamaction')
  ;
