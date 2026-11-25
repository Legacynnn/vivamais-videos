export function fn<T extends (...args: never[]) => unknown>(impl?: T) {
  return ((...args: never[]) => impl?.(...args)) as T;
}
