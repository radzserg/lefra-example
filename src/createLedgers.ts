/*  eslint-disable no-console */

import {
  createPlatformUsdLedger,
  createPointsLedger,
} from './ledger/createLedgers.js';
import { PostgresLedgerStorage } from 'lefra';

setTimeout(async () => {
  // eslint-disable-next-line n/no-process-env, @typescript-eslint/no-non-null-assertion
  const storage = new PostgresLedgerStorage(process.env.LFR_DATABASE_URL!);
  try {
    console.log('Creating USD ledger...');
    await createPlatformUsdLedger(storage);
    console.log('Creating Bonus Points ledger...');
    await createPointsLedger(storage);
  } catch (error) {
    console.error(error);
  } finally {
    await storage.end();
  }
}, 0);
