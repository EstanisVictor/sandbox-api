export interface IWhatsAppProvider {
  initialize(): Promise<void>;
  sendMessage(to: string, message: string): Promise<any>;
}