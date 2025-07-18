import { Module } from '@nestjs/common';
import { WhatsappController } from './whatsapp.controller';
import { WhatsappService } from './whatsapp.service';
import { WebApiProvider } from './providers/web-api.provider';
import { MetaCloudProvider } from './providers/meta-cloud.provider';
import { SchedulingService } from './scheduling.service'; 
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [WhatsappController],
  providers: [
    WhatsappService,
    WebApiProvider,
    MetaCloudProvider,
    SchedulingService,
   ]
})
export class WhatsappModule {}
