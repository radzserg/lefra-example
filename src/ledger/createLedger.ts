/*  eslint-disable no-console */

import {
  DB_ID,
  InputLedgerAccount,
  InputLedgerAccountType,
  LedgerStorage,
  NormalBalance,
} from 'lefra';

type InputLedgerAccountTypeWithParent = Omit<
  InputLedgerAccountType,
  'parentLedgerAccountTypeId'
> & {
  parentLedgerAccountTypeSlug: string | null;
};
type InputLedgerAccountWithParent = Omit<
  InputLedgerAccount,
  'ledgerAccountTypeId' | 'ledgerId'
> & {
  ledgerAccountTypeSlug: string | null;
};

const basicAccountTypes: InputLedgerAccountTypeWithParent[] = [
  {
    description:
      'Accounts in this category represent the valuable resources and possessions owned by the company ' +
      'or organization. These can include cash, property, equipment, investments, and more. Assets are things of value ' +
      "that contribute to the entity's financial well-being.",
    isEntityLedgerAccount: false,
    name: 'Assets',
    normalBalance: 'DEBIT' as NormalBalance,
    parentLedgerAccountTypeSlug: null,
    slug: 'ASSETS',
  },
  {
    description:
      'Equity accounts reflect the ownership interest in the company. It signifies the residual interest in ' +
      "assets after deducting liabilities. In simple terms, it's what remains for the owners if all assets were sold and " +
      'debts paid off. Equity represents the ownership stake and net worth of the entity.',
    isEntityLedgerAccount: false,
    name: 'Equity',
    normalBalance: 'CREDIT' as NormalBalance,
    parentLedgerAccountTypeSlug: null,
    slug: 'EQUITY',
  },
  {
    description:
      'Expenses accounts cover the costs incurred by the company or organization in its day-to-day operations. ' +
      'These include expenses for salaries, rent, utilities, supplies, and other expenditures necessary to run the business. ' +
      "Expenses reduce the company's equity.",
    isEntityLedgerAccount: false,
    name: 'Expenses',
    normalBalance: 'DEBIT' as NormalBalance,
    parentLedgerAccountTypeSlug: null,
    slug: 'EXPENSES',
  },
  {
    description:
      'Income accounts capture the revenue generated by the company or organization. This includes money ' +
      "earned from sales, services, investments, and other sources. Income increases the company's equity.",
    isEntityLedgerAccount: false,
    name: 'Income',
    normalBalance: 'CREDIT' as NormalBalance,
    parentLedgerAccountTypeSlug: null,
    slug: 'INCOME',
  },
  {
    description:
      'Liability accounts represent obligations or debts that the company owes to external parties. These ' +
      'can include loans, unpaid bills, salaries payable, and other financial commitments. Liabilities reflect the ' +
      "company's responsibilities to settle these obligations in the future.",
    isEntityLedgerAccount: false,
    name: 'Liabilities',
    normalBalance: 'CREDIT' as NormalBalance,
    parentLedgerAccountTypeSlug: null,
    slug: 'LIABILITIES',
  },
];

const firecncAccountTypes: InputLedgerAccountTypeWithParent[] = [
  {
    description:
      'Represents resources that a company expects to convert into cash or use up within one year or one operating cycle. Bank accounts fall under this category as they represent readily accessible cash and cash equivalents.',
    isEntityLedgerAccount: false,
    name: 'Current Assets',
    normalBalance: 'DEBIT' as NormalBalance,
    parentLedgerAccountTypeSlug: 'ASSETS',
    slug: 'CURRENT_ASSETS',
  },
  {
    description:
      "This account reflects the amount the company owes to the apartment owners. It represents the company's liability to pay owners for the bookings made on their properties.",
    isEntityLedgerAccount: true,
    name: 'Owners Accounts Payable',
    normalBalance: 'CREDIT' as NormalBalance,
    parentLedgerAccountTypeSlug: 'LIABILITIES',
    slug: 'OWNERS_ACCOUNTS_PAYABLES',
  },
  {
    description:
      "Represents the company's accumulated profits from its operations. This account records the net income earned by the company over time.",
    isEntityLedgerAccount: false,
    name: 'Profit',
    normalBalance: 'CREDIT' as NormalBalance,
    parentLedgerAccountTypeSlug: 'INCOME',
    slug: 'PROFIT',
  },
  {
    description:
      'This account represents funds held in clearing for various financial transactions. It serves as an intermediary account before funds are transferred to their final destination.',
    isEntityLedgerAccount: false,
    name: 'Clearing',
    normalBalance: 'CREDIT' as NormalBalance,
    parentLedgerAccountTypeSlug: 'INCOME',
    slug: 'CLEARING',
  },
];

const insertAccountTypes = async (
  ledgerId: DB_ID,
  storage: LedgerStorage,
  accountTypes: InputLedgerAccountTypeWithParent[],
) => {
  for (const accountTypeData of accountTypes) {
    const parentLedgerAccountTypeSlug =
      accountTypeData.parentLedgerAccountTypeSlug;
    let parentLedgerAccountTypeId = null;
    if (parentLedgerAccountTypeSlug) {
      const parentAccountType = await storage.findAccountTypeBySlug(
        parentLedgerAccountTypeSlug,
      );
      if (!parentAccountType) {
        throw new Error(
          `Parent account type with slug ${parentAccountType} not found`,
        );
      }

      parentLedgerAccountTypeId = parentAccountType.id;
    }

    console.log('inserting account type...', accountTypeData.slug);
    const accountType = await storage.insertAccountType({
      ...accountTypeData,
      parentLedgerAccountTypeId,
    });
    // assign account type to ledger
    // in our case, all account types are assigned to the same ledger
    // but in a real world scenario, you might want to assign account types to different ledgers
    await storage.assignAccountTypeToLedger({
      accountTypeId: accountType.id,
      ledgerId,
    });
  }
};

const insertAccounts = async (
  ledgerId: DB_ID,
  storage: LedgerStorage,
  accountsData: InputLedgerAccountWithParent[],
) => {
  for (const accountData of accountsData) {
    const ledgerAccountTypeSlug = accountData.ledgerAccountTypeSlug;
    let ledgerAccountTypeId = null;
    if (ledgerAccountTypeSlug) {
      const accountType = await storage.findAccountTypeBySlug(
        ledgerAccountTypeSlug,
      );
      ledgerAccountTypeId = accountType?.id;
    }

    if (!ledgerAccountTypeId) {
      throw new Error(
        `Account type with slug ${ledgerAccountTypeSlug} not found`,
      );
    }

    console.log('inserting account...', accountData.slug);
    await storage.insertAccount({
      ...accountData,
      ledgerAccountTypeId,
      ledgerId,
    });
  }
};

const accounts: InputLedgerAccountWithParent[] = [
  {
    description: 'Owner Funds Account',
    ledgerAccountTypeSlug: 'EQUITY',
    slug: 'OWNER_FUNDS',
  },
  {
    description: 'Current Assets Account',
    ledgerAccountTypeSlug: 'ASSETS',
    slug: 'CURRENT_ASSETS',
  },
  {
    description: 'Stripe Fees Expense Account',
    ledgerAccountTypeSlug: 'EXPENSES',
    slug: 'EXPENSES_STRIPE_FEES',
  },
  {
    description: 'Stripe Fees Liability Account',
    ledgerAccountTypeSlug: 'LIABILITIES',
    slug: 'LIABILITIES_STRIPE_FEES',
  },
  {
    description: 'Bookings Profit Account',
    ledgerAccountTypeSlug: 'PROFIT',
    slug: 'BOOKINGS_PROFIT',
  },
  {
    description: 'Subscription Profit Account',
    ledgerAccountTypeSlug: 'PROFIT',
    slug: 'SUBSCRIPTION_PROFIT',
  },
  {
    description: 'Booking Holdings Clearing Account',
    ledgerAccountTypeSlug: 'CLEARING',
    slug: 'BOOKING_HOLDINGS',
  },
  {
    description: 'Stripe Pay-In Fees Clearing Account',
    ledgerAccountTypeSlug: 'CLEARING',
    slug: 'STRIPE_PAY_IN_FEES',
  },
  {
    description: 'Refunds Clearing Account',
    ledgerAccountTypeSlug: 'CLEARING',
    slug: 'REFUNDS',
  },
];

export const createLedger = async (storage: LedgerStorage) => {
  const usdCurrency = await storage.insertCurrency({
    code: 'USD',
    minimumFractionDigits: 2,
    symbol: '$',
  });

  const ledger = await storage.insertLedger({
    description: "The main ledger used for Firecnc's platform",
    ledgerCurrencyId: usdCurrency.id,
    name: 'Firecnc Platform USD',
    slug: 'FIRECNC_PLATFORM_USD',
  });
  const ledgerId = ledger.id;

  console.log('Inserting account types...');
  await insertAccountTypes(ledgerId, storage, basicAccountTypes);
  await insertAccountTypes(ledgerId, storage, firecncAccountTypes);
  console.log('Inserting accounts...');
  await insertAccounts(ledgerId, storage, accounts);

  // pnpm lefra generate --className FirecncPlatformUsdLedger --ledgerSlug FIRECNC_PLATFORM_USD --path ./src/ledger/FirecncPlatformUsdLedger.ts
};
