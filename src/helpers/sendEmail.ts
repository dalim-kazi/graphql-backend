import nodemailer from "nodemailer";
import envConfig from "../config/env.config";
const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  text?: string
) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
      user: envConfig.emailSender.email,
      pass: envConfig.emailSender.app_pass,
    },
  });

  // Email options
  const mailOptions = {
    from: envConfig.emailSender.email,
    to,
    subject,
    html,
    text,
  };
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
