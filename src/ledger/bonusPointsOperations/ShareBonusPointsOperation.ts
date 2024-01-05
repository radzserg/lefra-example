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
  amount: BonusPoint;
  providerUserId: number;
  receiverUserId: number;
};

export class ShareBonusPointsOperation implements ILedgerOperation {
  public constructor(private readonly payload: OperationPayload) {}

  public async createTransaction() {
    const { amount, providerUserId, receiverUserId } = this.payload;

    const account = ledgerAccountsRefBuilder(FirecncBonusPointsLedger);
    const entries = new TransactionDoubleEntries([
      doubleEntry(
        debit(account('USER_BONUS_POINTS', providerUserId), amount),
        credit(account('USER_BONUS_POINTS', receiverUserId), amount),
        'Recording bonus points shared between users',
      ),
    ]);

    return new Transaction(
      entries,
      `User:${providerUserId} shares ${amount.format()} bonus points with user ${receiverUserId}`,
    );
  }
}
