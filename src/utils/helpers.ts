import crypto from "node:crypto";
import { compareSync, genSaltSync, hashSync } from "bcryptjs";
import config from "../config";
import { passwordRegex } from "../constants";

export function hashValue(value: string) {
  const salt = genSaltSync(10);
  const hash = hashSync(value, salt);
  return hash;
}

export function compareValue(value: string, hash: string) {
  return compareSync(value, hash);
}

export const generateRandomPassword = (length = 12) => {
  // Define character sets
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numberChars = "0123456789";
  const specialChars = '!@#$%^&*()_+-=[]{}|;:",./<>?~';

  // Combine all character sets for filling the rest of the password
  const allChars = lowercaseChars + uppercaseChars + numberChars + specialChars;

  // Initialize the password with at least one of each required character type
  let password = "";
  password += lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
  password += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
  password += numberChars[Math.floor(Math.random() * numberChars.length)];
  password += specialChars[Math.floor(Math.random() * specialChars.length)];

  // Fill the remaining length of the password with random characters
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password string to ensure randomness
  password = password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

  return password;
};

export const generateOneTimePassword = () => {
  const otp = Math.floor(Math.random() * 1000000);

  return String(otp).padStart(6, "0");
};

export const generateVerificationCode = (length = 12) => {
  // Define character sets
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numberChars = "0123456789";

  // Combine all character sets for filling the rest of the password
  const allChars = lowercaseChars + uppercaseChars + numberChars;

  // Initialize the password with at least one of each required character type
  let code = "";
  code += lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
  code += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
  code += numberChars[Math.floor(Math.random() * numberChars.length)];

  // Fill the remaining length of the code with random characters
  for (let i = code.length; i < length; i++) {
    code += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password string to ensure randomness
  code = code
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

  return code;
};

export const isPasswordValid = (password: string): boolean => {
  return passwordRegex.test(password);
};

export const paginate = <T>(data: T[], count: number, page?: string, limit?: string) => {
  const pageInt = page ? parseInt(page, 10) : 1;
  const perPageInt = limit ? parseInt(limit, 10) : 10;
  const total = count;
  const pagination = {
    total,
    page: pageInt,
    limit: perPageInt,
    totalPage: Math.ceil(total / perPageInt),
  };

  return { data, pagination };
};

const algorithm = "aes-256-gcm";
const { ENCRYPTION_KEY } = config as { ENCRYPTION_KEY: string };
const iv = crypto.randomBytes(16);
const secret_key = Buffer.from(ENCRYPTION_KEY, "hex");

export function encrypt(text: string) {
  const cipher = crypto.createCipheriv(algorithm, secret_key, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decrypt(data: string) {
  const [ivHex, tagHex, encryptedHex] = data.split(":");
  const iv = Buffer.from(ivHex as string, "hex");
  const tag = Buffer.from(tagHex as string, "hex");
  const encrypted = Buffer.from(encryptedHex as string, "hex");

  const decipher = crypto.createDecipheriv(algorithm, secret_key, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString();
}
