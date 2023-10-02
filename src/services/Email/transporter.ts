import nodemailer from "nodemailer";
import config from "../../config";

const transporterOptions = {
  host: config.EMAIL.EMAIL_SMTP,
  port: 587,
  secure: false,
  auth: {
    user: config.EMAIL.EMAIL_ID,
    pass: config.EMAIL.EMAIL_PASSWORD,
  },
};

export let transporter = nodemailer.createTransport(transporterOptions);

export async function sendEmail({ from, to, subject, html }) {
  let info = await transporter.sendMail({
    from,
    to,
    subject,
    html,
  });

  if (config.NODE_ENV !== "production") {
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }

  return info;
}
