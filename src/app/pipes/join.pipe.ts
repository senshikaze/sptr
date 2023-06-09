import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'join'
})
export class JoinPipe implements PipeTransform {

  transform(value: string[], ...args: string[]): string {
    return value.join(args[0] ?? ', ');
  }

}
