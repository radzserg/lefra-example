import { Unit } from 'lefra';

export const points = (amount: number | string) => {
  return new Unit(amount, 'BonusPoint', 0);
};

export type BonusPoint = Unit<'BonusPoint'>;
