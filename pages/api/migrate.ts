import { NextApiHandler } from 'next';

import { create, runAll } from 'db/migrate';

export default (async (req, res) => {
  if (req.query.new) await create(req.query.new as string);
  else await runAll();

  res.json({});
}) as NextApiHandler;
