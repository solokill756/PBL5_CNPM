import crypto from "crypto";

// Tạo mã OTP 6 chữ số
export const generateOtp = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};
