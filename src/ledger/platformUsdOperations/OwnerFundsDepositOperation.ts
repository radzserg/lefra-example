import { FirecncPlatformUsdLedger } from '../FirecncPlatformUsdLedger.js';
import { USD } from '../money.js';
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
  adminUserId: number;
  amount: USD;
};

export class OwnerFundsDepositOperation implements ILedgerOperation {
  public constructor(private readonly payload: OperationPayload) {}

  public async createTransaction() {
    const { adminUserId, amount } = this.payload;

    const account = ledgerAccountsRefBuilder(FirecncPlatformUsdLedger);
    const entries = new TransactionDoubleEntries([
      doubleEntry(
        debit(account('CURRENT_ASSETS_STRIPE_PLATFORM_USA'), amount),
        credit(account('OWNER_FUNDS'), amount),
        "Inject additional funds into the company's current assets from the owner's funds",
      ),
    ]);

    return new Transaction(
      entries,
      `Admin:${adminUserId} deposited ${amount.format()} into the company's current assets`,
    );
  }
}
