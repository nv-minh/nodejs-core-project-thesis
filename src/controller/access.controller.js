const catchAsync = require("../helpers/catch.async");
const { OK, CREATED } = require("../core/success.response");
const accessService = require('../services/access.service')

class AccessController {
  login = catchAsync(async (req, res) => {
    OK(res, "Login success!", await accessService.signIn(req.body));
  });

  signUp = catchAsync(async (req, res) => {
    CREATED(res, "Register success", await accessService.signUp(req.body));
  });

  refreshToken = catchAsync(async (req, res) => {
    OK(res, "Get token success", await accessService.refreshToken({
      refreshToken: req.refreshToken,
      user: req.user,
      keyStore: req.keyStore
    }))
  })
}


module.exports = new AccessController();