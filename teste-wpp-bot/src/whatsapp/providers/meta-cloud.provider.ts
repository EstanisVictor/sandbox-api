import { Injectable, Logger } from '@nestjs/common';
import { IWhatsAppProvider } from './whatsapp-provider.interface';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class MetaCloudProvider implements IWhatsAppProvider {
  private readonly logger = new Logger(MetaCloudProvider.name);
  private readonly apiUrl: string;
  private readonly apiToken: string;
  private readonly phoneNumberId: string;

  constructor(private configService: ConfigService) {
    const apiToken = this.configService.get<string>('META_API_TOKEN');
    const phoneNumberId = this.configService.get<string>('META_PHONE_NUMBER_ID');
    if (!apiToken || !phoneNumberId) {
      throw new Error('As variáveis de ambiente da Meta não estão configuradas!');
    }
    this.apiToken = apiToken;
    this.phoneNumberId = phoneNumberId;
    this.apiUrl = `https://graph.facebook.com/v19.0/${this.phoneNumberId}/messages`;
  }

  async initialize(): Promise<void> {
    this.logger.log('Provedor Meta Cloud API pronto. Aguardando webhooks...');
    // A inicialização aqui é passiva, apenas garante que as configs estão carregadas.
    if (!this.apiToken || !this.phoneNumberId) {
        throw new Error('As variáveis de ambiente da Meta não estão configuradas!');
    }
  }

  async sendMessage(to: string, message: string): Promise<any> {
    try {
      this.logger.log(`Enviando mensagem para ${to} via Meta Cloud API`);
      const response = await axios.post(
        this.apiUrl,
        {
          messaging_product: 'whatsapp',
          to: to,
          type: 'text',
          text: { body: message },
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      this.logger.error('Erro ao enviar mensagem pela Meta API:', error.response?.data);
      throw error;
    }
  }

  async sendTemplateMessage(
    to: string, 
    templateName: string, 
    languageCode: string, 
    components: any[]
  ): Promise<any> {
      try {
        this.logger.log(`Enviando template ${templateName} para ${to}`);
        const payload = {
          messaging_product: 'whatsapp',
          to: to,
          type: 'template',
          template: {
            name: templateName,
            language: {
              code: languageCode,
            },
            components: components,
          },
        };
        const response = await axios.post(this.apiUrl, payload, {
          headers: {
            Authorization: `Bearer ${this.apiToken}`,
            'Content-Type': 'application/json',
          },
        });
        return response.data;
      } catch (error) {
        this.logger.error('Erro ao enviar template pela Meta API:', error.response?.data);
        throw error;
      }
  }
}