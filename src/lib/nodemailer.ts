import nodemailer from 'nodemailer';

const host = process.env.SMTP_HOST?.trim();
const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT.trim(), 10) : 465;
const secure = process.env.SMTP_SECURE !== undefined ? process.env.SMTP_SECURE.trim() === 'true' : port === 465;
const user = process.env.SMTP_USER?.trim();
const pass = process.env.SMTP_PASSWORD?.trim();

/**
 * Reusable Nodemailer transporter instance.
 * Supports standard SMTP (host, port, secure) as well as predefined services (e.g. Gmail).
 */
export const transporter = nodemailer.createTransport(
  host
    ? {
        host,
        port,
        secure,
        auth: {
          user,
          pass,
        },
      }
    : {
        service: process.env.SMTP_SERVICE?.trim() || 'gmail',
        auth: {
          user,
          pass,
        },
      }
);
