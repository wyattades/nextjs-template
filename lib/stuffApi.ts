import * as trpc from '@trpc/server';
import { z } from 'zod';

import { db } from 'db/client';

const stuffDb = new (class {
  async get(order?: 'asc' | 'desc' | null) {
    const res = await db<{
      value: number;
    }>('stuffs')
      .select('value')
      .orderBy(order ? 'value' : 'created_at', order || 'asc');

    return res.map((r) => r.value);
  }

  async add(next: number) {
    await db('stuffs').insert({
      value: next,
    });
  }
})();

export const STUFF_PREFIX = 'stuff.';

export const stuffRouter = trpc
  .router()
  .query('all', {
    input: z.object({
      order: z.enum(['asc', 'desc']).nullable(),
    }),
    async resolve({ input }) {
      return {
        stuff: await stuffDb.get(input?.order),
      };
    },
  })
  .mutation('add', {
    input: z.object({
      next: z.number(),
    }),
    async resolve({ input: { next } }) {
      await stuffDb.add(next);
    },
  });
