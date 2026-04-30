import { formatDistanceToNow, format } from 'date-fns';
import { ko } from 'date-fns/locale';

export function formatRelative(iso: string): string {
  const date = new Date(Math.min(new Date(iso).getTime(), Date.now()));
  return formatDistanceToNow(date, { addSuffix: true, locale: ko });
}

export function formatAbsolute(iso: string): string {
  return format(new Date(iso), 'yyyy년 M월 d일 HH:mm', { locale: ko });
}
