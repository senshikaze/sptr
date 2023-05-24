import { Pipe, PipeTransform } from '@angular/core';
import { System } from '../interfaces/system';

@Pipe({
  name: 'distance'
})
export class DistancePipe implements PipeTransform {

  transform(value: System, ...args: unknown[]): string {
    let system = args[0] as System;
    return `Distance: ${Math.sqrt(Math.pow(Math.abs(value.x - system.x), 2) + Math.pow(Math.abs(value.y - system.y), 2))}`;
  }

}
