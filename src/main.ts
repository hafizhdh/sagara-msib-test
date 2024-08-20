import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe())
  
  const config = new DocumentBuilder()
    .setTitle('Clothes API')
    .setDescription('The Clothes API description for sagara study case')
    .setVersion('1.0')
    .addTag('clothes')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api-docs', app, document)
  
  await app.listen(process.env.PORT || 3300);
}
bootstrap();
