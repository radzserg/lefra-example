# Example Application for the Lefra Package

This is a demo application that illustrates how to integrate the [lefra](https://www.npmjs.com/package/lefra) package into your own project. In this example, we'll use a fictional application that allows homeowners to rent out their properties to tenants.

## How to Use

To get started, follow these steps:

1. Install the necessary dependencies by running:

```sh
   npm install
   docker-compose up -d
```

#### Generate database tables for the ledger by executing the following command:

```sh
LFR_DATABASE_URL='postgresql://ledger:ledger@localhost:5476/ledger' npm run lefra init
```

#### Creating Ledger

To create the ledger structure

```sh
npm run create-ledgers
```

This command will create two ledgers. The first one manages all application-related incomes, expenses, assets, and 
liabilities, which is used for the USD account. You can find the details [here](https://github.com/radzserg/lefra-example/blob/main/src/ledger/createLedgers.ts#L148). The second ledger is dedicated to 
managing [bonus points](https://github.com/radzserg/lefra-example/blob/main/src/ledger/createLedgers.ts#L289).

#### Recording Ledger Transactions

To record ledger transactions, you can use the following commands:

For transactions related to the main platform ledger, run:

```sh
npm run test-usd-operations
```

You can find more information about the main platform ledger [here](https://github.com/radzserg/lefra-example/tree/main/src/ledger/platformUsdOperations)..

For transactions involving bonus points, run:

```sh
npm run test-bonus-points-operations
```

Details on bonus points transactions are available [here](https://github.com/radzserg/lefra-example/tree/main/src/ledger/bonusPointsOperations)  

Feel free to explore the code and adapt it to your specific use case.







