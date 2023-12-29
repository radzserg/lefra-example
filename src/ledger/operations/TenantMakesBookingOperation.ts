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

type ProjectStartedOperationData = {
  bookingTargetAmount: USD;
  paymentProcessingFee: USD;
  tenantUserId: number;
};

export class TenantMakesBookingOperation implements ILedgerOperation {
  public constructor(private readonly payload: ProjectStartedOperationData) {}

  public async createTransaction() {
    const { bookingTargetAmount, paymentProcessingFee, tenantUserId } =
      this.payload;

    const account = ledgerAccountsRefBuilder(FirecncPlatformUsdLedger);
    const entries = new TransactionDoubleEntries([
      doubleEntry(
        debit(
          account('CURRENT_ASSETS_STRIPE_PLATFORM_USA'),
          bookingTargetAmount,
        ),
        credit(
          account('OWNERS_ACCOUNTS_PAYABLES_LOCKED', tenantUserId),
          bookingTargetAmount,
        ),
        'Tenant Payment Received and Held in CURRENT_ASSETS_STRIPE_PLATFORM_USA for Owner',
      ),
      doubleEntry(
        debit(account('STRIPE_PAY_IN_FEES'), paymentProcessingFee),
        credit(account('STRIPE_PAY_IN_FEES'), paymentProcessingFee),
        'Recording Payment Processing Fee Transaction for Tracking',
      ),
    ]);

    return new Transaction(
      entries,
      `Tenant:${tenantUserId} deposited ${bookingTargetAmount.format()} into the company's current assets`,
    );
  }
}
