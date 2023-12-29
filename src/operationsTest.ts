/*  eslint-disable no-console */

import { FirecncPlatformUsdLedger } from './ledger/FirecncPlatformUsdLedger.js';
import { usd } from './ledger/money.js';
import { TenantMakesBookingOperation } from './ledger/operations/TenantMakesBookingOperation.js';
import { ledgerAccountsRefBuilder, PostgresLedgerStorage } from 'lefra';

setTimeout(async () => {
  // eslint-disable-next-line n/no-process-env, @typescript-eslint/no-non-null-assertion
  const storage = new PostgresLedgerStorage(process.env.LFR_DATABASE_URL!);
  try {
    // const operation = new OwnerFundsDepositOperation({
    //   adminUserId: 1,
    //   amount: usd(100),
    // });
    // await storage.insertTransaction(await operation.createTransaction());
    //
    // const account = ledgerAccountsRefBuilder(FirecncPlatformUsdLedger);
    // const balance = await storage.fetchAccountBalance(
    //   account('CURRENT_ASSETS_STRIPE_PLATFORM_USA'),
    // );
    // if (!balance) {
    //   throw new Error('Balance not found');
    // }

    const operation = new TenantMakesBookingOperation({
      bookingTargetAmount: usd(100),
      paymentProcessingFee: usd(3.3),
      tenantUserId: 1,
    });
    await storage.insertTransaction(await operation.createTransaction());

    const account = ledgerAccountsRefBuilder(FirecncPlatformUsdLedger);
    const balance = await storage.fetchAccountBalance(
      account('OWNERS_ACCOUNTS_PAYABLES_LOCKED', 1),
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
