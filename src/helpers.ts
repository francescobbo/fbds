export function clsx(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
