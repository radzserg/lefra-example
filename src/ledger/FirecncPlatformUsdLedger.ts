export const FirecncPlatformUsdLedger = {
  currencyCode: 'USD',
  entityAccountTypes: ['OWNERS_ACCOUNTS_PAYABLES'] as const,
  slug: 'FIRECNC_PLATFORM_USD',
  systemAccounts: [
    'CURRENT_ASSETS',
    'OWNER_FUNDS',
    'EXPENSES_STRIPE_FEES',
    'LIABILITIES_STRIPE_FEES',
    'SUBSCRIPTION_PROFIT',
    'BOOKINGS_PROFIT',
    'REFUNDS',
    'STRIPE_PAY_IN_FEES',
    'BOOKING_HOLDINGS',
  ] as const,
};
