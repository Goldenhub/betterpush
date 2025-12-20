import { boss } from "../config/queue";
import { sendEmail } from "./email.service";

export const mailWorker = async (queue: string) => {
  await boss.work(queue, async ([job]) => {
    const data = job?.data as {
      username: string;
      email: string;
      subject: string;
      verificationToken: string;
      html: string;
    };

    const emailData = {
      username: data.username,
      email: data.email,
      subject: data.subject,
      verificationToken: data.verificationToken,
    };
    const html = data.html;

    sendEmail(emailData, html);
  });
};
