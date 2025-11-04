import { calculateAmount, calculateFact } from './ingredients-utils';

describe('calculateFact', () => {
  test('Calculate fact', () => {
    const amount = 200;
    const factPer100 = 75;
    const fact = calculateFact(amount, 75);
    expect(fact).toEqual(150);
  });
});

describe('calculateAmount', () => {
  test('Calculate amount', () => {
    const factValue = 180;
    const factPer100 = 45;
    const amount = calculateAmount(factValue, factPer100);
    expect(amount).toEqual(400);
  });
});