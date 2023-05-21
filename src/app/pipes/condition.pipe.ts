import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'condition'
})
export class ConditionPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): string {
    let color = "text-white";
    if(value < 75) {
      color = "text-yellow";
    }
    if (value < 25) {
      color = "text-red";
    }
    return color;
  }

}
