const keyTokenModel = require("../models/keytoken.model");
const { Types } = require("mongoose");


class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
    try {
      const filter = { user: userId };
      const update = {
        publicKey, privateKey, refreshTokensUsed: [], refreshToken
      };
      const options = { upsert: true, new: true };

      const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options);

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      console.error("createKeyToken::error::", error);
      throw error;
    }
  };
  static deleteKeyById = async (userId) => {
    return await keyTokenModel.findByIdAndDelete({ userId: userId });
  };
}


module.exports = KeyTokenService;