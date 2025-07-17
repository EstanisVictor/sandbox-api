import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IWhatsAppProvider } from './providers/whatsapp-provider.interface';
import { WebApiProvider } from './providers/web-api.provider';
import { MetaCloudProvider } from './providers/meta-cloud.provider';

@Injectable()
export class WhatsappService implements OnModuleInit {
  private provider: IWhatsAppProvider;

  constructor(
    private readonly configService: ConfigService,
    private readonly webApiProvider: WebApiProvider,
        private readonly metaCloudProvider: MetaCloudProvider,
  ) {}

  async onModuleInit() {
    const providerType = this.configService.get<string>('WHATSAPP_PROVIDER');

    if (providerType === 'WEB_API') {
      this.provider = this.webApiProvider;
    } else if (providerType === 'META_CLOUD') {
      this.provider = this.metaCloudProvider;
    } else {
      throw new Error('Provedor de WhatsApp não especificado ou inválido.');
    }

    await this.provider.initialize();
  }

  async sendMessage(to: string, message: string): Promise<any> {
    return this.provider.sendMessage(to, message);
  }

  // Método para processar a lógica do webhook da API Oficial
  handleIncomingMessage(payload: any) {
    const messageData = payload.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!messageData || messageData.type !== 'text') {
        return;
    }

    const from = messageData.from;
    const body = messageData.text.body;

    console.log(`Mensagem recebida de ${from} via Webhook: ${body}`);
    
    // Lógica do Bot
    if(body.toLowerCase() === 'ping') {
        this.sendMessage(from, 'Pong!');
    }
  }
}