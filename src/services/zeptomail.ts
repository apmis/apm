import { SendMailClient } from 'zeptomail';

let client: SendMailClient | null = null;

function getClient(): SendMailClient {
  if (!client) {
    const url = 'api.zeptomail.com/';
    const token = process.env.ZEPTOMAIL_TOKEN || '';
    if (!token) {
      console.warn('ZEPTOMAIL_TOKEN is not set — emails will not be sent');
    }
    client = new SendMailClient({ url, token });
  }
  return client;
}

const fromAddress = () => process.env.ZEPTOMAIL_FROM || 'admin@lumenware.com.ng';
const fromName = () => process.env.ZEPTOMAIL_FROM_NAME || 'APM Campaign';

export interface SendEmailParams {
  to: string;
  toName?: string;
  subject: string;
  htmlBody: string;
  textBody?: string;
}

export async function sendEmail(params: SendEmailParams) {
  const { to, toName, subject, htmlBody, textBody } = params;

  try {
    const mailClient = getClient();
    const result = await mailClient.sendMail({
      from: { address: fromAddress(), name: fromName() },
      to: [
        {
          email_address: {
            address: to,
            name: toName || '',
          },
        },
      ],
      subject,
      htmlbody: htmlBody,
      textbody: textBody || '',
      track_clicks: true,
      track_opens: true,
    });
    return result;
  } catch (error) {
    console.error('Failed to send email via ZeptoMail:', error);
    throw error;
  }
}
