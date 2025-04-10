import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthServiceModule } from './auth-service.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthServiceModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: Number(process.env.AUTH_SERVICE_PORT) || 8081,
      },
    },
  );

  logger.log(
    `Microservice is listening on ${process.env.AUTH_SERVICE_PORT || 8081}`,
  );

  await app.listen();
}
bootstrap();
