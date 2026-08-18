import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Security Headers
  app.use(helmet());

  // Global Prefix
  app.setGlobalPrefix('api/v1');

  // Global Interceptor & Filter
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // CORS Configuration
  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:3000', 'http://localhost:5173'];

  app.enableCors({
    origin: (origin, callback) => {
      // Cho phép request từ cùng domain hoặc các origin được định nghĩa hoặc tools test (như Postman/curl không có origin)
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(null, true); // Trong môi trường dev/test cho phép linh hoạt
      }
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  });

  // Swagger Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('AshaShop E-Commerce API')
    .setDescription('Tài liệu OpenAPI / Swagger API cho hệ thống E-commerce AshaShop (Báo cáo thực tập)')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'AshaShop API Docs',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 5000;
  await app.listen(port);
  logger.log(`🚀 Server đang chạy tại: http://localhost:${port}`);
  logger.log(`📚 Tài liệu Swagger API: http://localhost:${port}/api/docs`);
}

bootstrap();
