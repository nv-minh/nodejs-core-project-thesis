const KeyTokenService = require("../services/keyToken.service");
const { Api403Error, Api401Error } = require("../core/error.response");
const { findByEmail } = require("./account.service");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { createTokenPair } = require("../auth/authUtils");
const RoleAccount = {
  USER: "USER", WRITER: "001", READ: "002", DELETE: "003", ADMIN: "000"
};

class AccessService {
  /**
   * check this token used?
   *  @param refreshToken
   *  @param user
   *  @param keyStore
   *  @return {Promise<void>}
   */

  refreshToken = async ({ refreshToken, user, keyStore }) => {
    const { userId, email } = user;
    console.log({ userId, email });

    if (keyStore.refreshTokenUsed.includes(refreshToken)) {
      // notify send email error

      //delete token in keyStore
      await KeyTokenService.deleteKeyById(userId);
      throw new Api403Error("Access token has been used");
    }

    if (refreshToken !== keyStore.refreshToken) throw Api401Error("Access token is invalid");

    // check userId
    const foundUser = await findByEmail({ email });
    if (!foundUser) throw new Api401Error("User not found");


    // create accessToken, refreshToken
    const pairToken = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey);

    // update token
    await keyStore.update({
      $set: {
        refreshToken: pairToken.refreshToken
      }, $addToSet: {
        refreshTokenUsed: refreshToken
      }
    });

    // return new tokens
    return {
      user, pairToken
    };
  };
}


module.exports = new AccessService();