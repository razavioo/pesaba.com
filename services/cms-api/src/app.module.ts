import { Module } from '@nestjs/common'
import { AuthModule } from './auth'
import { AdminContentController, ContentService, PublicContentController } from './content'
import { AdminContentV2Controller, ContentV2Service, PublicContentV2Controller } from './content-v2'
import { ContactController, AdminLeadsController, LeadsService } from './leads'
import { MediaController, MediaService, PublicMediaController } from './media'
import { AdminOperationsController, OperationsService, PublicOperationsController } from './operations'
import { DatabaseModule } from './prisma.service'
import { AdminSettingsController, PublicSettingsController, SettingsService } from './settings'
import { AdminAiProvidersController, AiProvidersService } from './ai-providers'

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [
    PublicContentController,
    AdminContentController,
    PublicContentV2Controller,
    AdminContentV2Controller,
    PublicSettingsController,
    AdminSettingsController,
    ContactController,
    AdminLeadsController,
    MediaController,
    PublicMediaController,
    PublicOperationsController,
    AdminOperationsController,
    AdminAiProvidersController,
  ],
  providers: [ContentService, ContentV2Service, SettingsService, LeadsService, MediaService, OperationsService, AiProvidersService],
})
// Nest module marker; behavior is declared by its decorator.
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AppModule {}
