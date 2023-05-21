import { Pipe, PipeTransform } from '@angular/core';
import { Trait } from '../interfaces/trait';

@Pipe({
  name: 'joinTraits'
})
export class JoinTraitsPipe implements PipeTransform {

  transform(value: Trait[], ...args: string[]): string {
    return value.map(t => t.symbol).join(args[0] ?? ', ');
  }

}
