import { PlaceRegisterService } from './registers.place.service';
import { placeRegisterInputs } from '../../types/interfaces/inputs';
import { BadRequestErr, ForbiddenErr } from '../../helpers/errors';

async function createRegisterReq(this: PlaceRegisterService, ownerId: number, data: placeRegisterInputs) {
  const ownerRegReqCount = await this.getOwnerRegisterReqCountById(ownerId);

  if (ownerRegReqCount > 5) {
    throw new ForbiddenErr('شما نمی‌توانید همزمان بیشتر از ۵ درخواست ثبت کنید');
  }

  const code = await this.generateRegisterCode();
  const isLicenseDuplicate = await this.checkForDuplicateLicenseId(data.license_id);

  if (isLicenseDuplicate) {
    throw new BadRequestErr('قبلاً یک مکان با این شماره گواهینامه ثبت شده است');
  }

  await this.registerReqs.create({
    data: {
      owner_id: ownerId,
      status: 'waiting',
      code,
      ...data,
    }
  });

  return code;
}

export { createRegisterReq };
