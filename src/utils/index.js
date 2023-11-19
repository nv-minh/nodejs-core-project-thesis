const _ = require('lodash')

const checkEnable = (value) => {
  return value === "true";
};

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};
module.exports = {
  checkEnable,
  getInfoData
};