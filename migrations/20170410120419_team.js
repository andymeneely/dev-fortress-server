
exports.up = knex =>
  knex.schema
  .createTable('team', (table) => {
    table.increments('id');
    table.string('name').unique().notNullable();
    table.boolean('mature').defaultTo(false).notNullable();
    table.integer('resources').unsigned().defaultTo(0).notNullable();
    table.integer('mindset').unsigned().defaultTo(0).notNullable();
    table.integer('teamtype_id').references('teamtype.id').notNullable().onDelete('CASCADE');
    table.integer('game_id').references('game.id').notNullable().onDelete('CASCADE');
    table.string('link_code').unique().notNullable();
  })
  ;

exports.down = knex =>
  knex.schema
    .dropTable('team')
  ;
