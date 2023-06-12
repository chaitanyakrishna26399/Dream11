const { valid } = require('joi');
const joi = require('joi')
class validation {
  static async selectPlayers(req, res, next) {
    const validation = joi.object({
      TeamName:joi.string().required(),
      Players: joi.array().required().items().min(11).max(11),
      Captain:joi.string().required(),
      viceCaptain:joi.string().required()
    })
    const options = {
            errors: {
                wrap: {
                    label: ''
                }
            }
        };
    const err = validation.validate(req.body,options);
    if (err.error) {
      //return error message.
      res.send(err.error.details[0].message)
    } else {
      //moves to next method.
      next();
    }
  }
}

module.exports = validation

