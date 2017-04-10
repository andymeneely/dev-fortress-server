
exports.up = knex =>
  knex.schema
  .createTable('rumor', (table) => {
    table.increments('id');
    table.string('name').unique().notNullable();
    table.string('description').notNullable();
    table.integer('event_id').references('event.id').notNullable().onDelete('CASCADE');
    table.boolean('disabled').defaultTo(false);
  })
  ;

exports.down = knex =>
  knex.schema
  .dropTable('rumor')
  ;
