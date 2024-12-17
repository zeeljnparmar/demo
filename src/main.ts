import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from "cookie-parser";
import { PORT } from './constants/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
      origin: 'http://localhost:3000',
      credentials: true
  })

  const config = new DocumentBuilder()
  .setTitle('brokerage')
  .setVersion('1.0')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('brooker', app, document);
  await app.listen(PORT);
}
bootstrap();


//?======  SWAGGER URL ================
//!"http://localhost:3000/brooker#/default"