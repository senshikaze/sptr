import { Pipe, PipeTransform } from '@angular/core';
import  {DateTime} from 'luxon';

@Pipe({
  name: 'relativedate'
})
export class LuxonRelativePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): any {
    let date = DateTime.fromISO(value);
    return date.toRelative();
  }

}
