import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'settingsGroupLabel', standalone: true })
export class SettingsGroupLabelPipe implements PipeTransform {
  transform(groups: any[], activeGroup: string): string {
    return groups.find(g => g.key === activeGroup)?.label || '';
  }
}

@Pipe({ name: 'settingsGroupIcon', standalone: true })
export class SettingsGroupIconPipe implements PipeTransform {
  transform(groups: any[], activeGroup: string): string {
    return groups.find(g => g.key === activeGroup)?.icon || '';
  }
}

@Pipe({ name: 'settingsGroupName', standalone: true })
export class SettingsGroupNamePipe implements PipeTransform {
  transform(groups: any[], activeGroup: string): string {
    return groups.find(g => g.key === activeGroup)?.label || '';
  }
}
