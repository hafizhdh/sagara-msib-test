import { PartialType } from '@nestjs/mapped-types';
import { CreateClothesDto } from './create-clothes.dto';

export class UpdateClothesDto extends PartialType(CreateClothesDto) {}
