import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class UpdateStockDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  stock: number
}