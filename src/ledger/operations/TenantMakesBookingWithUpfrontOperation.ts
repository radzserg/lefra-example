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
  bookingTargetAmount: USD;
  lockedAmount: USD;
  paymentProcessingFee: USD;
  tenantUserId: number;
  upfrontPaymentAmount: USD;
};

export class TenantMakesBookingOperationWithUpfront
  implements ILedgerOperation
{
  public constructor(private readonly payload: OperationPayload) {}

  public async createTransaction() {
    const {
      bookingTargetAmount,
      lockedAmount,
      paymentProcessingFee,
      tenantUserId,
      upfrontPaymentAmount,
    } = this.payload;

    const account = ledgerAccountsRefBuilder(FirecncPlatformUsdLedger);
    const entries = new TransactionDoubleEntries([
      doubleEntry(
        debit(
          account('CURRENT_ASSETS_STRIPE_PLATFORM_USA'),
          bookingTargetAmount,
        ),
        [
          credit(
            account('OWNERS_ACCOUNTS_PAYABLES_LOCKED', tenantUserId),
            lockedAmount,
          ),
          credit(
            account('OWNERS_ACCOUNTS_PAYABLES', tenantUserId),
            upfrontPaymentAmount,
          ),
        ],
        'Tenant Payment Received and Held in CURRENT_ASSETS_STRIPE_PLATFORM_USA for Owner',
      ),
      doubleEntry(
        debit(account('STRIPE_PAY_IN_FEES'), paymentProcessingFee),
        credit(account('STRIPE_PAY_IN_FEES'), paymentProcessingFee),
        'Recording payment processing fee entry',
      ),
    ]);

    return new Transaction(
      entries,
      `Tenant:${tenantUserId} deposited ${bookingTargetAmount.format()} into the company's current assets`,
    );
  }
}
