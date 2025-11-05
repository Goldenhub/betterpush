import { format } from "date-fns";
import { enqueueMail } from "../email/email.queue";
import { emailHTML } from "../email/templates";
import { PrismaClient } from "../generated/prisma";
import { hashValue } from "../utils/helpers";

const base = new PrismaClient();

const prisma = base.$extends({
  query: {
    user: {
      create({ args, query }) {
        if (args.data.password) {
          args.data.password = hashValue(args.data.password);
        }
        return query(args);
      },
      update({ args, query }) {
        if (args.data.password) {
          args.data.password = hashValue(args.data.password as string);
        }
        return query(args);
      },
    },
    refreshToken: {
      async upsert({ args, query }) {
        // Determine whether a record already exists
        const existing = await base.refreshToken.findUnique({
          where: {
            user_id_device_id: {
              user_id: args.create.user_id as string,
              device_id: args.create.device_id as string,
            },
            user_agent: args.create.user_agent as string,
          },
          select: { id: true },
        });

        // Run the upsert
        const result = await query(args);

        // Only send mail if it's a new record (create branch)
        if (!existing) {
          const user = await base.user.findUnique({
            where: { id: result.user_id },
          });

          if (user) {
            const username = user?.username as string;
            const email = user?.email as string;
            const userAgent = result.user_agent as string;
            const ip = result.ip as string;

            const emailData = {
              username,
              email,
              userAgent,
              ip,
              subject: "New Login",
            };

            // queue mail
            const now = new Date().toISOString();
            const formatted = format(now, "MMM d, yyyy, h:mm:ss a");
            const html = await emailHTML.newLogin({ username, userAgent, ip, loginDate: formatted });
            enqueueMail(emailData, html);
          }
        }

        return result;
      },
    },
  },
});

export default prisma;
