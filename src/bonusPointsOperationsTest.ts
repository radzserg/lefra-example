/*  eslint-disable no-console */

import { IssueBonusPoints } from './ledger/bonusPointsOperations/IssueBonusPointsOperations.js';
import { FirecncBonusPointsLedger } from './ledger/FirecncBonusPointsLedger.js';
import { FirecncPlatformUsdLedger } from './ledger/FirecncPlatformUsdLedger.js';
import { points } from './ledger/points.js';
import {
  Ledger,
  ledgerAccountsRefBuilder,
  PostgresLedgerStorage,
  // TransactionFlowRenderer,
} from 'lefra';

setTimeout(async () => {
  // eslint-disable-next-line n/no-process-env, @typescript-eslint/no-non-null-assertion
  const storage = new PostgresLedgerStorage(process.env.LFR_DATABASE_URL!);
  const ledger = new Ledger(storage);
  try {
    // const transaction = await new IssueBonusPoints({
    //   adminUserId: 1,
    //   amount: points(100),
    //   userId: 23,
    // }).createTransaction();
    // const renderer = new TransactionFlowRenderer();
    // console.log(
    //   renderer.render(transaction, {
    //     showFinalBalances: true,
    //   }),
    // );

    await ledger.record(
      new IssueBonusPoints({
        adminUserId: 1,
        amount: points(100),
        userId: 23,
      }),
    );

    const account = ledgerAccountsRefBuilder(FirecncBonusPointsLedger);
    const balance = await ledger.fetchAccountBalance(
      account('USER_BONUS_POINTS', 23),
    );
    console.log('USER_BONUS_POINTS:23', balance.format());
  } catch (error) {
    console.error(error);
  } finally {
    await storage.end();
  }
}, 0);
