import { Test, TestingModule } from '@nestjs/testing';
import { ClothesController } from './clothes.controller';
import { ClothesService } from './clothes.service';
import { Clothes, PrismaClient, Size } from '@prisma/client';
import { PrismaService } from '../plugin/prisma/prisma.service';
import { PrismaModule } from '../plugin/prisma/prisma.module';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { CreateClothesDto } from './dto/create-clothes.dto';
import { UpdateClothesDto } from './dto/update-clothes.dto';
import { UpdateStockDTO } from './dto/update-stock.dto';

describe('ClothesController', () => {
  let controller: ClothesController;
  let service: ClothesService;
  let prismaMock: DeepMockProxy<PrismaClient>

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>()
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [ClothesController],
      providers: [
        {
          provide: PrismaService,
          useValue: {
            prismaMock
          }
        },
        ClothesService
      ],
    }).compile();

    controller = module.get<ClothesController>(ClothesController);
    service = module.get<ClothesService>(ClothesService);
  });

  const mockClothes1: Clothes = {
    id: 'abc-1',
    color: 'white',
    size: Size.L,
    price: 1000,
    stock: 10,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const mockClothes2: Clothes = {
    id: 'abc-3',
    color: 'red',
    size: Size.L,
    price: 2000,
    stock: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const mockClothes3: Clothes = {
    id: 'abc-4',
    color: 'cyan',
    size: Size.XL,
    price: 2000,
    stock: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllClothes', () => {
    const allClothes = [mockClothes1, mockClothes2]

    it('should return all clothes', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue(allClothes)

      const result = await controller.findAll()

      expect(result).toEqual(allClothes)
    })

    it('should return clothes based on search query', async () => {
      const color = "white"
      const size = "L"
      jest.spyOn(service, 'findAll').mockResolvedValue([mockClothes1])

      const result = await controller.findAll(color, size)
      
      expect(result).toEqual([mockClothes1])
    })
  })

  describe('getOneClothes', () => {
    it('should return only one clothes based on its id', async () => {
      const id = "abc-1"
      jest.spyOn(service, 'findOne').mockResolvedValue(mockClothes1)

      const result = await controller.findOne(id)

      expect(result).toEqual(mockClothes1)
    })
  })

  describe('createClothes', () => {
    it('should return new clothes', async () => {
      const dto: CreateClothesDto = {
        color: 'white',
        size: Size.L,
        price: 10000,
        stock: 10
      }

      jest.spyOn(service, 'create').mockResolvedValue(mockClothes1)

      const result = await controller.create(dto)

      expect(result).toEqual(mockClothes1)
    })
  })

  describe('updateClothes', () => {
    it('should return updated clothes', async () => {

      const id = "abc-1"
      const dto: UpdateClothesDto = {
        color: 'red',
        size: Size.XL,
        price: 10000,
        stock: 10
      }

      const updatedClothes = {
        id: 'abc-1',
        color: 'red',
        size: Size.XL,
        price: 1000,
        stock: 10,
        createdAt: mockClothes1.createdAt,
        updatedAt: new Date()
      }
  
      jest.spyOn(service, 'update').mockResolvedValue(updatedClothes)
  
      const result = await controller.update(id, dto)

      expect(result).toEqual(updatedClothes)
      expect(service.update).toHaveBeenCalledWith(id, dto)
    })
  })

  describe('removeClothes', () => {
    it('should remove clothes based on gived id', async () => {
      const id = "abc-1"
      jest.spyOn(service, 'remove').mockResolvedValue()
      await controller.remove(id)

      expect(service.remove).toHaveBeenCalledWith(id)
    })
  })

  describe('updateStock', () => {
    it('should add clothes stock', async () => {
      const id = "abc-1"
      const dto: UpdateStockDTO = {
        stock: 2
      }
      const updatedStock = {
        id: 'abc-1',
        color: 'white',
        size: Size.L,
        price: 1000,
        stock: 12,
        createdAt: mockClothes1.createdAt,
        updatedAt: new Date()
      }

      jest.spyOn(service, 'updateStock').mockResolvedValue(updatedStock)

      const result = await controller.addStock(id, dto)

      expect(result).toEqual(updatedStock)
      expect(service.updateStock).toHaveBeenCalledWith(id, dto, 'ADD')
    })

    it('should decrease clothes stock', async () => {
      const id = "abc-1"
      const dto: UpdateStockDTO = {
        stock: 2
      }
      const updatedStock = {
        id: 'abc-1',
        color: 'white',
        size: Size.L,
        price: 1000,
        stock: 8,
        createdAt: mockClothes1.createdAt,
        updatedAt: new Date()
      }

      jest.spyOn(service, 'updateStock').mockResolvedValue(updatedStock)

      const result = await controller.removeStock(id, dto)

      expect(result).toEqual(updatedStock)
      expect(service.updateStock).toHaveBeenCalledWith(id, dto, 'REMOVE')
    })
  })

  describe('Get Specific Stock', () => {
    it('should return clothes with stock < 5', async () => {
      const limitedStock = [mockClothes2, mockClothes3]
      jest.spyOn(service, 'findLimitedStock').mockResolvedValue(limitedStock)
      
      const result = await controller.findLimitedStock()

      expect(result).toEqual(limitedStock)
    })

    it('should return clothes with 0 stock', async () => {
      const zeroStock = [mockClothes3]
      jest.spyOn(service, 'findRunOutStock').mockResolvedValue(zeroStock)
      
      const result = await controller.findRunOutStock()

      expect(result).toEqual(zeroStock)
    })
  })
});
