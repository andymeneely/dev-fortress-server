
exports.up = knex =>
  knex.schema.createTable('user', (table) => {
    table.increments('id');
    table.string('username').unique().notNullable();
    table.string('name');
    table.boolean('is_admin');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.index('username');
  })
  .createTable('password', (table) => {
    table.increments('id');
    table.integer('user_id').references('user.id').notNullable().onDelete('CASCADE');
    table.string('password_hash').notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.boolean('valid').defaultTo(true);
  })
  .createTable('email', (table) => {
    table.increments('id');
    table.integer('user_id').references('user.id').notNullable().onDelete('CASCADE');
    table.string('address').unique().notNullable();
    table.boolean('verified').defaultTo(false);
  })
  .createTable('role', (table) => {
    table.increments('id');
    table.string('name').unique().notNullable();
  })
  .createTable('user_role', (table) => {
    table.integer('user_id').references('user.id').notNullable().onDelete('CASCADE');
    table.integer('role_id').references('role.id').notNullable().onDelete('CASCADE');
  })
  .createTable('teamtype', (table) => {
    table.increments('id');
    table.string('name').unique().notNullable();
    table.string('description').notNullable();
    table.boolean('initial_mature').notNullable();
    table.integer('initial_resources').notNullable();
    table.integer('initial_mindset').notNullable();
    table.boolean('disabled').defaultTo(false);
  })
  .createTable('event', (table) => {
    table.increments('id');
    table.string('name').unique().notNullable();
    table.string('description').notNullable();
    table.integer('default_damage').notNullable();
    table.boolean('disabled').defaultTo(false);
  })
  .createTable('rumor', (table) => {
    table.increments('id');
    table.string('name').unique().notNullable();
    table.string('description').notNullable();
    table.integer('event_id').references('event.id').notNullable().onDelete('CASCADE');
    table.boolean('disabled').defaultTo(false);
  })
  .createTable('game', (table) => {
    table.increments('id');
    table.string('name').unique().notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.integer('current_round').unsigned().defaultTo(0).notNullable();
    table.integer('max_round').unsigned().notNullable();
    table.integer('round_phase').unsigned().defaultTo(0).notNullable();
    table.integer('storyteller_id').references('user.id').notNullable().onDelete('CASCADE');
  })
  .createTable('team', (table) => {
    table.increments('id');
    table.string('name').unique().notNullable();
    table.boolean('mature').defaultTo(false).notNullable();
    table.integer('resources').unsigned().defaultTo(0).notNullable();
    table.integer('mindset').unsigned().defaultTo(0).notNullable();
    table.integer('type_id').references('teamtype.id').notNullable().onDelete('CASCADE');
    table.integer('game_id').references('game.id').notNullable().onDelete('CASCADE');
    table.string('link_code').unique().notNullable();
  });

exports.down = knex =>
  knex.schema
      .dropTable('user_role')
      .dropTable('user')
      .dropTable('role')
      .dropTable('password')
      .dropTable('email')
      .dropTable('team')
      .dropTable('teamtype')
      .dropTable('game')
      .dropTable('event')
      .dropTable('rumor');
