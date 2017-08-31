
exports.up = knex =>
knex.schema
.createTable('gameevent', (table) => {
  table.increments('id');
  table.integer('round').notNullable();
  table.integer('game_id').references('game.id').notNullable().onDelete('CASCADE');
  table.integer('rumor_id').references('rumor.id').notNullable().onDelete('CASCADE');
})
;

exports.down = knex =>
knex.schema
.dropTable('gamerumor')
;
