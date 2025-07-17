import { Logger } from "@nestjs/common";
import { IWhatsAppProvider } from "./whatsapp-provider.interface";
import { Client, LocalAuth } from "whatsapp-web.js";
import * as qrcode from 'qrcode-terminal';

export class WebApiProvider implements IWhatsAppProvider {
    private readonly logger = new Logger(WebApiProvider.name);
    private client: Client;

    constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
      }
    });
  }

    async initialize(): Promise<void> {
        this.logger.log('Inicializando o provedor Web API (Não-oficial)...');

        this.client.on('qr', (qr) => {
        this.logger.log('QR Code recebido, escaneie por favor:');
        qrcode.generate(qr, { small: true });
        });

        this.client.on('ready', () => {
        this.logger.log('Cliente Web API pronto e conectado!');
        });

        this.client.on('message', async (message) => {
        this.logger.log(`Mensagem recebida de ${message.from}: ${message.body}`);
        
        if (message.body.toLowerCase() === 'ping') {
            await this.sendMessage(message.from, 'Pong!');
        }
        });

        await this.client.initialize();
    }

    async sendMessage(to: string, message: string): Promise<any> {
        this.logger.log(`Enviando mensagem para ${to}`);
        return this.client.sendMessage(to, message);
    }
}