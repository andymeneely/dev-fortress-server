
exports.up = knex =>
  knex.schema
  .createTable('action', (table) => {
    table.increments('id');
    table.string('name').unique().notNullable();
    table.string('description', 10000).notNullable();
    table.integer('devcaps_cost').notNullable();
    table.integer('mindset_reward').defaultTo(0).notNullable();
    table.boolean('repeatable').defaultTo(false).notNullable();
    table.boolean('requires_mature').defaultTo(false).notNullable();
  })
  ;

exports.down = knex =>
  knex.schema
  .dropTable('action')
  ;
