import bcrypt from "bcryptjs";
import AppError from "../../packages/Error/AppError";
import GithubService from "../../services/GithubOAuth/github";
import userModel from "../User/repo";
import { generateToken } from "../../utils/tokens";
import { validate } from "../../packages/Validator";
import * as authValidators from "./validator";
import { ErrorCodes } from "../../packages/Error/Errors";
import { generateOTP } from "../../utils/strings";
import Email from "../../services/Email/Email";
import moment from "moment";
import { templates } from "../../services/Email";
import { BaseService } from "../Base/Service";

let githubService = new GithubService();

function generateUserToken(user) {
  return generateToken(user);
}

export default class AuthService extends BaseService {
  constructor(repo) {
    super(repo);
  }

  async login(emailOrUsername: string, password: string) {
    authValidators.validateLoginCredentials(emailOrUsername, password);

    let existingUser = await userModel
      .findOne({
        $or: [
          {
            email: emailOrUsername,
          },
          {
            username: emailOrUsername,
          },
        ],
      })
      .select("+password");

    if (existingUser) {
      let match = bcrypt.compareSync(password, existingUser.password);

      if (match) {
        // produce a JWT token
        let user = existingUser.toJSON();
        delete user.password;

        let token = generateUserToken(user);

        return { user, token };
      } else {
        throw new AppError("Password is wrong", 400);
      }
    } else {
      throw new AppError("User does not exist with the given email", 400);
    }
  }

  async register({
    name,
    username,
    email,
    password,
  }: {
    name: string;
    username: string;
    email: string;
    password: string;
  }) {
    authValidators.validateUsername(username);
    validate(authValidators.register, {
      name,
      email,
      username,
      password,
    });

    let existingUser = await userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      throw new AppError(
        "User already exists with the given email or username",
        400,
        ErrorCodes.USER_ALREADY_EXISTS
      );
    } else {
      password = bcrypt.hashSync(password);
      let user = await userModel.create({
        name,
        username,
        email,
        password,
      });

      sendVerifyEmailOTP({ email });

      let userData = user.toJSON();

      delete userData.password;

      return userData;
    }
  }

  async githubSignin(code: string) {
    validate(authValidators.githubSigninCode, code);

    const userDetails = await githubService.getUser(code);

    let existingUser = await userModel.findOne({
      authType: "github",
      githubUsername: userDetails.login,
    });

    if (!existingUser) {
      existingUser = await userModel.create({
        authType: "github",
        name: userDetails.name,
        username: userDetails.login,
        githubUsername: userDetails.login,
        image: userDetails.avatar_url,
        email: userDetails.email,
      });
    }

    let user = existingUser.toJSON();
    delete user.password;

    let token = generateUserToken(user);

    return { token, user };
  }

  async checkUsernameTaken(username: string) {
    authValidators.validateUsername(username);

    let existingUser = await userModel.findOne({
      username,
    });

    if (existingUser) return true;

    return false;
  }

  async sendVerifyEmailOTP({ email }: { email: string }) {
    const user = await userModel.findOne({ email });

    if (user.verified) {
      throw new AppError(
        "User is already verified",
        400,
        ErrorCodes.USER_ALREADY_VERIFIED
      );
    }

    const otp = generateOTP();

    const mail = new Email(
      "Welcome - Verify your Email",
      email,
      templates.VERIFY_EMAIL,
      {
        name: user.name,
        otp,
      }
    );

    await mail.sendEmail();

    await userModel.updateOne(
      { _id: user._id },
      {
        verifyOtp: {
          otp,
          validTill: moment().add(1, "day").unix(),
        },
      }
    );
  }

  async verifyEmail({ email, otp }: { email: string; otp: string }) {
    const user = await userModel.findOne(
      { email },
      {
        _id: 1,
        verifyOtp: 1,
      }
    );

    if (user.verified) {
      throw new AppError(
        "User is already verified",
        400,
        ErrorCodes.USER_ALREADY_VERIFIED
      );
    }

    if (user.verifyOtp) {
      if (user.verifyOtp.otp == otp) {
        if (user.verifyOtp.validTill > moment().unix()) {
          await userModel.updateOne(
            { _id: user._id },
            {
              verified: true,
              verifyOtp: null,
            }
          );
        } else {
          throw new AppError(
            "OTP has expired.",
            400,
            ErrorCodes.VERIFY_OTP_EXPIRED
          );
        }
      } else {
        throw new AppError("OTP does not match.", 400, ErrorCodes.OTP_MISMATCH);
      }
    } else {
      throw new AppError("OTP does not exist", 404);
    }
  }

  async sendResetPasswordOTP({ email }: { email: string }) {
    const user = await userModel.findOne({ email });

    const otp = generateOTP();

    const mail = new Email(
      "Reset Your Password",
      email,
      templates.RESET_PASSWORD,
      {
        name: user.name,
        otp,
      }
    );

    await mail.sendEmail();

    await userModel.updateOne(
      { _id: user._id },
      {
        resetPasswordOtp: {
          otp,
          validTill: moment().add(1, "day").unix(),
        },
      }
    );
  }

  async resetPassword({
    email,
    otp,
    password,
  }: {
    email: string;
    otp: string;
    password: string;
  }) {
    const user = await userModel.findOne(
      { email },
      {
        resetPasswordOtp: 1,
      }
    );

    if (user.resetPasswordOtp) {
      if (user.resetPasswordOtp.otp == otp) {
        if (user.resetPasswordOtp.validTill > moment().unix()) {
          password = await bcrypt.hash(password, 10);

          await userModel.updateOne(
            { _id: user._id },
            {
              verified: true,
              password,
              resetPasswordOtp: null,
            }
          );
        } else {
          throw new AppError(
            "OTP has expired.",
            400,
            ErrorCodes.RESET_PASSWORD_OTP_EXPIRED
          );
        }
      } else {
        throw new AppError("OTP does not match.", 400, ErrorCodes.OTP_MISMATCH);
      }
    } else {
      throw new AppError("OTP does not exist", 404);
    }
  }
}
