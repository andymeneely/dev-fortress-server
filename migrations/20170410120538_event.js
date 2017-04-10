
exports.up = knex =>
  knex.schema
  .createTable('event', (table) => {
    table.increments('id');
    table.string('name').unique().notNullable();
    table.string('description').notNullable();
    table.integer('default_damage').notNullable();
    table.boolean('disabled').defaultTo(false);
  })
  ;

exports.down = knex =>
  knex.schema
    .dropTable('event')
  ;
