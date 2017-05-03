
exports.up = knex =>
  knex.schema
  .createTable('gameevent', (table) => {
    table.increments('id');
    table.integer('damage').notNullable();
    table.integer('round').notNullable();
    table.integer('game_id').references('game.id').notNullable().onDelete('CASCADE');
    table.integer('event_id').references('event.id').notNullable().onDelete('CASCADE');
  })
  ;

exports.down = knex =>
  knex.schema
  .dropTable('gameevent')
  ;
