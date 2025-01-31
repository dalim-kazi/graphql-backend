import envConfig from "../../../config/env.config";
import ApiError from "../../../errors/ApiErrors";
import generateOTP from "../../../helpers/generateOtp";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import sendEmail from "../../../helpers/sendEmail";
import uploadToDigitalOcean from "../../../helpers/uploadToDigitalOcean";
import prisma from "../../../shared/prisma";
import bcrypt from "bcryptjs";

// ✅ Login User
const loginUserIntoDB = async (payload: any) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (!user) throw new ApiError(404, "User not found");

  const isPasswordValid = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordValid) throw new ApiError(401, "Invalid credentials");

  const accessToken = jwtHelpers.generateToken(
    user,
    envConfig.jwt.jwt_secret as string,
    envConfig.jwt.expires_in as string
  );
  const { password, ...userInfo } = user;

  return {
    accessToken,
    userInfo,
    message: "User logged in successfully",
    success: true,
  };
};

// ✅ Login With Social Auth
const loginUserWithSocialAuth = async (payload: any) => {
  let user = await prisma.user.findUnique({ where: { email: payload.email } });

  if (!user) {
    user = await prisma.user.create({ data: { ...payload } });
  }

  const accessToken = jwtHelpers.generateToken(
    user,
    envConfig.jwt.jwt_secret as string,
    envConfig.jwt.expires_in as string
  );
  const { password, ...userInfo } = user;

  return { accessToken, userInfo, message: "Login successful", success: true };
};

// ✅ Send Forgot Password OTP
const sendForgotPasswordOtpDB = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new ApiError(404, "User not found");

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  await sendEmail(
    email,
    "Your Password Reset OTP",
    `<p>Your OTP is: <b>${otp}</b></p>`
  );
  await prisma.otp.upsert({
    where: { email },
    update: { otpCode: otp, expiresAt },
    create: { email, otpCode: otp, expiresAt },
  });

  return { otp, message: "OTP sent successfully", success: true };
};

// ✅ Verify OTP
const verifyForgotPasswordOtpCodeDB = async (payload: any) => {
  const { email, otp } = payload;
  const verifyData = await prisma.otp.findUnique({ where: { email } });

  if (!verifyData || verifyData.otpCode !== otp) {
    throw new ApiError(401, "Invalid or expired OTP");
  }

  if (Date.now() > verifyData.expiresAt.getTime()) {
    await prisma.otp.delete({ where: { email } });
    throw new ApiError(410, "OTP expired. Request a new one.");
  }

  await prisma.otp.delete({ where: { email } });

  return { message: "OTP verified successfully", success: true };
};

// ✅ Reset Password
const resetForgotPasswordDB = async (newPassword: string, userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(404, "User not found");

  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(envConfig.jwt.gen_salt)
  );
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { message: "Password reset successful", success: true };
};

// ✅ Get User Profile
const getProfileFromDB = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(404, "User not found");

  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
};

// ✅ Update Profile
const updateProfileIntoDB = async (userId: string, userData: any) => {
  let uploadedImageUrl = null;

  if (userData.profileImage) {
    uploadedImageUrl = await uploadToDigitalOcean(userData.profileImage);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...userData,
      ...(uploadedImageUrl && { profileImage: uploadedImageUrl }),
    },
  });

  const { password, ...sanitizedUser } = updatedUser;
  return sanitizedUser;
};

export const authService = {
  loginUserIntoDB,
  loginUserWithSocialAuth,
  sendForgotPasswordOtpDB,
  verifyForgotPasswordOtpCodeDB,
  resetForgotPasswordDB,
  getProfileFromDB,
  updateProfileIntoDB,
};
