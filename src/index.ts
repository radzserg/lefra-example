/*  eslint-disable no-console */

import { FirecncPlatformUsdLedger } from './ledger/FirecncPlatformUsdLedger.js';
import { usd } from './ledger/money.js';
import { OwnerFundsDepositOperation } from './ledger/operations/OwnerFundsDepositOperation.js';
import { ledgerAccountsRefBuilder, PostgresLedgerStorage } from 'lefra';

setTimeout(async () => {
  // eslint-disable-next-line n/no-process-env, @typescript-eslint/no-non-null-assertion
  const storage = new PostgresLedgerStorage(process.env.LFR_DATABASE_URL!);
  try {
    // await createLedger(storage);

    const operation = new OwnerFundsDepositOperation({
      adminUserId: 1,
      amount: usd(100),
    });
    await storage.insertTransaction(await operation.createTransaction());

    const account = ledgerAccountsRefBuilder(FirecncPlatformUsdLedger);
    const balance = await storage.fetchAccountBalance(
      account('CURRENT_ASSETS'),
    );
    if (!balance) {
      throw new Error('Balance not found');
    }

    console.log('Current assets balance', balance.format());
  } catch (error) {
    console.error(error);
  } finally {
    await storage.end();
  }
}, 0);
