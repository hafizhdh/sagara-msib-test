import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query, Put } from '@nestjs/common';
import { ClothesService } from './clothes.service';
import { CreateClothesDto } from './dto/create-clothes.dto';
import { UpdateClothesDto } from './dto/update-clothes.dto';
import { UpdateStockDTO } from './dto/update-stock.dto';

@Controller('api/clothes')
export class ClothesController {
  constructor(private readonly clothesService: ClothesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createClothesDto: CreateClothesDto) {
    return this.clothesService.create(createClothesDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query('color') color?: string,
    @Query('size') size?: string
    ) {
    return this.clothesService.findAll(color, size);
  }
  
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.clothesService.findOne(id);
  }
  
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateClothesDto: UpdateClothesDto) {
    return this.clothesService.update(id, updateClothesDto);
  }
  
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.clothesService.remove(id);
  }

  @Patch('stock/add/:id')
  @HttpCode(HttpStatus.OK)
  addStock(@Param('id') id: string, @Body() updateStockDto: UpdateStockDTO) {
    return this.clothesService.updateStock(id, updateStockDto, 'ADD')
  }

  @Patch('stock/remove/:id')
  @HttpCode(HttpStatus.OK)
  removeStock(@Param('id') id: string, @Body() updateStockDto: UpdateStockDTO) {
    return this.clothesService.updateStock(id, updateStockDto, 'REMOVE')
  }
}
