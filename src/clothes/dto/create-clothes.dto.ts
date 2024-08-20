import { ApiProperty } from "@nestjs/swagger"
import { Size } from "@prisma/client"
import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator"

export class CreateClothesDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  color: string
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  size: Size
  
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  price: number
  
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  stock: number
}
