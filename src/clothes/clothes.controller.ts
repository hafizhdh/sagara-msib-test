import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query, Put } from '@nestjs/common';
import { ClothesService } from './clothes.service';
import { CreateClothesDto } from './dto/create-clothes.dto';
import { UpdateClothesDto } from './dto/update-clothes.dto';
import { UpdateStockDTO } from './dto/update-stock.dto';
import { ApiBadRequestResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('clothes')
@Controller('api/clothes')
export class ClothesController {
  constructor(private readonly clothesService: ClothesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBadRequestResponse({description: 'Invalid request body'})
  @ApiOkResponse({description: 'Clothes has been created'})
  create(@Body() createClothesDto: CreateClothesDto) {
    return this.clothesService.create(createClothesDto);
  }
  
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'color', required: false, description: 'Filter by color' })
  @ApiQuery({ name: 'size', required: false, description: 'Filter by size' })
  findAll(
    @Query('color') color?: string,
    @Query('size') size?: string
  ) {
    return this.clothesService.findAll(color, size);
  }
  
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({description: "Successfully retrieve clothes"})
  @ApiNotFoundResponse({description: 'Clothes with gived id not found'})
  findOne(@Param('id') id: string) {
    return this.clothesService.findOne(id);
  }
  
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiNotFoundResponse({description: 'Clothes with gived id not found'})
  @ApiBadRequestResponse({description: 'Invalid request body'})
  @ApiOkResponse({description: 'Clothes updated successfully'})
  update(@Param('id') id: string, @Body() updateClothesDto: UpdateClothesDto) {
    return this.clothesService.update(id, updateClothesDto);
  }
  
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNotFoundResponse({description: 'Clothes with gived id not found'})
  @ApiNoContentResponse({description: 'Clothes deleted successfully'})
  remove(@Param('id') id: string) {
    return this.clothesService.remove(id);
  }
  
  @Patch('stock/add/:id')
  @HttpCode(HttpStatus.OK)
  @ApiNotFoundResponse({description: 'Clothes with gived id not found'})
  @ApiOkResponse({description: 'Clothes stock updated successfully'})
  addStock(@Param('id') id: string, @Body() updateStockDto: UpdateStockDTO) {
    return this.clothesService.updateStock(id, updateStockDto, 'ADD')
  }
  
  @Patch('stock/remove/:id')
  @HttpCode(HttpStatus.OK)
  @ApiNotFoundResponse({description: 'Clothes with gived id not found'})
  @ApiOkResponse({description: 'Clothes stock updated successfully'})
  removeStock(@Param('id') id: string, @Body() updateStockDto: UpdateStockDTO) {
    return this.clothesService.updateStock(id, updateStockDto, 'REMOVE')
  }

  @Get('stock/run-out')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({description: "Successfully retrieve clothes with 0 stock"})
  findRunOutStock() {
    return this.clothesService.findRunOutStock()
  }

  @Get('stock/limited')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({description: "Successfully retrieve clothes with < 5 stock"})
  findLimitedStock() {
    return this.clothesService.findLimitedStock()
  }
}
