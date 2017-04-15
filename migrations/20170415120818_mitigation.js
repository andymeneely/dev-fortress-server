
exports.up = knex =>
  knex.schema
  .createTable('mitigation', (table) => {
    table.increments('id');
    table.string('type').notNullable();
    table.json('data').notNullable();
    table.integer('event_id').references('event.id').notNullable().onDelete('CASCADE');
  });

exports.down = knex =>
  knex.schema
  .dropTable('mitigation')
  ;
