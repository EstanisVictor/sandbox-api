import { Controller, Get, Post, Body, Query, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { WhatsappService } from './whatsapp.service';
import { ConfigService } from '@nestjs/config';

@Controller('whatsapp')
export class WhatsappController {
  constructor(
    private readonly whatsappService: WhatsappService,
    private readonly configService: ConfigService,
  ) {}

  // Endpoint para enviar uma mensagem (útil para testes)
  @Post('send')
  async sendMessage(@Body() body: { to: string; message: string }) {
    return this.whatsappService.sendMessage(body.to, body.message);
  }

  @Post('propose-appointment')
  async propose(@Body() body: { to: string; patientName: string; details: string; date: string; time: string }) {
      return this.whatsappService.proposeAppointment(
          body.to, 
          body.patientName, 
          body.details, 
          body.date, 
          body.time
      );
  }
  @Get('webhook')
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.challenge') challenge: string,
    @Query('hub.verify_token') token: string,
    @Res() res: Response,
  ) {
    const verifyToken = this.configService.get<string>('META_VERIFY_TOKEN');
    if (mode === 'subscribe' && token === verifyToken) {
      console.log('Webhook verificado com sucesso!');
      res.status(HttpStatus.OK).send(challenge);
    } else {
      res.sendStatus(HttpStatus.FORBIDDEN);
    }
  }

  // A Meta faz um POST com as atualizações (novas mensagens, etc.)
  @Post('webhook')
  handleWebhook(@Body() body: any, @Res() res: Response) {
    this.whatsappService.handleIncomingMessage(body);
    res.sendStatus(HttpStatus.OK);
  }
}