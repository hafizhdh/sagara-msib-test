import { Size } from "@prisma/client"
import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator"

export class CreateClothesDto {
  @IsString()
  @IsNotEmpty()
  color: string

  @IsString()
  @IsNotEmpty()
  size: Size

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  price: number

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  stock: number
}
