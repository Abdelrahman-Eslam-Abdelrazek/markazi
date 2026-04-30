import type { NotificationEvent } from "./events";

export class NotificationDispatcher {
  async dispatch(event: NotificationEvent): Promise<void> {
    const channels = event.channels ?? ["in_app"];

    const dispatches = channels.map((channel) => {
      switch (channel) {
        case "whatsapp":
          return this.sendWhatsApp(event);
        case "sms":
          return this.sendSms(event);
        case "email":
          return this.sendEmail(event);
        case "in_app":
          return this.sendInApp(event);
      }
    });

    await Promise.allSettled(dispatches);
  }

  private async sendWhatsApp(_event: NotificationEvent): Promise<void> {
    // TODO: Implement WhatsApp Business API
  }

  private async sendSms(_event: NotificationEvent): Promise<void> {
    // TODO: Implement SMS via Infobip
  }

  private async sendEmail(_event: NotificationEvent): Promise<void> {
    // TODO: Implement email via Resend
  }

  private async sendInApp(_event: NotificationEvent): Promise<void> {
    // TODO: Implement in-app via Redis pub/sub
  }
}
