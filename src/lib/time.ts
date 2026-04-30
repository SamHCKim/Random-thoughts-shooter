import { formatDistanceToNow, format } from 'date-fns';
import { ko } from 'date-fns/locale';

export function formatRelative(iso: string): string {
  return formatDistanceToNow(new Date(iso), { addSuffix: true, locale: ko });
}

export function formatAbsolute(iso: string): string {
  return format(new Date(iso), 'yyyy년 M월 d일 HH:mm', { locale: ko });
}
