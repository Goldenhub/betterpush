import { addDays } from "date-fns";
import jwt, { type Secret, type SignOptions, type VerifyOptions, TokenExpiredError } from "jsonwebtoken";
import type { StringValue } from "ms";
import crypto from "node:crypto";
import type { tokenPayload } from "./token.interface";
import config from "../config";
import prisma from "../prisma/client";
import { CustomError } from "../utils/customError";
import { compareValue, hashValue } from "../utils/helpers";

const { ACCESS_TOKEN_EXPIRATION, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_EXPIRATION } = config;
const access_expiresIn: StringValue = ACCESS_TOKEN_EXPIRATION as StringValue;
const access_secret = ACCESS_TOKEN_SECRET as Secret;
const refresh_expiresIn = Number(REFRESH_TOKEN_EXPIRATION);

export const tokenService = {
  async generateAccessToken(payload: tokenPayload, options?: SignOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      const signOptions: SignOptions = {
        ...options,
        expiresIn: access_expiresIn,
      };
      jwt.sign(payload, access_secret, signOptions, (err, token) => {
        if (err || !token) {
          return reject(err || new Error("Token could not be generated"));
        }
        resolve(token);
      });
    });
  },

  async verifyAccessToken<T extends object>(token: string, options?: VerifyOptions): Promise<T> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, access_secret, options, (err, decoded) => {
        if (err || !decoded) {
          if (err instanceof TokenExpiredError) {
            return reject(new CustomError("Token expired", 401));
          }
          return reject(err || new Error("Token could not be verified"));
        }
        resolve(decoded as T);
      });
    });
  },

  async generateRefreshToken() {
    const token = crypto.randomBytes(64).toString("hex");
    return token;
  },

  async storeRefreshToken(refreshToken: string, userId: string, userAgent: string, deviceId: string, ip: string) {
    const hashedRefreshToken = crypto.createHash("sha256").update(refreshToken).digest("hex");
    await prisma.refreshToken.upsert({
      where: {
        user_id_device_id: {
          user_id: userId,
          device_id: deviceId,
        },
        user_agent: userAgent,
      },
      update: {
        tokenHash: hashedRefreshToken,
        user_agent: userAgent,
        ip,
      },
      create: {
        tokenHash: hashedRefreshToken,
        user_id: userId,
        device_id: deviceId,
        user_agent: userAgent,
        ip,
        expires_at: addDays(new Date(), refresh_expiresIn),
      },
    });
  },
  async verifyRefreshToken(refreshToken: string) {
    const record = await prisma.refreshToken.findFirst({
      where: {
        tokenHash: crypto.createHash("sha256").update(refreshToken).digest("hex"),
        expires_at: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
        tokenHash: true,
        user_id: true,
        user: true,
      },
    });

    if (!record) {
      throw new CustomError("Invalid refresh token", 401);
    }

    return {
      sub: record.user_id,
      id: record.id,
      user: record.user,
    };
  },

  async rotateRefreshToken(oldToken: string, userId: string, userAgent: string, deviceId: string, ip: string) {
    const record = await this.verifyRefreshToken(oldToken);
    if (!record) {
      throw new CustomError("Invalid refresh token", 401);
    }

    await prisma.refreshToken.delete({
      where: {
        id: record.id,
        user_id: record.user.id,
      },
    });

    // new refresh token
    const newToken = await this.generateRefreshToken();
    await this.storeRefreshToken(newToken, userId, userAgent, deviceId, ip);
    return newToken;
  },

  async deleteRefreshToken(token: string, userId: string, deviceId: string) {
    const record = await this.verifyRefreshToken(token);
    if (!record) {
      throw new CustomError("Invalid refresh token", 401);
    }

    await prisma.refreshToken.delete({
      where: {
        id: record.id,
        user_id: userId,
        device_id: deviceId,
      },
    });

    return true;
  },
};
