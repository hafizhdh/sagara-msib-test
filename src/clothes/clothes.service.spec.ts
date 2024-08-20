import { Test, TestingModule } from '@nestjs/testing';
import { ClothesService } from './clothes.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../plugin/prisma/prisma.service';

describe('ClothesService', () => {
  let service: ClothesService;
  let prismaMock: DeepMockProxy<PrismaClient>

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>()
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClothesService,
        {
          provide: PrismaService,
          useValue: {
            prismaMock
          }
        },
      ],
    }).compile();

    service = module.get<ClothesService>(ClothesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
