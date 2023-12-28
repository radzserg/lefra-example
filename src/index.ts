import { ledgerAccountsRefBuilder, PostgresLedgerStorage } from "lefra";
import { OwnerFundsDepositOperation } from "./ledger/operations/OwnerFundsDepositOperation";
import { usd } from "./ledger/money";
import { FirecncPlatformUsdLedger } from "./ledger/FirecncPlatformUsdLedger";


//  const debitEntry = debit( new SystemAccountRef('PLATFORM_USD', "CASH"), usd(100));
// console.log(debitEntry)
//

setTimeout(async () => {
  const storage = new PostgresLedgerStorage(process.env.LFR_DATABASE_URL!);
  try {
    // await createLedger(storage);


    const operation = new OwnerFundsDepositOperation({
      adminUserId: 1,
      amount: usd(100),
    });
    await storage.insertTransaction(await operation.createTransaction())

    const account = ledgerAccountsRefBuilder(FirecncPlatformUsdLedger);
    const balance = await storage.fetchAccountBalance(account('CURRENT_ASSETS'));
    if (!balance) {
      throw new Error('Balance not found');
    }
    console.log('Current assets balance', balance.format())


  } catch (error) {
    console.error(error);
  } finally {
    await storage.end()
  }
}, 0);