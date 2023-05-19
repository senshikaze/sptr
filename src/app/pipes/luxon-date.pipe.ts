import { Pipe, PipeTransform } from '@angular/core';
import { DateTime, DateTimeFormatOptions } from 'luxon';

@Pipe({
  name: 'formatdate'
})
export class LuxonDatePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): any {
    let date = DateTime.fromISO(value);

    return date.toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
  }

}
