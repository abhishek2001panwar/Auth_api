import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
import { User } from "@/app/models/user.model";

export const sendEmail = async ({ email, emailtype, userId }) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailtype === "VERIFY") {
      const UpdatedUSer = await User.findByIdAndUpdate(userId, {
        $set: {
          verifyToken: hashedToken,
          verifyTokenExpiry: Date.now() + 3600000,
        },
      });
    } else if (emailtype === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "2f5bc5430d9aee",
        pass: "837b689268abfc",
      },
    });

    const mailOption = {
      from: "abhishek2001panwar@gmail.com",
      to: email,
      subject:
        emailtype === "VERIFY" ? "VERIFY YOUR EMAIL" : "RESET YOUR PASSWORD",
      html: `<p>Click <a href="${
        process.env.DOMAIN
      }/verifyemail?token=${hashedToken}">here</a> ${
        emailtype === "VERIFY" ? "VERIFY YOUR EMAIL" : "RESET YOUR PASSWORD"
      }
      or copy and paste the link below in your browser. <br> ${
        process.env.DOMAIN
      }/verifyemail?token=${hashedToken}
      </p>`,
    };

    const mailresponse = await transport.sendMail(mailOption);
    return mailresponse;
  } catch (error) {
    throw error; // Throw the original error without creating a new one
  }
};
