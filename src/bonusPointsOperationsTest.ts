/*  eslint-disable no-console */

import { IssueBonusPoints } from './ledger/bonusPointsOperations/IssueBonusPointsOperations.js';
import { ShareBonusPointsOperation } from './ledger/bonusPointsOperations/ShareBonusPointsOperation.js';
import { FirecncBonusPointsLedger } from './ledger/FirecncBonusPointsLedger.js';
import { points } from './ledger/points.js';
import {
  Ledger,
  ledgerAccountsRefBuilder,
  PostgresLedgerStorage,
  TransactionFlowRenderer,
  // TransactionFlowRenderer,
} from 'lefra';

setTimeout(async () => {
  // eslint-disable-next-line n/no-process-env, @typescript-eslint/no-non-null-assertion
  const storage = new PostgresLedgerStorage(process.env.LFR_DATABASE_URL!);
  const ledger = new Ledger(storage);
  try {
    const transaction = await new IssueBonusPoints({
      adminUserId: 1,
      amount: points(100),
      userId: 23,
    }).createTransaction();
    const renderer = new TransactionFlowRenderer();
    console.log(
      renderer.render(transaction, {
        showFinalBalances: true,
      }),
    );

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

    await ledger.record(
      new ShareBonusPointsOperation({
        amount: points(20.6),
        providerUserId: 23,
        receiverUserId: 42,
      }),
    );
    const providerBalance = await ledger.fetchAccountBalance(
      account('USER_BONUS_POINTS', 23),
    );
    const receiverBalance = await ledger.fetchAccountBalance(
      account('USER_BONUS_POINTS', 42),
    );
    console.log('Provider balance', providerBalance.format());
    console.log('Receiver balance', receiverBalance.format());
  } catch (error) {
    console.error(error);
  } finally {
    await storage.end();
  }
}, 0);
