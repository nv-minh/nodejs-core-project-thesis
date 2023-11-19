const KeyTokenService = require("../services/keyToken.service");
const { Api403Error, Api401Error, BusinessLogicError } = require("../core/error.response");
const { findByEmail } = require("./account.service");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { createTokenPair } = require("../auth/authUtils");
const RoleAccount = {
  USER: "USER", WRITER: "001", READ: "002", DELETE: "003", ADMIN: "000"
};
const apiKeyModel = require('../models/apiKey.model')
const { getInfoData } = require("../utils/index");
const accountModel = require("../models/account.model");

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


  signUp = async ({ name, email, password }) => {
    // step 1: check email exists
    const holderAccount = await accountModel.findOne({ email }).lean();
    if (holderAccount) {
      throw new Api403Error("email already");
    }
    const passwordHash = await bcrypt.hash(password, 10);

    const newAccount = await accountModel.create({
      name, email, password: passwordHash, roles: [RoleAccount.USER]
    });

    if (!newAccount) {
      return null;
    }

    // create private key, public key
    const {
      publicKey,
      privateKey
    } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "pkcs1",
        format: "pem"
      },
      privateKeyEncoding: {
        type: "pkcs1",
        format: "pem"
      }
    });
    console.log(privateKey, "---", publicKey);


    const publicKeyString = await KeyTokenService.createKeyToken({
      userId: newAccount._id,
      publicKey: publicKey.toString(),
      privateKey: privateKey.toString()
    });

    if (!publicKeyString) {
      throw new BusinessLogicError("createKeyToken::error::");
    }
    console.log("publicKeyString:: ", publicKeyString);
    // create pub
    const publicKeyObject = await crypto.createPublicKey(publicKeyString);
    console.log("publicKeyObject:: ", publicKeyObject);


    // created token pair
    const tokens = await createTokenPair(
      {
        userId: newAccount._id,
        email
      },
      publicKeyObject,
      privateKey
    );
    console.log("Created token success:: ", tokens);
    // apiKey
    const newKey = await apiKeyModel.create({
      key: crypto.randomBytes(64).toString("hex"), permissions: ["0000"]
    });
    return {
      account: getInfoData(
        {
          fields: ["_id", "name", "email"],
          object: newAccount
        }
      ),
      tokens,
      key: getInfoData
      (
        {
          fields: ["key"],
          object: newKey
        })
    };
  };
}


module.exports = new AccessService();