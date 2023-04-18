const prisma = require('../../config/prismaConfig');
const passport = require('../../config/passportConfig');
const superAdminAuth = require('../../utils/middleware/superAdminAuth');
const bcrypt = require('bcryptjs');
const NotFoundErr = require('../../utils/errors/notFoundErr');
const BadRequestErr = require('../../utils/errors/badRequestErr');

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  superAdminAuth,

  async (req, res, next) => {
    if (!isFinite(req.params.id)) {
      return next(new BadRequestErr('پارامتر id باید یک عدد باشد.'));
    }

    let register = await prisma.non_approved_places.findUnique({
      where: { id: +req.params.id },
    })
      .catch(next);

    if (!register) {
      return next(new NotFoundErr('درخواستی برای این مکان پیدا نشد.'));
    }

    if (register.status === 'denied' || register.status === 'approved') {
      return next(new BadRequestErr('وضعیت ثبت این درخواست را نمی‌توان تغییر داد.'));
    }

    await prisma.places.create({
      data: {
        owner_id: register.owner_id,
        name: register.name,
        type: register.type,
        license_id: register.license_id,
        address: register.address,
        city: register.city,
        password: bcrypt.hashSync(register.code),
      },
    })
      .catch(next);

    prisma.non_approved_places.update({
      where: { id: register.id },
      data: { status: 'approved' },
    })
      .then(() => res.end())
      .catch(next);
  }
];

module.exports = controller;
