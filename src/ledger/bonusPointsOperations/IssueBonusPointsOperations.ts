import { FirecncBonusPointsLedger } from '../FirecncBonusPointsLedger.js';
import { BonusPoint } from '../points.js';
import {
  credit,
  debit,
  doubleEntry,
  ILedgerOperation,
  ledgerAccountsRefBuilder,
  Transaction,
  TransactionDoubleEntries,
} from 'lefra';

type OperationPayload = {
  adminUserId: number; // admin user id that is issuing the bonus points
  amount: BonusPoint;
  userId: number;
};

export class IssueBonusPoints implements ILedgerOperation {
  public constructor(private readonly payload: OperationPayload) {}

  public async createTransaction() {
    const { adminUserId, amount, userId } = this.payload;

    const account = ledgerAccountsRefBuilder(FirecncBonusPointsLedger);
    const entries = new TransactionDoubleEntries([
      doubleEntry(
        debit(account('EXPENSES_BONUS_POINTS'), amount),
        credit(account('USER_BONUS_POINTS', userId), amount),
        'Recording bonus points issued to user',
      ),
    ]);

    return new Transaction(
      entries,
      `Admin:${adminUserId} issued ${amount.format()} bonus points to user ${userId}`,
    );
  }
}
