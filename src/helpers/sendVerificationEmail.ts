import { transporter } from '@/lib/nodemailer';
import { render } from '@react-email/render';
import VerificationEmail from '../../emails/VerificationEmail';
import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    let emailHtml = '';
    try {
      emailHtml = render(VerificationEmail({ username, otp: verifyCode }));
    } catch (renderError) {
      console.warn('React Email render fallback triggered:', renderError);
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #333;">Hello ${username},</h2>
          <p style="color: #555; font-size: 16px;">Thank you for registering. Please use the following verification code to complete your registration:</p>
          <div style="background-color: #f4f4f4; padding: 12px 24px; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #111; text-align: center; border-radius: 6px; margin: 20px 0;">
            ${verifyCode}
          </div>
          <p style="color: #777; font-size: 14px;">If you did not request this code, please ignore this email.</p>
        </div>
      `;
    }

    const senderEmail = process.env.SMTP_USER || 'no-reply@mysterymessage.com';
    const fromAddress = process.env.EMAIL_FROM || `"Mystery Message" <${senderEmail}>`;

    await transporter.sendMail({
      from: fromAddress,
      to: email,
      subject: 'Mystery Message Verification Code',
      html: emailHtml,
      text: `Hello ${username},\n\nYour verification code is: ${verifyCode}\n\nIf you did not request this code, please ignore this email.`,
    });

    return { success: true, message: 'Verification email sent successfully.' };
  } catch (emailError) {
    console.error('Error sending verification email:', emailError);
    return { success: false, message: 'Failed to send verification email.' };
  }
}
