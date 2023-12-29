export const FirecncPlatformUsdLedger = {
  currencyCode: 'USD',
  entityAccountTypes: [
    'OWNERS_ACCOUNTS_PAYABLES',
    'OWNERS_ACCOUNTS_PAYABLES_LOCKED'
  ] as const,
  slug: 'FIRECNC_PLATFORM_USD',
  systemAccounts: [
    'OWNER_FUNDS',
    'EXPENSES_STRIPE_FEES',
    'LIABILITIES_STRIPE_FEES',
    'CURRENT_ASSETS_STRIPE_PLATFORM_USA',
    'SUBSCRIPTION_PROFIT',
    'BOOKINGS_PROFIT',
    'REFUNDS',
    'STRIPE_PAY_IN_FEES',
    'BOOKING_HOLDINGS'
  ] as const,
};
