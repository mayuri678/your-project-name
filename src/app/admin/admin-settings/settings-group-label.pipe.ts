import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'settingsGroupLabel', standalone: true })
export class SettingsGroupLabelPipe implements PipeTransform {
  transform(groups: { label: string; icon: string; keys: string[] }[], activeGroup: string): string {
    return groups.find(g => g.label.toLowerCase() === activeGroup)?.label || '';
  }
}
