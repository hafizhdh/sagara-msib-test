import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateClothesDto } from './dto/create-clothes.dto';
import { UpdateClothesDto } from './dto/update-clothes.dto';
import { PrismaService } from 'src/plugin/prisma/prisma.service';
import { Size } from '@prisma/client';

@Injectable()
export class ClothesService {
  constructor(private prisma: PrismaService) {}

  async create(createClothesDto: CreateClothesDto) {
    const size = Size[createClothesDto.size.toUpperCase()] as keyof typeof Size
    if (!size) {
      throw new BadRequestException(`Clothes with size ${createClothesDto.size} is invalid. Valid sizes are [XS, S, M, L, XL, XL, XXL, XXXL]`)
    }
    
    const clothes = await this.prisma.clothes.create({
      data: {
        ...createClothesDto,
        color: createClothesDto.color.toLowerCase(),
        size: size
      }
    }).catch((error) => {
      console.error(error)
      throw new InternalServerErrorException('Error while creating new entry')
    })
    
    return clothes
  }
  
  async findAll(color: string, size: string) {
    const where: any = {}

    if (color) {
      where.color = color
    }

    if (size) {
      const validatedSize = Size[size.toUpperCase()] as keyof typeof Size
      if (!validatedSize) {
        throw new BadRequestException(`Clothes with size ${size} is invalid. Valid sizes are [XS, S, M, L, XL, XL, XXL, XXXL]`)
      }
      where.size = validatedSize
    }

    return await this.prisma.clothes.findMany({
      where
    })
  }
  
  async findOne(id: string) {
    const clothes = this.prisma.clothes.findUnique({
      where: {id: id}
    })

    if (!clothes) throw new NotFoundException(`Clothes with id ${id} not found`)
   
    return clothes
  }
  
  async update(id: string, updateClothesDto: UpdateClothesDto) {
    const clothes = await this.prisma.clothes.findUnique({
      where: {id: id}
    })
    
    if (!clothes) throw new NotFoundException(`Clothes with id ${id} not found`)

    const size = Size[updateClothesDto.size.toUpperCase()] as keyof typeof Size
    if (!size) {
      throw new BadRequestException(`Clothes with size ${updateClothesDto.size} is invalid. Valid sizes are [XS, S, M, L, XL, XL, XXL, XXXL]`)
    }
      
    const updatedClothes = await this.prisma.clothes.update({
      where: {id: id},
      data: {
        ...updateClothesDto,
        color: updateClothesDto.color.toLowerCase(),
        size: size
      }
    }).catch((error) => {
      throw new InternalServerErrorException('Error while updating object')
    })
    
    return updatedClothes
  }
    
    async remove(id: string) {
      const clothes = await this.prisma.clothes.findUnique({
        where: {id: id}
      })
      
      if (!clothes) throw new NotFoundException(`Clothes with id ${id} not found`)
      
      await this.prisma.clothes.delete({
        where: {id: id}
      })
    }
  }
  