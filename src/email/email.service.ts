import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

const EmailService = {
  sendEmail: async (data: Record<string, string>, emailHTML: string) => {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST as string,
      //   port: process.env.SMTP_PORT || 465,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    } as SMTPTransport.Options);

    const mailOptions = {
      from: `"BetterPush" <support@betterpush.io>`,
      to: data.email,
      subject: data.subject,
      html: emailHTML,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent");
  },
};

export const sendEmail = EmailService.sendEmail;

export default EmailService;
