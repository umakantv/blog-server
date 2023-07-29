import * as authService from "./service";
import { type NextFunction, type Request, type Response } from "express";
import { RequestContext } from "../../types/Context";

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.body;

    let { email, password } = user;

    let { token } = await authService.login(email, password);

    return res.status(200).send({
      status: "success",
      data: {
        token,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getLoggedInUser(
  req: RequestContext,
  res: Response,
  next: NextFunction
) {
  try {
    const { user } = req;

    if (user) {
      return res.status(200).send({
        status: "success",
        data: user,
      });
    } else {
      return res.status(400).send({
        status: "error",
        message: "User not logged in",
      });
    }
  } catch (err) {
    next(err);
  }
}

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let { name, username, email, password } = req.body;

    let user = await authService.register({
      name,
      username,
      email,
      password,
    });

    return res.status(200).send({
      status: "success",
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

export async function githubSignin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { code } = req.params;

    let { token } = await authService.githubSignin(code);

    return res.status(200).send({
      status: "success",
      data: {
        token,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function checkUsernameAvailable(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { username } = req.params;

    let taken = await authService.checkUsernameTaken(username);

    if (taken) {
      return res.status(409).send({
        status: "success",
        data: {
          message: "Username is not available",
        },
      });
    }

    return res.status(200).send({
      status: "success",
      data: {
        message: "Username is available",
      },
    });
  } catch (err) {
    next(err);
  }
}
