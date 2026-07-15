import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { AppModule } from './app.module'
import { loadConfig } from './config'

async function bootstrap() {
  const config = loadConfig()
  const app = await NestFactory.create(AppModule, { bodyParser: true })
  app.setGlobalPrefix('api/v1')
  app.use(helmet({ crossOriginResourcePolicy: false }))
  app.use(cookieParser())
  app.enableCors({ origin: config.CMS_WEB_ORIGIN, credentials: true, methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'] })
  const document = SwaggerModule.createDocument(app, new DocumentBuilder().setTitle('Pesaba CMS API').setVersion('1.0').build())
  SwaggerModule.setup('api/docs', app, document)
  await app.listen(config.CMS_API_PORT, '0.0.0.0')
}

void bootstrap()
