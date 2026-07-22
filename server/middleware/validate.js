// middleware/validate.js - 参数校验中间件（规范 validation）
const Joi = require('joi');
const { fail } = require('../utils/response.util');

/**
 * 校验 req.body / req.query / req.params
 * @param {object} schema { body?, query?, params? }
 */
module.exports = (schema) => {
  return (req, res, next) => {
    const sources = { body: req.body, query: req.query, params: req.params };
    for (const key of Object.keys(sources)) {
      if (schema[key]) {
        const { error, value } = schema[key].validate(sources[key], { stripUnknown: true });
        if (error) {
          return res.status(400).json(fail(400, error.details[0].message));
        }
        req[key] = value;
      }
    }
    next();
  };
};
