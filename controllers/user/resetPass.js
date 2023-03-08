const passport = require('../../config/passportConfig');
const prisma = require('../../config/prismaConfig');
const inputsValidator = require('../../utils/inputValidators/resetPass');
const storeValidatedInputs = require('../../utils/middleware/storeValidatedInputs');
const bcrypt = require('bcryptjs');
const UnauthorizedErr = require('../../utils/errors/unauthorized');

const controller = [
  // authorization
  passport.authenticate('jwt', { session: false }),

  storeValidatedInputs(inputsValidator),
  
  // check for password being correct and if it is, change it
  async (req, res, next) => {
    let isMatch = await bcrypt.compare(
      res.locals.validatedBody.oldPass,
      req.user.password
    )
      .catch(next);

    if (!isMatch) {
      return next(new UnauthorizedErr('oldPass is incorrect.'))
    }

    let newHashedPass = await bcrypt.hash(res.locals.validatedBody.newPass, 16);

    prisma.users.update({
      where: { id: req.user.id },
      data: {
        password: newHashedPass,
      },
    })
      .then(() => res.end())
      .catch(next);
  }
];

module.exports = controller;
