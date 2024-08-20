import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './plugin/prisma/prisma.module';
import { ClothesModule } from './clothes/clothes.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    ClothesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
