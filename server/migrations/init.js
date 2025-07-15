import db from '../data/db.js';

async function createUsersTable() {
  const exists = await db.schema.hasTable('users');
  if (!exists) {
    await db.schema.createTable('users', (table) => {
      table.string('id').primary();
      table.string('username').notNullable().unique();
      table.string('hashed_password').notNullable();
      table.string('first_name');
      table.string('last_name');
      table.string('token');
      table.timestamp('created_at').defaultTo(db.fn.now());
    });
    console.log('Table "users" created successfully.');
  } else {
    console.log('Table "users" already exists, skipping creation.');
  }

  process.exit();
}

createUsersTable();
