import { BankHolidaysInterface } from './bank-holidays.interface';
import { isHoliday } from 'poland-public-holidays';

export class PolishBankHolidaysService implements BankHolidaysInterface {
  public isTodayBankHoliday(): boolean {
    const today = new Date();
    return isHoliday(today);
  }
}
