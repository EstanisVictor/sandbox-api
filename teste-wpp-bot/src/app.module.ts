import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
            
      envFilePath: '.env',

      validationSchema: Joi.object({
        WHATSAPP_PROVIDER: Joi.string().valid('WEB_API', 'META_CLOUD').required(),

        META_API_TOKEN: Joi.string().when('WHATSAPP_PROVIDER', {
          is: 'META_CLOUD',
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
        META_PHONE_NUMBER_ID: Joi.string().when('WHATSAPP_PROVIDER', {
          is: 'META_CLOUD',
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
        META_VERIFY_TOKEN: Joi.string().when('WHATSAPP_PROVIDER', {
          is: 'META_CLOUD',
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
      }),
    }),
    WhatsappModule
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
