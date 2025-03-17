import { VolumeBasedDiscountService } from './volume-based-discount.service';
import { OrderCalculationsParams } from '../type';

describe(VolumeBasedDiscountService.name, () => {
  const testCases: {
    name: string;
    input: {
      products: {
        quantity: number;
      }[];
      calculatedBasePrice: number;
    };
    result: number;
  }[] = [
    {
      name: 'should not apply any discount with single product volume',
      input: {
        products: [
          {
            quantity: 1,
          },
        ],
        calculatedBasePrice: 10,
      },
      result: 10,
    },
    {
      name: 'should apply 10% discount with single product and 5 units',
      input: {
        products: [
          {
            quantity: 5,
          },
        ],
        calculatedBasePrice: 50,
      },
      result: 45,
    },
    {
      name: 'should apply 20% discount with single product and 10 units',
      input: {
        products: [
          {
            quantity: 10,
          },
        ],
        calculatedBasePrice: 100,
      },
      result: 80,
    },
    {
      name: 'should apply 30% discount with single product and 50 units',
      input: {
        products: [
          {
            quantity: 50,
          },
        ],
        calculatedBasePrice: 500,
      },
      result: 350,
    },
    {
      name: 'should apply 10% discount with 5 separate products that sums to 7 units',
      input: {
        products: [
          {
            quantity: 1,
          },
          {
            quantity: 1,
          },
          {
            quantity: 2,
          },
          {
            quantity: 2,
          },
          {
            quantity: 1,
          },
        ],
        calculatedBasePrice: 355,
      },
      result: 319.5,
    },
    {
      name: 'should apply 20% discount with 5 separate products that sums to 10 units',
      input: {
        products: [
          {
            quantity: 1,
          },
          {
            quantity: 3,
          },
          {
            quantity: 4,
          },
          {
            quantity: 1,
          },
          {
            quantity: 1,
          },
        ],
        calculatedBasePrice: 200,
      },
      result: 160,
    },
    {
      name: 'should apply 30% discount with 10 separate products that sums to 100 units',
      input: {
        products: [
          {
            quantity: 15,
          },
          {
            quantity: 5,
          },
          {
            quantity: 8,
          },
          {
            quantity: 22,
          },
          {
            quantity: 5,
          },
          {
            quantity: 20,
          },
          {
            quantity: 5,
          },
          {
            quantity: 10,
          },
          {
            quantity: 3,
          },
          {
            quantity: 7,
          },
        ],
        calculatedBasePrice: 10000,
      },
      result: 7000,
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
