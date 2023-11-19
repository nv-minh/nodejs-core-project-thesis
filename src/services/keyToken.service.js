const keyTokenModel = require("../models/keytoken.model");
const { Types } = require("mongoose");


class KeyTokenService {
  static deleteKeyById = async (userId) => {
    return await keyTokenModel.findByIdAndDelete({ userId: userId });
  };
}


module.exports = KeyTokenService;