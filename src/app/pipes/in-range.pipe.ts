import { Pipe, PipeTransform } from '@angular/core';
import { System } from '../interfaces/system';
import { Ship } from '../interfaces/ship';
import { ApiService } from '../services/api.service';
import { ModuleSymbols } from '../enums/module-symbols';

@Pipe({
  name: 'inRange'
})
export class InRangePipe implements PipeTransform {
  jumpModules: ModuleSymbols[] = [
    ModuleSymbols.MODULE_JUMP_DRIVE_I,
    ModuleSymbols.MODULE_JUMP_DRIVE_II,
    ModuleSymbols.MODULE_JUMP_DRIVE_III
  ];

  constructor(private api: ApiService) {}

  transform(value: System, ...args: any[]): string {
    let ship = args[0] as Ship;
    let system = args[1] as System;
    if (value.symbol == args[0].nav.systemSymbol) {
      return "text-gray";
    }
    let module = ship.modules.filter(m => this.jumpModules.map(ms => ms.toString()).includes(m.symbol));
    if (module.length == 0) {
      return "text-gray"
    }
    return (Math.sqrt(Math.pow(Math.abs(value.x - system.x), 2) + Math.pow(Math.abs(value.y - system.y), 2)) <= module[0].range) ?
      "text-green" : "text-red"
  }

}
