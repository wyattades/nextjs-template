import type { Knex } from 'knex';

export const up = async (db: Knex.Transaction) => {
  await db.schema.createTable('stuffs', (t) => {
    t.increments('id', { primaryKey: true });
    t.integer('value');
    t.timestamps(true, true);
  });
};
