import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import config from "../../config";
import * as constants from "../../config/constants";
import { evaluateString } from "../../utils/strings";
import { sendEmail } from "./transporter";
import logger from "../../packages/Logs/logger";

const defaultData = {
  app: constants.APP,
  logo: constants.LOGO_URL,
};

export default class Email {
  from: string;
  subject: string;
  to: string;
  template: string;
  data: any;
  html: string;

  constructor(
    subject: string = "",
    to: string = "",
    template: string = "",
    data: object = {},
    from = '"Blogs" <noreply@umakantv.one>'
  ) {
    this.subject = subject;
    this.to = to;
    this.template = template;
    this.data = {
      ...defaultData,
      ...data,
    };
    this.from = from;
  }

  addData(data: any) {
    this.data = {
      ...this.data,
      ...data,
    };
  }

  protected prepareContent(): string {
    const file = fs
      .readFileSync(path.resolve(__dirname, this.template))
      .toString();
    const html = evaluateString(file, this.data, false);

    return html;
  }

  async sendEmail() {
    this.html = this.prepareContent();

    if (config.NODE_ENV !== "test") {
      const info = await sendEmail({
        from: this.from,
        to: this.to,
        subject: this.subject,
        html: this.html,
      });
      if (config.NODE_ENV !== "production") {
        logger.warn(this.data);
        logger.info(`Message sent: ${info.messageId}`, info);
        logger.debug(
          `Preview URL: ${nodemailer.getTestMessageUrl(info)}`,
          info
        );
      }
    }
  }
}
