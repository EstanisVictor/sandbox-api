import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IWhatsAppProvider } from './providers/whatsapp-provider.interface';
import { WebApiProvider } from './providers/web-api.provider';
import { MetaCloudProvider } from './providers/meta-cloud.provider';
import { SchedulingService } from './scheduling.service';

@Injectable()
export class WhatsappService implements OnModuleInit {
  private provider: IWhatsAppProvider;

  constructor(
    private readonly configService: ConfigService,
    private readonly webApiProvider: WebApiProvider,
    private readonly metaCloudProvider: MetaCloudProvider,
    private readonly schedulingService: SchedulingService,
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

  async proposeAppointment(to: string, patientName: string, details: string, date: string, time: string) {
    // 1. Cria o agendamento com status PENDENTE no nosso "banco de dados"
    const appointment = this.schedulingService.createProposedAppointment(to, details, date, time);

    // 2. Monta os componentes do template
    const components = [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: patientName },
          { type: 'text', text: details },
          { type: 'text', text: date },
          { type: 'text', text: time },
        ],
      },
      {
        type: 'button',
        sub_type: 'quick_reply',
        index: '0', // <-- LIGAÇÃO COM O 1º BOTÃO CRIADO NA INTERFACE
        parameters: [
          { 
            type: 'payload', 
            payload: `CONFIRMAR_AGENDAMENTO_${appointment.id}`
          }
        ],
      },

      // E AQUI PARA O SEGUNDO BOTÃO
      {
        type: 'button',
        sub_type: 'quick_reply',
        index: '1',
        parameters: [
          { 
            type: 'payload', 
            payload: `CANCELAR_AGENDAMENTO_${appointment.id}` 
          }
        ],
      },
    ];


    // 3. Envia a mensagem usando o template
    // Garanta que o provedor seja o MetaCloudProvider para isso funcionar
    if (this.provider instanceof MetaCloudProvider) {
      await this.provider.sendTemplateMessage(
        to,
        'proposta_agendamento_consulta', // Nome exato do template aprovado
        'pt_BR',
        components,
      );
    } else {
        console.error("Este recurso só está disponível para o provedor META_CLOUD.");
    }
  }

  // Método para processar a lógica do webhook da API Oficial
  handleIncomingMessage(payload: any) {
    const messageData = payload.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!messageData) return;

    // Se a mensagem for uma resposta de botão interativo
    if (messageData.type === 'interactive' && messageData.interactive.type === 'button_reply') {
      const buttonPayload = messageData.interactive.button_reply.id;
      const userPhone = messageData.from;

      const [action, appointmentId] = buttonPayload.split('_');
      
      if (action === 'CONFIRMAR') {
        this.schedulingService.confirmAppointment(appointmentId);
        this.sendMessage(userPhone, '✅ Ótimo! Seu agendamento foi confirmado com sucesso. Te esperamos!');
      } else if (action === 'CANCELAR') {
        this.schedulingService.cancelAppointment(appointmentId);
        this.sendMessage(userPhone, 'Tudo bem. O agendamento foi cancelado. Se precisar, é só chamar!');
      }
      return;
    }
    
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