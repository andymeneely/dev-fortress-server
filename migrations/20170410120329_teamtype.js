
exports.up = knex =>
  knex.schema
  .createTable('teamtype', (table) => {
    table.increments('id');
    table.string('name').unique().notNullable();
    table.string('description').notNullable();
    table.boolean('initial_mature').notNullable();
    table.integer('initial_resources').notNullable();
    table.integer('initial_mindset').notNullable();
    table.boolean('disabled').defaultTo(false);
  })
  ;

exports.down = knex =>
  knex.schema
    .dropTable('teamtype')
  ;
