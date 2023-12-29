/*  eslint-disable no-console */

import { createLedger } from './ledger/createLedger.js';
import { PostgresLedgerStorage } from 'lefra';

setTimeout(async () => {
  // eslint-disable-next-line n/no-process-env, @typescript-eslint/no-non-null-assertion
  const storage = new PostgresLedgerStorage(process.env.LFR_DATABASE_URL!);
  try {
    await createLedger(storage);
  } catch (error) {
    console.error(error);
  } finally {
    await storage.end();
  }
}, 0);
