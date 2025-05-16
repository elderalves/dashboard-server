import { IsNotEmpty, MaxLength, Min, MinLength } from 'class-validator';

export class CreateStripeProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @MinLength(10, {
    message:
      'Description is too short. Minimal length is $constraint1 characters',
  })
  description: string;

  @IsNotEmpty()
  default_price_data: StripePriceData;
}

export class CreateStripeProductResponse {
  id: string;
  name: string;
}

export class CreateStripePaymentDto {
  @IsNotEmpty()
  priceId: string;

  @MinLength(1, {
    message: 'Quantity has to be greater than 0',
  })
  quantity: number;
}

class StripePriceData {
  @MinLength(3)
  @MaxLength(3)
  currency: string;

  @Min(10)
  unit_amount: number;
}
