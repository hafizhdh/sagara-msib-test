import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateClothesDto } from './dto/create-clothes.dto';
import { UpdateClothesDto } from './dto/update-clothes.dto';
import { PrismaService } from '../plugin/prisma/prisma.service';
import { Size } from '@prisma/client';
import { UpdateStockDTO } from './dto/update-stock.dto';

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
      where.color = color.toLowerCase()
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
    const clothes = await this.checkExist(id)
   
    return clothes
  }
  
  async update(id: string, updateClothesDto: UpdateClothesDto) {
    await this.checkExist(id)

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
    await this.checkExist(id);
    
    await this.prisma.clothes.delete({
      where: {id: id}
    })
  }

  private async checkExist(id: string) {
    const clothes = await this.prisma.clothes.findUnique({
      where: { id: id }
    });

    if (!clothes) throw new NotFoundException(`Clothes with id ${id} not found`);
    return clothes
  }

  async updateStock(id: string, updateStockDto: UpdateStockDTO, status: string) {
    const clothes = await this.checkExist(id)
    const currentStock = clothes.stock
    if (status === 'REMOVE' && currentStock - updateStockDto.stock < 0) {
      throw new BadRequestException(`New stock cannot below 0 (zero). Current stock is ${currentStock}`)
    }

    const updatedStock = status === 'ADD' ? currentStock + updateStockDto.stock : currentStock - updateStockDto.stock

    const updatedClothes = await this.prisma.clothes.update({
      where: {id: id},
      data: {
        stock: updatedStock
      }
    }).catch((error) => {
      throw new InternalServerErrorException('Error while updating clothes')
    })

    return updatedClothes
  }

  async findRunOutStock() {
    return await this.prisma.clothes.findMany({
      where: {
        stock: {
          equals: 0
        }
      }
    })
  }

  async findLimitedStock() {
    return await this.prisma.clothes.findMany({
      where: {
        stock: {
          lt: 5
        }
      }
    })
  }
}
  