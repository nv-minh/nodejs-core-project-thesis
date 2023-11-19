const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
  REFRESH_TOKEN: "refresh-token",
  X_CLIENT_ID: "x-client-id",
  BEARER: "Bearer "
};
const JWT = require("jsonwebtoken");


/**
 * Creates a token pair using the provided payload, public key, and private key.
 *
 * @param {Object} payload - The payload for generating the token pair.
 * @param {string | Object} publicKey - The public key used for token generation.
 * @param {string} privateKey - The private key used for token generation.
 * @return {Promise} A promise that resolves with the generated token pair.
 */
const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // auth token
    const accessToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "1 days"
    });


    //refresh token
    const refreshToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "2 days"
    });

    // verify key
    verifyJwt(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(`error verify:: `, err);
      } else {
        console.log("decode verify::", decode);
      }
    });
    return {
      accessToken,
      refreshToken
    };
  } catch (error) {
    console.error("createTokenPair error::", error);
  }
};

const verifyJwt = (token, keySecret) => {
  return JWT.verify(token, keySecret);
};

module.exports = {
  createTokenPair
};