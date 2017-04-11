
exports.up = knex =>
  knex.schema
  .createTable('game', (table) => {
    table.increments('id');
    table.string('name').unique().notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.integer('current_round').unsigned().defaultTo(0).notNullable();
    table.integer('max_round').unsigned().notNullable();
    table.integer('round_phase').unsigned().defaultTo(0).notNullable();
    table.integer('storyteller_id').references('user.id').notNullable().onDelete('CASCADE');
  })
  ;

exports.down = knex =>
  knex.schema
  .dropTable('game')
  ;
