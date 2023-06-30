const authService = require("../services/auth.service");

async function login(req, res, next) {
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

async function getLoggedInUser(req, res, next) {
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

async function register(req, res, next) {
  try {
    let { name, email, password } = req.body;

    let user = await authService.register({
      name,
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

async function githubSignin(req, res, next) {
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

module.exports = {
  register,
  login,
  getLoggedInUser,
  githubSignin,
};
