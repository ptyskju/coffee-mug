import { VolumeBasedDiscountService } from './volume-based-discount.service';
import { OrderCalculationsParams } from '../type';

describe(VolumeBasedDiscountService.name, () => {
  const testCases: {
    name: string;
    input: {
      quantity: number;
      product: { price: number };
    }[];
    result: number | undefined;
  }[] = [
    {
      name: 'should not apply any discount with single product volume',
      input: [
        {
          quantity: 1,
          product: { price: 10 },
        },
      ],
      result: undefined,
    },
    {
      name: 'should apply 10% discount with single product and 5 units',
      input: [
        {
          quantity: 5,
          product: { price: 10 },
        },
      ],
      result: 45,
    },
    {
      name: 'should apply 20% discount with single product and 10 units',
      input: [
        {
          quantity: 10,
          product: { price: 10 },
        },
      ],
      result: 80,
    },
    {
      name: 'should apply 30% discount with single product and 50 units',
      input: [
        {
          quantity: 50,
          product: { price: 10 },
        },
      ],
      result: 350,
    },
    {
      name: 'should apply 10% discount with 5 separate products that sums to 7 units',
      input: [
        {
          quantity: 1,
          product: { price: 10 },
        },
        {
          quantity: 1,
          product: { price: 5 },
        },
        {
          quantity: 2,
          product: { price: 7 },
        },
        {
          quantity: 2,
          product: { price: 15 },
        },
        {
          quantity: 1,
          product: { price: 99 },
        },
      ],
      result: 142.2,
    },
    {
      name: 'should apply 20% discount with 5 separate products that sums to 10 units',
      input: [
        {
          quantity: 1,
          product: { price: 10 },
        },
        {
          quantity: 3,
          product: { price: 5 },
        },
        {
          quantity: 4,
          product: { price: 7 },
        },
        {
          quantity: 1,
          product: { price: 15 },
        },
        {
          quantity: 1,
          product: { price: 99 },
        },
      ],
      result: 133.6,
    },
    {
      name: 'should apply 30% discount with 10 separate products that sums to 100 units',
      input: [
        {
          quantity: 15,
          product: { price: 10 },
        },
        {
          quantity: 5,
          product: { price: 5 },
        },
        {
          quantity: 8,
          product: { price: 7 },
        },
        {
          quantity: 22,
          product: { price: 15 },
        },
        {
          quantity: 5,
          product: { price: 99 },
        },
        {
          quantity: 20,
          product: { price: 80 },
        },
        {
          quantity: 5,
          product: { price: 345 },
        },
        {
          quantity: 10,
          product: { price: 299 },
        },
        {
          quantity: 3,
          product: { price: 85 },
        },
        {
          quantity: 7,
          product: { price: 150 },
        },
      ],
      result: 6073.2,
    },
  ];

  testCases.forEach((singleTestCase) => {
    it(singleTestCase.name, () => {
      const service = new VolumeBasedDiscountService();

      const result = service.calculatePerOrder(
        singleTestCase.input as OrderCalculationsParams,
      );

      if (singleTestCase.result === undefined) {
        expect(result).toEqual(undefined);
        return;
      }

      expect(result).toBeCloseTo(singleTestCase.result);
    });
  });
});
