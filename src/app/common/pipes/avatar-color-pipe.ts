import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'avatarColor',
})
export class AvatarColorPipe implements PipeTransform {
  private readonly colors = [
    '#EF4444',
    '#F97316',
    '#F59E0B',
    '#10B981',
    '#06B6D4',
    '#3B82F6',
    '#6366F1',
    '#8B5CF6',
    '#EC4899',
    '#14B8A6'
  ];
  transform(value: string | null | undefined): Record<string, string> {
    if (!value) {
      return { 'background-color': '#ece9fc', color: '#2a1261' };
    }
    
    const hash = [...value].reduce((sum, c) => sum + c.charCodeAt(0), 0);
    const bg = this.colors[hash % this.colors.length];

    return { 'background-color': bg, color: '#fff' };
  }
}
