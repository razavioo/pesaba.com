import { Module } from '@nestjs/common'
import { AuthModule } from './auth'
import { AdminContentController, ContentService, PublicContentController } from './content'
import { ContactController, AdminLeadsController, LeadsService } from './leads'
import { MediaController, MediaService } from './media'
import { AdminOperationsController, OperationsService, PublicOperationsController } from './operations'
import { DatabaseModule } from './prisma.service'
import { AdminSettingsController, PublicSettingsController, SettingsService } from './settings'

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [
    PublicContentController,
    AdminContentController,
    PublicSettingsController,
    AdminSettingsController,
    ContactController,
    AdminLeadsController,
    MediaController,
    PublicOperationsController,
    AdminOperationsController,
  ],
  providers: [ContentService, SettingsService, LeadsService, MediaService, OperationsService],
})
// Nest module marker; behavior is declared by its decorator.
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AppModule {}
