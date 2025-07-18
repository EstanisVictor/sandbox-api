export interface IWhatsAppProvider {
  initialize(): Promise<void>;
  sendMessage(to: string, message: string): Promise<any>;
  sendTemplateMessage(
    to: string,
    templateName: string,
    languageCode: string,
    components?: any[],
  ): Promise<any>;
}