export interface MailerGateway {
    send (recipient: string, subject: string, content: string): Promise<void>;
}

export class MailerGatewayMemory 