import { Unit } from "lefra";

export const usd = (amount: number | string) => {
  return new Unit(amount, 'USD', 2);
};

export type USD = Unit<'USD'>;
