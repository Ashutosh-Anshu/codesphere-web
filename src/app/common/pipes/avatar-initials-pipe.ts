import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'avatarInitials',
})
export class AvatarInitialsPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value?.trim())
      return '?';

    const parts = value.trim().split(/\s+/);
    const firstInitial = parts[0].charAt(0).toUpperCase();

    if (parts.length === 1) 
      return firstInitial;

    const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
    return `${lastInitial}${firstInitial}`;
  }
}
