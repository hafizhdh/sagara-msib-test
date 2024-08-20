import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class UpdateStockDTO {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  stock: number
}