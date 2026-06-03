import { Expose } from 'class-transformer';

export class CheckAuthResDto {
  @Expose()
  authorized: boolean;

  constructor(payload: Partial<CheckAuthResDto>) {
    Object.assign(this, payload);
  }
}
