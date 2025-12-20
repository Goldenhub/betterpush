import prisma from "../prisma/client";
import type { UpdateUserDto } from "./user.dto";

export const userService = {
  async getCurrentUser(id: string) {
    const response = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        email_verified: true,
        avatar_url: true,
      },
    });

    return response;
  },

  async getUser(id: string) {
    const response = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        email_verified: true,
        avatar_url: true,
      },
    });

    return response;
  },

  async updateUser(input: UpdateUserDto, id: string) {
    const response = await prisma.user.update({
      where: {
        id,
      },
      data: {
        ...input,
      },
    });

    return response;
  },
};
