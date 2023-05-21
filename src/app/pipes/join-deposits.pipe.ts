import { Pipe, PipeTransform } from '@angular/core';
import { Deposit } from '../interfaces/deposit';

@Pipe({
  name: 'joinDeposits'
})
export class JoinDepositsPipe implements PipeTransform {

  transform(value: Deposit[], ...args: string[]): string {
    return value.map(d => d.symbol).join(args[0] ?? ', ');
  }

}
