const accountModel = require("../models/account.model");


/**
 * Finds an account in the database by email.
 *
 * @param {Object} options - The options object.
 * @param {string} options.email - The email address of the account.
 * @param {Object} [options.select] - The fields to select from the account.
 * @param {number} [options.select.email] - The select option for the email field.
 * @param {number} [options.select.password] - The select option for the password field.
 * @param {number} [options.select.status] - The select option for the status field.
 * @param {number} [options.select.roles] - The select option for the roles field.
 * @param {number} [options.select.name] - The select option for the name field.
 * @return {Promise<Object|null>} The account object if found, or null if not found.
 */
const findByEmail = async ({
                             email, select = {
    email: 1, password: 2, status: 3, roles: 4, name: 5
  }
                           }) => {

  return await accountModel.findOne({ email }).select(select).lean();
};

module.exports = {
  findByEmail
};