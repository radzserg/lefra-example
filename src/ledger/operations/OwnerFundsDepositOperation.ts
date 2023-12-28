import {
  credit,
  debit,
  ILedgerOperation,
  ledgerAccountsRefBuilder,
  Transaction,
  TransactionDoubleEntries,
  doubleEntry
} from "lefra";
import { FirecncPlatformUsdLedger } from "../FirecncPlatformUsdLedger";
import { USD } from "../money";

type ProjectStartedOperationData = {
  amount: USD;
  adminUserId: number;
}

export class OwnerFundsDepositOperation implements ILedgerOperation {
  public constructor(private readonly payload: ProjectStartedOperationData) {
  }

  public async createTransaction() {
    const {
      adminUserId,
      amount,
    } = this.payload;

    const account = ledgerAccountsRefBuilder(FirecncPlatformUsdLedger);
    const entries = TransactionDoubleEntries.empty<'USD'>();

    entries.push(
      doubleEntry(
        debit(
          account('CURRENT_ASSETS'),
          amount,
        ),
        credit(
          account('OWNER_FUNDS'),
          amount,
        ),
        'Records the injection of additional funds into the company\'s current assets from the owner\'s equity',
      ),
    );

    return new Transaction(entries, `Admin:${adminUserId} deposited ${amount.format()} into the company's current assets`);
  }
}
